const getFileHandler = (codeList, getFileByFileLabelUserId) => {
  return async (req, res) => {
    const fileLabel = req.query.fileLabel
    if(!req.session.user.userId) {
      res.status(403)
      return res.json({ code: codeList.AUTHENTICATION_REQUIRED, error: 'session userId check failed @getFileHandler', })
    }

    const dbResult = await getFileByFileLabelUserId(codeList, fileLabel, req.session.user.userId)
    res.status(200)
    return res.json(dbResult)
  }
}

module.exports = {
  getFileHandler,
}


