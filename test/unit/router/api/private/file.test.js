require('dotenv').config({ path: __dirname + '/../.env', })
process.env.APP_PATH = __dirname + '/../'

const testSetting = require(process.env.APP_PATH + 'test/setting')
const testDb = require(process.env.APP_PATH + 'test/lib/testDatabase')
testDb.init({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
})

const setting = require(process.env.APP_PATH + 'setting')
const db = require(process.env.APP_PATH + 'lib/database')
db.init({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
})

const { getFileHandler, } = require(process.env.APP_PATH + 'router/api/private/file')

beforeAll(async () => {
  console.log('beforeAll')
  await testDb.executeSqlList(testSetting.dropTableSqlList)
  await testDb.executeSqlList(testSetting.createTableSqlList)
}, 20 * 1000)

afterAll(async () => {
  console.log('afterAll')
  testDb.close()
})

describe('success private file api', () => {
  const registerFileSqlList = [
    'insert into userList (userId, userName) values (1, "test user");',
    'insert into accessTokenList (userId, accessToken) values (1, "accessTokenDeadBeef1");',
    'insert into fileList (fileId, userId, fileLabel, fileName, fileContent) values (1, 1, "fileLabelDeadBeef1", "filenameabc", "file content hello world");',
  ]

  beforeEach(async () => {
    console.log('beforeEach')
    await testDb.executeSqlList(testSetting.truncateTableSqlList)
  }, 10 * 1000)
  afterEach(async () => {
    console.log('afterEach')
  })

  test('success: getFileHandler', async () => {
    await testDb.executeSqlList(registerFileSqlList)
    const req = {
      query: {
        fileLabel: 'fileLabelDeadBeef1',
      },
      body: {
      },
      session: {
        user: { userId: 1, }, 
      },
      headers: {
        authorization: 'bearer accessTokenDeadBeef1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await getFileHandler(setting.codeList, db.getFileByFileLabelUserId)(req, res)

    expect(res.status.mock.calls[0][0]).toBe(200)
    console.log(res.json.mock.calls[0][0])
    console.log('db test')
    return null
  })

})
