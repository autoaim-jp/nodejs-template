const https = require('https')
const fs = require('fs')
const express = require('express')
const path = require('path')
require('dotenv').config()

process.env.APP_PATH = path.join(__dirname, '/')
const { SERVER_PORT } = process.env

const router = require(path.join(process.env.APP_PATH, 'router/index'))

const app = express()
app.disable('x-powered-by')

const userParam = {
  key: fs.readFileSync(process.env.CERT_KEY),
  cert: fs.readFileSync(process.env.CERT_CRT),
  passphrase: '',
}

const server = https.createServer(userParam, app)

app.use(router.router)

server.listen(SERVER_PORT, () => {
  console.log('Listen to:', SERVER_PORT)
})

