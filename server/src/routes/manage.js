var express = require('express');
var router = express.Router();

let db = require("../models/db")
let prelude = require('../models/prelude')

// let report = {
//     disposition: {},
//     gender: {},
//     scoreLanguageProficiency: {},
//     scoreConfident: {},
//     scorePositive: {},
//     scoreGenuine: {},
//     scoreEncouraging: {},
//     scoreModest: {},
//     scoreBodyLanguage: {},
// }

// function mapEmployee(o){
//     Object.keys(report).forEach(k => {
//         // console.log(k, o[k])
//         if (o[k]) report[k][o[k]] = true
//     })

//     return o
// }

// async function run(res) {
//     try {
//         data.forEach(o => {

//           o.migratedRecord = JSON.parse(JSON.stringify(o)) // create a copy of the migrated record
            
//           if (o.availability) {

//             let newAvailability = [
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//                 [false, false, false, false, false, false, false, ],
//               ]

//               o.availability.forEach(period => {
//                 let values = period.days.map(day => day.flag)
                
//                 console.log(period.period.name)
//                 switch(period.period.name){
//                 case 'Early Morning (5-8)':
//                     newAvailability[0] = values;
//                     break;
//                 case 'Mid Morning (8-11)': 
//                     newAvailability[1] = values;
//                     newAvailability[2] = values;
//                     newAvailability[3] = values;
//                     break;
//                 case 'Late Morning (11-12)': 
//                     newAvailability[4] = values;
//                     break;
//                 case 'Early Afternoon (12-2)': 
//                     newAvailability[5] = values;
//                     newAvailability[6] = values;
//                     break;
//                 case 'Mid Afternoon (2-4)': 
//                     newAvailability[7] = values;
//                     newAvailability[8] = values;
//                     break;
//                 case 'Late Afternoon (4-6)': 
//                     newAvailability[9] = values;
//                     newAvailability[10] = values;
//                     break;
//                 case 'Early Evening (6-8)': 
//                     newAvailability[11] = values;
//                     newAvailability[12] = values;
//                     newAvailability[13] = values;
//                     break;
    
//                 }
//               })
    
//               o.availability = newAvailability            
//           }

//         })
//           // .then(res => res.slice(res.length -3).map(o => {
//         //   .then(res => {
//         //     let results = res.map(o => {
//         //         if (o.type === 'employee') {
//         //             return mapEmployee(o)
//         //         }            
//         //         let type = o.type || 'unknown'
//         //         idx[type] = (idx[type] || 0) + 1
//         //         return o
//         //     })
//         //     console.log(idx)        
//         //     return results
//         //   })
//         connection.end()

//         // Drop the existing collection in MongoDB
//         const MongoClient = require('mongodb').MongoClient;
//         console.log("Connecting to mongo...")
//         var client = await (Promise.promisify(MongoClient.connect))(MONGODB_CONNECTION_STRING, { useNewUrlParser: true })
//         const db = client.db(MONGODB_DBNAME);
//         for (let p of [['employee', 'jobCandidates'], ['client', 'customers'], ['competitor', 'competitors'], ['referralSource', 'referralSources'], ['craigslistAdBatch', 'craigslistAdBatches']]){
//             let [key0, key1] = p
//             let collection = db.collection(key1)
//             console.log("Dropping collection...")
//             try {
//                 await collection.drop()
//             } catch (e) {
//                 // do nothing
//             }
    
//             // Copy the data from MySQL to MongoDB
//             console.log("Importing data...")
//             let filteredData = data.filter(o => o.type == key0)
//             await collection.bulkWrite(filteredData.map(document => {
//                 return {'insertOne': { document }}
//             }))

//             // Print results
//             const newData = await collection.find()
//             console.log(`${filteredData.length} records found in mysql.`)
//             console.log(`${await newData.count()} records found in mongo.`)
//             console.log("Data is migrated from MySQL to MongoDB.")
//             console.log(JSON.stringify(report))
//             // Close up

//         }

//         client.close();

//     } catch (e) {

//         console.error(e)

//     }

// }




router.get('/', function(req, res, next) {

  res.render('manage');

});

router.post('/import', async (req, res, next) => {

  prelude.fetchEntities((err, values) => {

    let operations = values
    .map(document => ({'insertOne': {document}}))

    let collectionName = 'entities'

    db.dropCollections([collectionName], (err) => { // get rid of the existing collection

      db.bulkWrite(collectionName, operations, (err) => {

        res.send("ok")
  
      })
  
    })

  })

})

router.post('/dropCollections', async (req, res, next) => {

  db.dropCollections(null, (err) => {

    res.send('ok')

  })

})

router.post('/createJobCandidatesCollection', async (req, res, next) => {

    let collectionName = 'jobCandidates'

    db.dropCollections([collectionName], (err) => {

      db.connect(async (err, client) => {

        let sourceCollection = client.collection('entities')
        
        let targetCollection = client.collection(collectionName)

        let documents = await sourceCollection.find({type: 'employee'}).toArray()

        await targetCollection.insertMany(documents)

        res.send("ok")

      })
    })

})

router.get('/report/collectionList', (req, res) => {

  db.getCollectionStatistics((err, values) => {

    console.log('values', values)

    res.render('reports/collectionList', {values})
      
  })

})

router.get('/report/preludeEntityTypes', (req, res) => {

  db.getEntityStatistics((err, values) => {

    res.render('reports/preludeEntityTypes', {values})

  })

})

module.exports = router;