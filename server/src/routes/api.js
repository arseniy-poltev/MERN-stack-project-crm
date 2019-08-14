let express = require('express');
let router = express.Router();
let path = require('path')
let Promise = require('bluebird')
let MongoClient = require('mongodb')
let ObjectID = require('mongodb').ObjectID
let connect = MongoClient.connect
let auth = require('../middleware/AuthService')
let socket = require('../middleware/Socket')
let manage = require('./manage')
router.use('/manage', manage) 

router.use(express.static(path.join(__dirname, '../public')));

let client

async function connect1(){
  if (client) return
  console.log("Connecting to mongo...")
  if (!client) client = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true })
}
connect1()

// // TODO: Remove this in production.
// router.get('/import', (req, res, next) => {
//   migrate(res)
//   res.send("Done.")
// })

// router.get('/update', (req, res, next) => {
//   update(res)
//   res.send("Done.")
// })

router.post('/v1/login', auth.login)
router.get('/v1/logout', auth.logout)
router.post('/v1/register', auth.register)
router.post('/v1/activate', auth.activate)

router.get('/v2/socket-test', (req, res, next) => {

  logger.info("socket test running")

  socket.connect().then(socket => {
    socket.emit("server test succeeded", {status: "success 123"})
    res.send("socket-test complete")
  })

})

router.use('/v1/**', auth.require)

router.get('/v1/user/session', async (req, res, next) => {

  res.json({ status: 'success', data: req.user })

  socket.connect().then(socket => socket.emit('session started', req.user))

})

router.post('/v1/:collection', async (req, res, next) => {

  let obj = Object.assign({
    created: (new Date()).toISOString(),
    createdBy: req.user._id,
    createdByEmail: req.user.email
  }, req.body)

  // convert _id to and ObjectID

  if (obj._id) obj._id = ObjectID(obj._id)

  obj = Object.assign(obj, {
    updated: (new Date()).toISOString(),
  })

  let insertRes = await client.db().collection(req.params.collection).insertOne(obj)

  let data = await client.db().collection(req.params.collection).findOne(ObjectID(insertRes.insertedId))

  res.json({ status: 'success', data })

  socket.connect().then(socket => socket.emit(`${req.params.collection} created`, data))

})

router.get('/v1/:collection/:id', async (req, res) => {

  let data = await client.db().collection(req.params.collection).findOne(ObjectID(req.params.id))

  res.json({ status: 'success', data })

})

router.get('/v1/:collection', async (req, res, next) => {

  let options = {
    limit: req.query.limit || 25,
    sort: req.query.sort && JSON.parse(req.query.sort) || {created: -1},
  }

  let data = await client.db().collection(req.params.collection).find().sort(options.sort).limit(options.limit).toArray()

  res.json({ status: 'success', data })

})

router.post('/v1/:collection/search', async (req, res, next) => {

  let options = {
    limit: req.body.limit || 25
  }

  let cur = await client.db().collection(req.params.collection).find(req.body.where)

  if (req.body.project) cur.project(req.body.project)

  if (req.body.sort) cur.sort(req.body.sort)

  if (req.body.skip) cur.skip(req.body.skip)

  let count = await cur.count()

  cur.limit(options.limit)

  let size = await cur.count({applySkipLimit: true})

  res.json({ status: 'success', count, size, limit: options.limit, skip: req.body.skip || 0, data: await cur.toArray() })

})

router.post('/v1/:collection/:id', async (req, res, next) => {

  req.body._id = ObjectID(req.params.id)

  await client.db().collection(req.params.collection).updateOne({_id: ObjectID(req.params.id)}, { $set: Object.assign(req.body, {

    updated: (new Date()).toISOString(),

  })}, {upsert: true})

  // let data = await client.db().ollection(req.params.collection).findOne(insertRes.insertedId)
  let data = req.body

  console.log("Sending http response...")

  res.json({ status: 'success', data })

  // socket.connect().then(socket => socket.emit(`${req.params.collection} updated`, data))

  // client.close()

})

router.put('/v1/:collection/:id', async (req, res, next) => {

  let $set = Object.assign(req.body, {updated: (new Date()).toISOString()})

  await client.db().collection(req.params.collection).updateOne({ _id: ObjectID(req.params.id) }, { $set })

  let data = await client.db().collection(req.params.collection).findOne(ObjectID(req.params.id))

  res.json({ status: 'success', data })

  socket.connect().then(socket => socket.emit(`${req.params.collection} updated`, data))

})

// TODO: Add version tracking using deep diff.
router.put('/v1/:collection', async (req, res, next) => {

  if (!req.body || !req.body._id) {
    return res.json({ status: 'failure', message: 'Missing "_id" field.' })
  }

  let payload = Object.assign({}, req.body)

  delete payload._id

  await client.db().collection(req.params.collection).updateOne({ _id: ObjectID(req.body._id) }, { $set: payload })

  let data = await client.db().collection(req.params.collection).findOne(ObjectID(req.body._id))

  res.json({ status: 'success', data })

  socket.connect().then(socket => socket.emit(`${req.params.collection} updated`, data))

})

router.delete('/v1/:collection/:id', async (req, res, next) => {

  try {

    if (!req.params.id) {

      return res.json({ status: 'failure', message: 'Missing parameter "id".' })

    }

    let data = await client.db().collection(req.params.collection).findOne(ObjectID(req.params.id))

    await client.db().collection(req.params.collection).deleteOne({ _id: ObjectID(req.params.id) })

    res.json({ status: 'success', data })

    socket.connect().then(socket => socket.emit(`${req.params.collection} deleted`, data))

  } catch (e) {

    console.error(e)

  }
  
})

module.exports = router;

