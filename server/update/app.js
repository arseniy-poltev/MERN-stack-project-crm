const MYSQL_HOST = 'www.atlantishomecare.com'
const MYSQL_USER = 'root'
const MYSQL_PASSWORD = 'b!rdPuddin4'
const MYSQL_DATABASE = 'prod_atlantisconnect'
const MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017'
const MONGODB_DBNAME = 'cocoa'
const Promise = require('bluebird')

let report = {
    disposition: {},
    gender: {},
    scoreLanguageProficiency: {},
    scoreConfident: {},
    scorePositive: {},
    scoreGenuine: {},
    scoreEncouraging: {},
    scoreModest: {},
    scoreBodyLanguage: {},
}

function mapEmployee(o){
    Object.keys(report).forEach(k => {
        // console.log(k, o[k])
        if (o[k]) report[k][o[k]] = true
    })

    return o
}





let convertAvailabilityNotes = (data) => {
    if (!data.hasOwnProperty('availabilityDescription')) return
    data.availabilityNotes = data.availabilityDescription
    delete data.availabilityDescription
}

let convertSelfIntroduction = (data) => {
    if (!data.hasOwnProperty('selfIntroduction')) return
    data.personalNotes = data.selfIntroduction
    delete data.selfIntroduction
}

let convertExperience = (data) => {
    if (!data.hasOwnProperty('experience')) return
    data.experienceNotes = data.experience 
    delete data.experience
}

let convertPreviousExperience = (data) => {
    if (!data.hasOwnProperty('previousExperience')) return
    data.experienceNotes = (data.experienceNotes ? data.experienceNotes + ' ' : '') + data.previousExperience
    delete data.previousExperience
}

async function run(res) {

    try {
        // Drop the existing collection in MongoDB
        const MongoClient = require('mongodb').MongoClient;
        console.log("Connecting to mongo...")
        var client = await (Promise.promisify(MongoClient.connect))(MONGODB_CONNECTION_STRING,{
            useMongoClient: true,
            promiseLibrary: global.Promise,
        })
        const db = client.db(MONGODB_DBNAME);

        let collection = db.collection('jobCandidates')
        let data = await collection.find().toArray()
        console.log(data.length)
        await collection.bulkWrite(data.map(document => {
            convertAvailabilityNotes(document)
            convertSelfIntroduction(document)
            convertExperience(document)
            convertPreviousExperience(document)
            return {'updateOne': {filter: {_id: document._id}, update: document}}
        }))
        // for (let p of [['employee', 'jobCandidates'], ['client', 'customers'], ['competitor', 'competitors'], ['referralSource', 'referralSources'], ['craigslistAdBatch', 'craigslistAdBatches']]){
        //     let [key0, key1] = p
        //     let collection = db.collection(key1)
        //     console.log("Dropping collection...")
        //     try {
        //         await collection.drop()
        //     } catch (e) {
        //         // do nothing
        //     }
    
        //     // Copy the data from MySQL to MongoDB
        //     console.log("Importing data...")
        //     let filteredData = data.filter(o => o.type == key0)
        //     await collection.bulkWrite(filteredData.map(document => {
        //         return {'insertOne': { document }}
        //     }))

        //     // Print results
        //     const newData = await collection.find()
        //     console.log(`${filteredData.length} records found in mysql.`)
        //     console.log(`${await newData.count()} records found in mongo.`)
        //     console.log("Data is migrated from MySQL to MongoDB.")
        //     console.log(JSON.stringify(report))
        //     // Close up

        // }

        client.close();

    } catch (e) {

        console.error(e)

    }

}

// run()

module.exports = run