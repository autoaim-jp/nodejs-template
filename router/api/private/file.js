/**
 * @file File Private APIのファイル
 * @namespace private-file
 * @memberof router-api.
 */

/**
 * { req.query.fileLabel } でファイル情報を返す
 *
 * @memberof private-file
 * @param {Roarr} privateApiLogger Private APIのロガー
 * @param {object} codeList ステータスコードリスト
 * @param {function} getFileByFileLabelUserId userIdでFile情報を取得するDB関数
 * @return {function} (req, res) handler
 * @see {@link router-index}
 */
const getFileHandler = (privateApiLogger, codeList, getFileByFileLabelUserId) => {
  return async (req, res) => {
    const { fileLabel } = req.query
    if (!req.session.user.userId) {
      res.status(403)
      return res.json({ code: codeList.AUTHENTICATION_REQUIRED, error: 'session userId check failed @getFileHandler' })
    }

    const dbResult = await getFileByFileLabelUserId(fileLabel, req.session.user.userId)
    res.status(200)
    privateApiLogger.debug(`getFileHandler: ${JSON.stringify(req.session)}`)
    return res.json(dbResult)
  }
}

module.exports = {
  getFileHandler,
}

