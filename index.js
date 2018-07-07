require('dotenv').config()
var shell = require('shelljs')
var http = require('http')
var createHandler = require('node-github-webhook')
var handler = createHandler([ // multiple handlers
  { path: '/hook/config', secret: process.env.CONFIG_SECRET },
  { path: '/hook/personal', secret: process.env.PERSONAL_SECRET }
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
    case '/hook/config':
      console.log("git pull origin master")
      break
    case '/hook/personal':
      if(shell.exec('scripts/personal.sh').code !== 0) {
      	console.log('Script execution failed')
      }
      break
    default:
      // do sth else or nothing
      break
  }
})
