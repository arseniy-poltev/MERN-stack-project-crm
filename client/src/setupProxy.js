const proxy = require('http-proxy-middleware');
console.log("Testing from the client.")
module.exports = function(app) {
    app.use(proxy('/api', 
        { target: 'http://server:3000/' }
    ));
    // app.use(proxy('/socket.io', {target: 'http://server:3000', ws:true}))
}