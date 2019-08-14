let Promise = require('bluebird')
let MongoClient = require('mongodb')
let ObjectID = require('mongodb').ObjectID
// let connect = Promise.promisify(MongoClient.connect)
let bcrypt = require('bcryptjs')
let LocalStrategy = require('passport-local').Strategy
let passport = require('passport')
let mailer = require('../../models/mailer')

let requiredDomain = '@atlantishomecare.com'

let client

async function connect(){

	client = MongoClient.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser: true}, (err, o) => client = o)

}

connect()

passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {

	// Find the user
	let user = await auth.findUserByEmail(email)

	if (!user) {

		return done(null, false, {status: 'failure', message: 'User not registered.'})

	}


	if (!user.active) {

		return done(null, false, {status: 'failure', message: "User is not active."})

	}

	// Confirm the password
	bcrypt.compare(password, user.password, (err, isMatch) => {

		if (err) throw err;

		if (isMatch) {

			return done(null, user)

		} else {

			return done(null, false, {status: 'failure', message: 'Password incorrect.'})

		}

	})

}))

passport.serializeUser((user, done) => {

	done(null, user._id)

})

passport.deserializeUser(async(id, done) => {

	let user = await auth.findUserById(id)

	done(null, user)
	
})


function generateToken(){

	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

}

function generateActivationLink(email, token, host){

	return `https://${host}/#/activate/${email}/${token}`

}

function isValidDomain(email){

	return email.substr(-1 * requiredDomain.length) === requiredDomain
}

function isUserActive(user){

	return user.active

}

function isActivationTokenExpired(user){

	return !user.activationTokenCreated || !user.activationToken || Math.abs((new Date() - new Date(user.activationTokenCreated)) / 36e5) > 3

}

async function sendActivationEmail(email, activationLink){

	let envelope = {
		to: email,
		cc: process.env.GMAIL_USERNAME,
		subject: 'Activate your Cocoa account',
		text: `Thank you for registering. Please activate your email by clicking the following link: ${activationLink}`,
		html: `<h1>Thank you for registering</h1> Please complete your registration by clicking the following link <a href='${activationLink}'>${activationLink}</a>.`
	}

	await mailer.sendMail(envelope)

}

async function saveActivationToken(user, token){

	user.activationToken = token

	await auth.updateUser(user)

}

async function createDefaultUser(){

	if (process.env.APP_DEFAULT_ADMIN_EMAIL && process.env.APP_DEFAULT_ADMIN_PASSWORD){

		var user = await auth.findUserByEmail(process.env.APP_DEFAULT_ADMIN_EMAIL)

		if (!user){
			
			let ACTIVATION_DATE = new Date()

			user = await auth.createUser(process.env.APP_DEFAULT_ADMIN_EMAIL, process.env.APP_DEFAULT_ADMIN_PASSWORD, ACTIVATION_DATE)

		} else if (!user.active) {

			user.active = new Date()

			await await auth.updateUser(user)

		}

	}

}

class AuthService {

	require(req, res, next){

		if (req.isAuthenticated()){

			return next()

		}

		res.json({status: 'failure', message: 'Not authenticated.'})

	}

	login(req, res, next){

		passport.authenticate('local', (err, user, info) => {

			if (err) { return next(err) }

			if (!user) { 

				return res.json(info)

			}

			req.logIn(user, err => {

				if (err) return next(err)

				return res.json({status: 'success', data: user})

			})

		})(req, res, next)

	}

	async register(req, res, next){

		try {

			let email = req.body.email && req.body.email.toLowerCase()
			let password = req.body.password

			if (!isValidDomain(email)) return res.json({status: 'failure', message: 'Please contact your system administrator.'})

			let activationToken = generateToken()

			let activationLink = generateActivationLink(email, activationToken, req.headers.host)

			let user = await auth.findUserByEmail(email)

			if (user && isUserActive(user)){

				return res.json({status: 'failure', message: 'User already exists.', code: '010'})

			} 
			
			if (user && !isActivationTokenExpired(user)){

				return res.json({status: 'success', message: 'Please check your email.', code: '020'})

			}

			if (user) {

				await saveActivationToken(user, activationToken)

				await sendActivationEmail(email, activationLink)

				return res.json({status: 'success', message: 'Please check your email.', code: '030'})

			}

			await auth.createUser({
				email, password, activationToken, activationTokenCreated: new Date()
			})

			await sendActivationEmail(email, activationLink)

			return res.json({status: 'success', message: 'Please check your email.', code: '040'})

		} catch (e) {

			console.error(e)

			res.json({status: 'failure', message: 'Please contact your system administrator.'})
			
		}

	}

	async activate(req, res, next){

		try {

			let email = req.body.email && req.body.email.toLowerCase()

			let user = await auth.findUserByEmail(email)

			if (!user) return res.json({status: 'failure', message: 'Invalid email.'})

			console.log(user.activationToken, req.body.activationToken)

			if (user.activationToken !== req.body.activationToken) return res.json({status: 'failure', message: 'Invalid activation token.'})

			if (isActivationTokenExpired(user)) return res.json({status: 'failure', message: 'Activation token expired.'})

			user.active = new Date()

			delete user.activationToken

			delete user.activationTokenCreated

			await auth.updateUser(user)
			
			res.json({status: 'success', message: 'Account activated.'})

		} catch (e) {

			console.error(e)

			res.json({status: 'failure', message: 'Please contact your system administrator.'})
		}
	}

	logout(req, res, next){

		req.logout()

		res.json({status: 'success'})

	}

	authenticate(){

		return passport.authenticate(...arguments)

	}

	async findUserByEmail (email){

		return await client.db().collection('users').findOne({email})
		
	}

	async findUserById (id){

		return await client.db().collection('users').findOne({_id: new ObjectID(id)})	
		
	}

	async createUser (email, password, active = null){

		let newUserData

		if (typeof email === 'object') {

			newUserData = email

			password = newUserData.password

		} else {
			
			newUserData = {email, active}

		}

		return new Promise(async (resolve, reject) => {

		  bcrypt.genSalt(10, (err, salt) => {

		  	bcrypt.hash(password, salt, async (err, hash) => {

					if (err) throw (err)
					
					newUserData.password = hash
					
					let user = await client.db().collection('users').insertOne(newUserData)
					
					resolve(user)
					
				})
				
			})
			
		})

	}

	async updateUser(user){

		return await client.db().collection('users').replaceOne({_id: ObjectID(user._id)}, Object.assign({

			updated: new Date(),
	
		}, user), {upsert: false})
	
	}

	async deleteUser (email){

	  return await client.db().collection('users').deleteOne({email})

	}

}

let auth = new AuthService()

createDefaultUser()

module.exports = auth