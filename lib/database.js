const mysql = require('mysql2')

let pool = null

const init = (config) => {
  pool = mysql.createPool({
    connectionLimit: 100,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: false,
  })
}

/* get for browser */
const getUserInfoByUserId = (dbLogger, codeList, userId) => {
  return new Promise((resolve) => {
    return pool.query('select * from userList where userId = ?', [userId], (err, result) => {
      dbLogger.debug(`[debug] getUserInfoByUserId: ${err} ${result.length} ${userId}`)
      if (err || !result || result.length !== 1) {
        return resolve({ code: codeList.DB_RECORD_NOT_FOUND, error: 'select from userList failed @getUserInfoByUserId' })
      }
      const user = { userName: result[0].userName }
      return resolve({ code: codeList.SUCCESS, result: { user } })
    })
  })
}

const getFileByFileLabelUserId = (dbLogger, codeList, fileLabel, userId) => {
  return new Promise((resolve) => {
    return pool.query('select * from fileList where fileLabel = ? and userId = ?', [fileLabel, userId], (err, result) => {
      dbLogger.debug(`[debug] getFileByFileLabelUserId: ${err} ${result.length} ${fileLabel} ${userId}`)
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


/* get for server */
const getUserIdByAccessToken = (dbLogger, codeList, accessToken) => {
  return new Promise((resolve) => {
    return pool.query('select * from accessTokenList where accessToken = ?', [accessToken], (err, result) => {
      dbLogger.debug(`[debug] getUserIdByAccessToken: ${err} ${result.length} ${accessToken}`)
      if (err || !result || result.length !== 1) {
        return resolve({ code: codeList.DB_RECORD_NOT_FOUND, error: 'select from accessTokenList failed @getUserInfoByUserId' })
      }
      return resolve({ code: codeList.SUCCESS, result: { userId: result[0].userId } })
    })
  })
}

/* check for server */
const checkCredentialIsValid = (dbLogger, codeList, userId, sha256Pass) => {
  return new Promise((resolve) => {
    return pool.query('select * from userCredential where userId = ?', [userId], (err, result) => {
      dbLogger.debug(`[debug] checkCredentialIsValid: ${err} ${result.length} ${userId} ${sha256Pass}`)
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
  getUserInfoByUserId,
  getFileByFileLabelUserId,
  getUserIdByAccessToken,
  checkCredentialIsValid,
}

