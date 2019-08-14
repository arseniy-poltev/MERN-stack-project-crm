const nodemailer = require('nodemailer');

let GMAIL_USERNAME = process.env.GMAIL_USERNAME
let GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

class Mailer {

  constructor(){

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      // authMethod: 'tls',
      auth: {
        user: GMAIL_USERNAME,
        pass: GMAIL_PASSWORD
      },
      // secure: true,
      // dkim: {
      //   domainName: 'scoreboardsports.com',
      //   keySelector: 'lite',
      //   privateKey: '-----BEGIN RSA PRIVATE KEY-----MIICXAIBAAKBgQC7idPnYxeONz6PKl242P5V1r5ehrUiDlLOQtEQsSkY1cHPmvup3pzHUgYIEE6O2+mg89gCYvTYSw+jtg27kCv8cwFqxEGY7pgvV/FaCU4oc+3VjthZ0WrCe9pyRazixD6XVUx/LOSHd7f0qV3ntlT8emnpz6NBpbXgfgtWUQyQgQIDAQABAoGAAQTKpeMf6aHbMSPlxm9HUmgMOK86pKi3Qm+Seyi7NGtU1i/dVhrjdyG27qxIAPao2jr43Wp0MgiWWSlQAcjStFX5JLYJUgKsLxT17iutOsVIo9KuRS6miEJao6MAjCAPWUy+SBmlxs1gOTtYFBQ8XUe3zl22a/6Bgn7u/vx1TZECQQDoVb4OW9AyK57+T3ByOSkLb1YIFM1lQISjIAOp8SvqXhWYshHROPVW2rp+YiClKNN3O5biOjftM6KEBplzL56vAkEAzqP91vQh6N5bwHSDwqjPlBBmIJWf5S3m6sdh7CPkb9QF/C9kx5+94kinyD5Ziamhwx5xecmbwA53L5juKHEPzwJATytIhCQNIctzdj0jmAiaT+c0bbSI+QOvLtbt6K7hxA8jVND4+U5ra5lFC2Pss9rhlDOeCqDEBfQeYNbO201SyQJAcktghrln3B7JTwzjKBMpJXNgmZtI4oFeHPQFJJDBtFzoppEsRAIGDBg1vVtHOQ57a6n2B+/MVxFpOQl0iSfoHwJBAKDZ6hcgNH+aJEDAtZZc2WGLmVN5z1DAwS7klAP8utOo1DDhxWRt851H+nwjC4ScgXmJNlYt/COHIzW/Hf8sHUg=-----END RSA PRIVATE KEY-----'
      // }
    })



  }

  sendMail(envelope){
      
    envelope = Object.assign(envelope, {
      from: 'Cocoa Support <' + GMAIL_USERNAME + '>',
    })
    
    return this.transporter.sendMail(envelope)

  }

}

let mailer = new Mailer()
module.exports = mailer