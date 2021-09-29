const getAccessPrivateApiHandler = (codeList, getUserIdByAccessToken) => {
  return async (req, res, next) => {
    const authorization = req.headers.authorization
    if(!authorization || !/bearer /i.test(authorization)) {
      return res.json({ code: codeList.AUTH_HEADER_REQUIRED, error: 'invalid authorization header @getAccessPrivateApiHandler', })
    }

    const accessToken = authorization.slice('bearer '.length)
    const dbResult = await getUserIdByAccessToken(codeList, accessToken)
    if(dbResult.error) {
      res.status(403)
      return res.json(dbResult)
    }

    req.session = { user: { userId: dbResult.result.userId, }, }
    console.log('[debug] private api session:', req.session)
    return next()
  }
}

module.exports = {
  getAccessPrivateApiHandler,
}

