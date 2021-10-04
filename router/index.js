const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')

const PUBLIC_DIR = path.join(process.env.APP_PATH, 'public')

const db = require(path.join(process.env.APP_PATH, 'lib/database'))
const privateApi = require(path.join(process.env.APP_PATH, 'router/api/private/index'))
const publicApi = require(path.join(process.env.APP_PATH, 'router/api/public/index'))
const filePrivateApi = require(path.join(process.env.APP_PATH, 'router/api/private/file'))
const setting = require(path.join(process.env.APP_PATH, 'setting'))
const bss = require(path.join(process.env.APP_PATH, 'browserServerSetting'))

let appLogger = null
let dbLogger = null
let accessLogger = null
let privateApiLogger = null
let publicApiLogger = null

const router = express.Router()

const init = (_appLogger, _dbLogger, _accessLogger, _privateApiLogger, _publicApiLogger) => {
  appLogger = _appLogger
  dbLogger = _dbLogger
  accessLogger = _accessLogger
  privateApiLogger = _privateApiLogger
  publicApiLogger = _publicApiLogger
  appLogger.trace('init logger')

  db.init({
    host: process.env.PRODUCTION_DB_HOST,
    user: process.env.PRODUCTION_DB_USER,
    password: process.env.PRODUCTION_DB_PASS,
    database: process.env.PRODUCTION_DB_NAME,
  })
  appLogger.trace('init db')

  router.use(bodyParser.urlencoded({ extended: true }))
  router.use(bodyParser.json())
  router.use(cookieParser())

  router.use((req, res, next) => {
    try {
      const filePath = path.join(PUBLIC_DIR, `${req.path}.html`)
      fs.statSync(filePath)
      accessLogger.debug(`access(static): ${req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress} ${req.originalUrl} ${filePath}`)
      return res.end(fs.readFileSync(filePath))
    } catch (e) {
      accessLogger.debug(`access ${req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress} ${req.originalUrl}`)
    }
    return next()
  })
  router.use(express.static(PUBLIC_DIR))

  router.get('/', (req, res) => {
    return res.end(fs.readFileSync('./index.html'))
  })
  appLogger.trace('init static dir router')

  router.use(
    bss.api.PUBLIC_API,
    publicApi.getAccessPublicApiHandler(publicApiLogger, setting.codeList),
  )
  appLogger.trace('init public api router')

  router.use(
    bss.api.PRIVATE_API,
    privateApi.getAccessPrivateApiHandler(
      privateApiLogger,
      dbLogger,
      setting.codeList,
      db.getUserIdByAccessToken,
    ),
  )
  router.get(
    bss.api.PRIVATE_API + bss.api.PRIVATE_GET_FILE,
    filePrivateApi.getFileHandler(
      privateApiLogger,
      dbLogger,
      setting.codeList,
      db.getFileByFileLabelUserId,
    ),
  )
  appLogger.trace('init private api router')

  router.get('*', (req, res) => {
    res.status(404)
    return res.end('not found')
  })
  appLogger.trace('init not found router')
}

module.exports = {
  init,
  router,
}

