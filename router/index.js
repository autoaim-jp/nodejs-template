const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const PUBLIC_DIR = process.env.APP_PATH + 'public'

const db = require(process.env.APP_PATH + 'lib/database')
const privateApi = require(process.env.APP_PATH + 'router/api/private/index')
const filePrivateApi = require(process.env.APP_PATH + 'router/api/private/file')
const setting = require(process.env.APP_PATH + 'setting')
const bss = require(process.env.APP_PATH + 'browserServerSetting')

db.init({
  host: process.env.PRODUCTION_DB_HOST,
  user: process.env.PRODUCTION_DB_USER,
  password: process.env.PRODUCTION_DB_PASS,
  database: process.env.PRODUCTION_DB_NAME,
})
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(cookieParser())

router.use((req, res, next) => {
  if(req.path.indexOf('.') === -1) {
    try{
      const filePath = PUBLIC_DIR + req.path + '.html'
      fs.statSync(filePath)
      return res.end(fs.readFileSync(filePath))
    } catch(e) {
    }
  }
  return next()
})
router.use(express.static(PUBLIC_DIR))
  
router.get('/', (req, res) => {
  return res.end(fs.readFileSync('./index.html'))
})

router.use(bss.api.PRIVATE_API, privateApi.getAccessPrivateApiHandler(setting.codeList, db.getUserIdByAccessToken))

router.get(bss.api.PRIVATE_API + bss.api.PRIVATE_GET_FILE, filePrivateApi.getFileHandler(setting.codeList, db.getFileByFileLabelUserId))

router.get('*', (req, res) => {
  res.status(404)
  return res.end('not found')
})

module.exports = {
  router,
}

