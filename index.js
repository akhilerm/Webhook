require('dotenv').config()
var http = require('http')
var createHandler = require('node-github-webhook')
var handler = createHandler([ // multiple handlers
  { path: '/config', secret: process.env.CONFIG_SECRET },
  { path: '/webhook2', secret: 'secret2' }
])
 
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)
 
handler.on('error', function (err) {
  console.error('Error:', err.message)
})
 
handler.on('push', function (event) {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  )
  switch(event.path) {
    case '/config':
      console.log("git pull origin master")
      break
    case '/webhook2':
      // do sth about webhook2
      break
    default:
      // do sth else or nothing
      break
  }
})
