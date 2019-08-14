import io from 'socket.io-client'

// initialize

let socket = io()
let socket2 = io()
let namespaceASocket = io('/namespaceA')

// listening/receiving side

socket2.on('serverToClient', function() { console.log('Received message from server on 2nd socket (not sender).', ...arguments) })
socket.on('serverToClientBroadcast', function() { console.log("Received message from server using broadcast.", ...arguments)})
socket2.on('serverToClientBroadcast', function() { console.log("Received message from server on 2nd socket (not sender) using broadcast.", ...arguments)})
socket.on('serverToRoom', function() { console.log('Received message from server to room.', ...arguments) })
namespaceASocket.on('serverToNamespace', function() { console.log('Received message from server to namespace A.', ...arguments)})
socket.on('serverToId', function() { console.log(`Received message from server to ID ${socket.id}.`, ...arguments) })
socket.emit('sendTests')

// talking/sending side

let data = ['Client messages are great!', 'X', 'Y', 'Z']
socket.emit('clientToServer', ...data)
namespaceASocket.emit('clientToNamespace', ...data)
