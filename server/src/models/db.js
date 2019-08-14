let MongoClient = require('mongodb').MongoClient;

const MONGODB_CONNECTION_STRING = 'mongodb://database:27017'
const MONGODB_DBNAME = 'cocoa'

function DB(){

  this.connect = (cb) => {

    console.log("Connecting to mongo...")

    MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
  
      cb(err, client.db(MONGODB_DBNAME))
      
    })
  
  }

  this.listCollections = (cb) => {

    console.log("Listing collections...")

    this.connect((err, db) => {

      db.listCollections().toArray((err, values) => {

        cb(err, values)

      })

    })

  }

  this.dropCollections = (collections, cb) => {
    
    this.connect((err, db) => {

      db.listCollections().toArray((err, values) => {

        console.log("Dropping collections...")

        for (let collection of values) {

          if (['users', 'sessions'].includes(collection.name)) continue // skip these collections

          if (collections && collections.length && !collections.includes(collection.name)) continue // skip collections if not given in parameters

          db.collection(collection.name).drop()

        }

        cb()

      })

    })

  }

  this.bulkWrite = (collectionName, operations, cb) => {

    console.log("Loading data...")

    this.connect(async (err, db) => {

      let collection = db.collection(collectionName)

      await collection.bulkWrite(operations)

      cb()

    })

  }

  this.getEntityStatistics = (cb) => {

    this.connect(async (err, db) => {

      let stats = await db.collection('entities').aggregate([
        {
          $group: {
            _id: "$type",
            count: {$sum: 1}
          }, 
        }
      ]).toArray()

      cb(err, stats)

    })

  }

  this.getCollectionStatistics = (cb) => {

    this.connect(async (err, db) => {

      this.listCollections(async (err, collections) => {

        let stats = []

        for (let collection of collections) {

          stats.push({
            name: collection.name,
            count: await db.collection(collection.name).count()
          })

        }

        cb(err, stats)

      })

    })

  }

}

module.exports = new DB()
