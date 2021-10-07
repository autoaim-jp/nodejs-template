/**
 * @file このWebサーバーにアクセスするクライアントに対してのレスポンスを作成するDB関数をまとめたファイル
 * @namespace db-forWebClient
 */

let pool = null
let dbLogger = null
let codeList = null

/**
 * ロガーとステータスコードリストを設定する
 *
 * @memberof db-forWebClient
 * @param {mysql2.pool} _pool DB接続プール
 * @param {Roarr} _dbLogger DBロガー
 * @param {object} _codeList ステータスコードリスト
 */
const init = (_pool, _dbLogger, _codeList) => {
  pool = _pool
  dbLogger = _dbLogger
  codeList = _codeList
}

/* ================================================== get ================================================== */
/**
 * userIdからユーザー情報を取得する
 *
 * @memberof db-forWebClient
 * @param {int} userId
 * @return {object} { codeList, result: { user } }
 */
const getUserInfoByUserId = (userId) => {
  return new Promise((resolve) => {
    return pool.query('select * from userList where userId = ?', [userId], (err, result) => {
      dbLogger.debug(`[debug] getUserInfoByUserId: ${err} ${userId}`)
      if (err || !result || result.length !== 1) {
        return resolve({ code: codeList.DB_RECORD_NOT_FOUND, error: 'select from userList failed @getUserInfoByUserId' })
      }
      const user = { userName: result[0].userName }
      return resolve({ code: codeList.SUCCESS, result: { user } })
    })
  })
}

/**
 * fileLabelとuserIdからファイル情報を取得する
 *
 * @memberof db-forWebClient
 * @param {string} fileLabel
 * @param {int} userId
 * @return {object} { code, result: { file } }
 */
const getFileByFileLabelUserId = (fileLabel, userId) => {
  return new Promise((resolve) => {
    return pool.query('select * from fileList where fileLabel = ? and userId = ?', [fileLabel, userId], (err, result) => {
      dbLogger.debug(`[debug] getFileByFileLabelUserId: ${err} ${fileLabel} ${userId}`)
      if (err || !result || result.length !== 1) {
        return resolve({ code: codeList.DB_RECORD_NOT_FOUND, error: 'select from fileList failed @getFileByFileLabelUserId' })
      }
      const file = {
        fileLabel: result[0].fileLabel,
        fileName: result[0].fileName,
        fileContent: result[0].fileContent,
      }
      return resolve({ code: codeList.SUCCESS, result: { file } })
    })
  })
}



module.exports = {
  init,

  getUserInfoByUserId,
  getFileByFileLabelUserId,
}

