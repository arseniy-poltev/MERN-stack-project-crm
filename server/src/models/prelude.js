let mysql = require('mysql');

const MYSQL_HOST = 'www.atlantishomecare.com'
const MYSQL_USER = 'root'
const MYSQL_PASSWORD = 'b!rdPuddin4'
const MYSQL_DATABASE = 'prod_atlantisconnect'

function Prelude(){

  this.connect = (cb) => {

    console.log("Connecting to prelude...")

    // Get the data from MySQL
    var connection = mysql.createConnection({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    })

    connection.connect()

    cb(null, connection)

    connection.end()

  }

  this.fetchEntities = (cb) => {

    this.connect((err, conn) => {

      var query = `SELECT * from entity`

      conn.query(query, (err, results, fields) => {

        let data = results
        .filter(o => o.obj.slice(0,1) !== '[')
        .map(o => Object.assign(JSON.parse(o.obj), {
          created: o.created_at,
          updated:o.updated_at,
          deleted: o.deleted_at,
          type: o.type,
          availabilityBak: o.availability,
          availability: Array(16).fill(Array(7).fill(false))
        }))

        cb(err, data)

      })

    })

  }

}

module.exports = new Prelude()
