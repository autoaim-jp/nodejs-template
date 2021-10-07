/**
 * @file ルーティングのメインファイル
 * @namespace router-index.
 */
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')

const privateApi = require(path.join(process.env.APP_PATH, 'router/api/private/index'))
const publicApi = require(path.join(process.env.APP_PATH, 'router/api/public/index'))
const filePrivateApi = require(path.join(process.env.APP_PATH, 'router/api/private/file'))

let appLogger = null
let accessLogger = null
let privateApiLogger = null
let publicApiLogger = null

/**
 * ロガーをセットする
 *
 * @memberof router-index
 * @param {Roarr} _appLogger アプリケーションのロガー
 * @param {Roarr} _accessLogger アクセスロガー
 * @param {Roarr} _privateApiLogger Private APIのロガー
 * @param {Roarr} _publicApiLogger Public APIのロガー
 */
const setLogger = (_appLogger, _accessLogger, _privateApiLogger, _publicApiLogger) => {
  appLogger = _appLogger
  accessLogger = _accessLogger
  privateApiLogger = _privateApiLogger
  publicApiLogger = _publicApiLogger
  appLogger.trace('init logger')
}

/**
 * Routerを初期化する
 *
 * @memberof router-index
 * @return {Router} Expressのルーターオブジェクト
 */
const initRouter = (db, setting, bss) => {
  const router = express.Router()
  router.use(bodyParser.urlencoded({ extended: true }))
  router.use(bodyParser.json())
  router.use(cookieParser())

  router.use((req, res, next) => {
    try {
      const filePath = path.join(setting.STATIC_DIR, `${req.path}.html`)
      fs.statSync(filePath)
      accessLogger.debug(`access(static): ${req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress} ${req.originalUrl} ${filePath}`)
      return res.end(fs.readFileSync(filePath))
    } catch (e) {
      accessLogger.debug(`access ${req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress} ${req.originalUrl}`)
    }
    return next()
  })
  router.use(express.static(setting.STATIC_DIR))

  router.get('/', (req, res) => {
    return res.end(fs.readFileSync('./index.html'))
  })
  appLogger.trace('init static dir router')

  router.use(
    bss.api.PUBLIC_API,
    publicApi.getAccessPublicApiHandler(publicApiLogger, setting.codeList),
  )
  appLogger.trace('init public api router')

  router.use(bss.api.PRIVATE_API, privateApi.getAccessPrivateApiHandler(privateApiLogger, setting.codeList, db.forWebServer.getUserIdByAccessToken))
  router.get(bss.api.PRIVATE_API + bss.api.PRIVATE_GET_FILE, filePrivateApi.getFileHandler(privateApiLogger, setting.codeList, db.forWebClient.getFileByFileLabelUserId))
  appLogger.trace('init private api router')

  router.get('*', (req, res) => {
    res.status(404)
    return res.end('not found')
  })
  appLogger.trace('init not found router')

  return router
}

module.exports = {
  setLogger,
  initRouter,
}

