let io = require('socket.io')()
io.on('connection', socket => console.log(`Client connected. Socket ID: ${socket.id}`))

// Examples
let data = [1,2,3,'A','B','C']
io.on('connection', socket => {
  socket.join('Room A')
  // socket.on('clientToServer', function() { console.log("Received message from client.", ...arguments) })
  socket.in('Room A').on('serverToRoom', function() { console.log("Received message from server in Room A.", ...arguments)})

  socket.on('sendTests', function(){
    socket.emit("serverToClient", ...data) // this will not be received by the client socket but by anyone else listening for the event.
    socket.broadcast.emit('serverToClientBroadcast', ...data)
    // io.to('Room A').emit('serverToRoom', ...data)
    // io.of('/namespaceA').emit('serverToNamespace', ...data)
    io.to(socket.id).emit('serverToId', ...data)  
  })
})

io.of('/namespaceA').on('connection', socket => {
  socket.on('clientToNamespace', function() { console.log("Received message from client to namespace A.", ...arguments)})
  // socket.on('serverToNamespace', function() { console.log("Received a message from the server to namespace A.", ...arguments)})
})

module.exports = io
