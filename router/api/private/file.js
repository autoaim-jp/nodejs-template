const getFileHandler = (apiLogger, dbLogger, codeList, getFileByFileLabelUserId) => {
  return async (req, res) => {
    const { fileLabel } = req.query
    if (!req.session.user.userId) {
      res.status(403)
      return res.json({ code: codeList.AUTHENTICATION_REQUIRED, error: 'session userId check failed @getFileHandler' })
    }

    const dbResult = await getFileByFileLabelUserId(
      dbLogger,
      codeList,
      fileLabel,
      req.session.user.userId,
    )
    res.status(200)
    apiLogger.debug(`getFileHandler: ${JSON.stringify(req.session)}`)
    return res.json(dbResult)
  }
}

module.exports = {
  getFileHandler,
}

