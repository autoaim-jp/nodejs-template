const https = require('https')
const fs = require('fs')
const express = require('express')
const path = require('path')
require('dotenv').config()

process.env.APP_PATH = path.join(__dirname, '/')
const { SERVER_PORT } = process.env

const util = require(path.join(process.env.APP_PATH, 'lib/util'))
const router = require(path.join(process.env.APP_PATH, 'router/index'))

/* logger */
const appLogger = util.getLogger({ app: 1 })
const dbLogger = util.getLogger({ db: 1 })
const accessLogger = util.getLogger({ access: 1 })
const privateApiLogger = util.getLogger({ privateApi: 1 }, accessLogger)
const publicApiLogger = util.getLogger({ publicApi: 1 }, accessLogger)

router.init(appLogger, dbLogger, accessLogger, privateApiLogger, publicApiLogger)

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
  appLogger.info(`Listen to: ${SERVER_PORT}`)
})

