/**
 * @file Private APIのファイル
 * @namespace private-index
 * @memberof router-api.
 */

/**
 * Private APIは全てこの関数でアクセストークンをチェックする。
 *
 * @memberof private-index
 * @param {Roarr} privateApiLogger Private APIのロガー
 * @param {object} codeList ステータスコードリスト
 * @param {function} getUserIdByAccessToken accessTokenからuserIdを取得するDB関数
 */
const getAccessPrivateApiHandler = (privateApiLogger, codeList, getUserIdByAccessToken) => {
  return async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization || !/bearer /i.test(authorization)) {
      return res.json({ code: codeList.AUTH_HEADER_REQUIRED, error: 'invalid authorization header @getAccessPrivateApiHandler' })
    }

    const accessToken = authorization.slice('bearer '.length)
    const dbResult = await getUserIdByAccessToken(accessToken)
    if (dbResult.error) {
      res.status(403)
      return res.json(dbResult)
    }

    req.session = { user: { userId: dbResult.result.userId } }
    privateApiLogger.debug(`private api session: ${JSON.stringify(req.session)}`)
    return next()
  }
}

module.exports = {
  getAccessPrivateApiHandler,
}

