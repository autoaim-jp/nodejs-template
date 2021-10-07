/**
 * @file DBにクエリを実行し、結果を取得する関数をまとめたファイル
 * @namespace db-index
 */

const mysql = require('mysql2')
const path = require('path')

let pool = null
let dbLogger = null
let codeList = null

const forWebServer = require(path.join(process.env.APP_PATH, 'lib/database/forWebServer'))
const forWebClient = require(path.join(process.env.APP_PATH, 'lib/database/forWebClient'))

/**
 * DBを初期化し、ロガーとステータスコードリストを設定する
 *
 * @memberof db-index
 * @param {object} config
 * @param {Roarr} _dbLogger
 * @param {object} _codeList
 */
const init = (config, _dbLogger, _codeList) => {
  pool = mysql.createPool({
    connectionLimit: 100,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: false,
  })
  dbLogger = _dbLogger
  codeList = _codeList

  forWebServer.init(pool, dbLogger, codeList)
  forWebClient.init(pool, dbLogger, codeList)
}

/**
 * コネクションプールを閉じる  
 * testやメインプロセスが終了する際に呼び出す
 *
 * @memberof db-index
 */
const close = () => {
  pool.end()
}

module.exports = {
  init,
  forWebServer,
  forWebClient,
  close,
}

