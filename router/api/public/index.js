const getAccessPublicApiHandler = (publicApiLogger) => {
  return async (req, _, next) => {
    publicApiLogger.debug(`public api session: ${JSON.stringify(req.session)}`)
    next()
  }
}

module.exports = {
  getAccessPublicApiHandler,
}

