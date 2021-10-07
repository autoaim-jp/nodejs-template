const path = require('path')

module.exports = {
  STATIC_DIR: path.join(process.env.APP_PATH, 'public'),
  codeList: {
    SUCCESS: 200,
    DB_RECORD_NOT_FOUND: 401,
    DB_INVALID_CREDENTIAL: 402,
    AUTHENTICATION_REQUIRED: 403,
  },
}

