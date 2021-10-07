/**
 * @file エントリポイントのファイル
 * @namespace app
 */
const https = require('https')
const fs = require('fs')
const express = require('express')
const path = require('path')
require('dotenv').config()

process.env.APP_PATH = path.join(__dirname, '/')
const { SERVER_PORT } = process.env

const util = require(path.join(process.env.APP_PATH, 'lib/util'))
const db = require(path.join(process.env.APP_PATH, 'lib/database/index'))
const setting = require(path.join(process.env.APP_PATH, 'setting'))
const bss = require(path.join(process.env.APP_PATH, 'browserServerSetting'))

const router = require(path.join(process.env.APP_PATH, 'router/index'))


/**
 * DBを初期化する
 *
 * @memberof app
 * @param {Roarr} appLogger
 * @param {Roarr} dbLogger
 * @param {object} codeList
 */
const initDb = (appLogger, dbLogger, codeList) => {
  db.init({
    host: process.env.PRODUCTION_DB_HOST,
    user: process.env.PRODUCTION_DB_USER,
    password: process.env.PRODUCTION_DB_PASS,
    database: process.env.PRODUCTION_DB_NAME,
  }, dbLogger, codeList)
  appLogger.trace('init db')
}

/**
 * メインの関数  
 * ロガー、DB、Webサーバーの初期化を行い、Webサーバーを起動する
 *
 * @memberof app
 */
const main = () => {
  /* init logger */
  const appLogger = util.getLogger({ app: 1 })
  const dbLogger = util.getLogger({ db: 1 })
  const accessLogger = util.getLogger({ access: 1 })
  const privateApiLogger = util.getLogger({ privateApi: 1 }, accessLogger)
  const publicApiLogger = util.getLogger({ publicApi: 1 }, accessLogger)

  /* init db */
  initDb(appLogger, dbLogger, setting.codeList)

  /* init router */
  router.setLogger(appLogger, accessLogger, privateApiLogger, publicApiLogger)
  const customRouter = router.initRouter(db, setting, bss)

  /* init server */
  const app = express()
  app.disable('x-powered-by')
  const userParam = {
    key: fs.readFileSync(process.env.CERT_KEY),
    cert: fs.readFileSync(process.env.CERT_CRT),
    passphrase: '',
  }
  const server = https.createServer(userParam, app)
  app.use(customRouter)

  /* start server */
  server.listen(SERVER_PORT, () => {
    appLogger.info(`Listen to: ${SERVER_PORT}`)
  }).on('error', (e) => {
    appLogger.error(e)
    db.close()
  })
}


main()

