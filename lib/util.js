const { Roarr } = require('roarr')

const getLogger = (ctx, logger) => {
  let parentLogger = logger
  if (!parentLogger) {
    parentLogger = Roarr
  }
  return parentLogger.child(ctx)
}

module.exports = {
  getLogger,
}

