/**
 * @file このWebサーバーが内部で使用するDB関数をまとめたファイル
 * @namespace db-forWebServer
 */

let pool = null
let dbLogger = null
let codeList = null

/**
 * ロガーとステータスコードリストを設定する
 *
 * @memberof db-forWebServer
 * @param {mysql2.pool} _pool DB接続プール
 * @param {Roarr} _dbLogger DBロガー
 * @param {object} _codeList ステータスコードリスト
 */
const init = (_pool, _dbLogger, _codeList) => {
  pool = _pool
  dbLogger = _dbLogger
  codeList = _codeList
}


/* ================================================== get for server ================================================== */
/**
 * accessTokenからuserIdを取得する  
 *
 * @memberof db-forWebServer
 * @param {string} accessToken
 * @return {object} { code, result: { userId } }
 */
const getUserIdByAccessToken = (accessToken) => {
  return new Promise((resolve) => {
    return pool.query('select * from accessTokenList where accessToken = ?', [accessToken], (err, result) => {
      dbLogger.debug(`[debug] getUserIdByAccessToken: ${err} ${accessToken}`)
      if (err || !result || result.length !== 1) {
        return resolve({ code: codeList.DB_RECORD_NOT_FOUND, error: 'select from accessTokenList failed @getUserInfoByUserId' })
      }
      return resolve({ code: codeList.SUCCESS, result: { userId: result[0].userId } })
    })
  })
}

/* ================================================== check for server ================================================== */
/**
 * userIdとsha256Passで、ユーザーの認証情報が正しいか確認する
 *
 * @param {int} userId
 * @param {string} sha256Pass
 * @return {object} { code, result: { isValidCredential } }
 */
const checkCredentialIsValid = (userId, sha256Pass) => {
  return new Promise((resolve) => {
    return pool.query('select * from userCredential where userId = ?', [userId], (err, result) => {
      dbLogger.debug(`[debug] checkCredentialIsValid: ${err} ${userId} ${sha256Pass}`)
      if (err || !result || result.length !== 1) {
        return resolve({ code: codeList.DB_RECORD_NOT_FOUND, error: 'select from userCredential failed @checkCredentialIsValid' })
      }
      const validSha256Pass = result[0].sha256Pass
      if (validSha256Pass !== sha256Pass) {
        return resolve({ code: codeList.DB_INVALID_CREDENTIAL, error: 'invalid sha256Pass @checkCredentialIsValid' })
      }
      return resolve({ code: codeList.SUCCESS, result: { isValidCredential: true } })
    })
  })
}



module.exports = {
  init,

  getUserIdByAccessToken,
  checkCredentialIsValid,
}

