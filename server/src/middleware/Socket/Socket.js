var io = require('socket.io')

let _connectPromise, _connection
class Socket{
	constructor(){
		_connectPromise = new Promise((resolve, reject) => {
			this.setServer = (server) => {
				if (_connection) throw "Socket.io server already set."
				_connection = io(server)
				resolve(_connection)
			}
		})
	}
	connect(){
		return _connectPromise
		return _instance.connection
	}
}
let _instance = new Socket()
module.exports = _instance
