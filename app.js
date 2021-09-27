const https = require('https')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()

process.env.APP_PATH = __dirname + '/'
const PUBLIC_DIR = process.env.APP_PATH + 'public'
const SERVER_PORT = process.env.SERVER_PORT

const app = express()
app.disable('x-powered-by')
const router = express.Router()

const userParam = { 
  key: fs.readFileSync(process.env.CERT_KEY),
  cert: fs.readFileSync(process.env.CERT_CRT),
  passphrase: '',
}

const server = https.createServer(userParam, app)
app.use(router)
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(cookieParser())


app.use((req, res, next) => {
  if(req.path.indexOf('.') === -1) {
    try{
      const filePath = PUBLIC_DIR + req.path + '.html'
      fs.statSync(filePath)
      return res.end(fs.readFileSync(filePath))
    } catch(e) {
    }
  }
  return next()
})
app.use(express.static(PUBLIC_DIR))
  
app.get('/', (req, res) => {
  return res.end(fs.readFileSync('./index.html'))
})
app.get('*', (req, res) => {
  res.status(404)
  return res.end('not found')
})

server.listen(SERVER_PORT, () => {
  console.log('Listen to:', SERVER_PORT)
})


