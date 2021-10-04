const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/../.env') })

process.env.APP_PATH = path.join(__dirname, '/../')

const testSetting = require(path.join(process.env.APP_PATH, 'test/setting'))
const testDb = require(path.join(process.env.APP_PATH, 'test/lib/testDatabase'))
testDb.init({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
})

const setting = require(path.join(process.env.APP_PATH, 'setting'))
const db = require(path.join(process.env.APP_PATH, 'lib/database'))
db.init({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
})

const { getFileHandler } = require(path.join(process.env.APP_PATH, 'router/api/private/file'))

beforeAll(async () => {
  await testDb.executeSqlList(testSetting.dropTableSqlList)
  await testDb.executeSqlList(testSetting.createTableSqlList)
}, 20 * 1000)

afterAll(async () => {
  testDb.close()
})

describe('success private file api', () => {
  const registerFileSqlList = [
    'insert into userList (userId, userName) values (1, "test user");',
    'insert into accessTokenList (userId, accessToken) values (1, "accessTokenDeadBeef1");',
    'insert into fileList (fileId, userId, fileLabel, fileName, fileContent) values (1, 1, "fileLabelDeadBeef1", "filenameabc", "file content hello world");',
  ]

  beforeEach(async () => {
    await testDb.executeSqlList(testSetting.truncateTableSqlList)
  }, 10 * 1000)
  afterEach(async () => {
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
        user: { userId: 1 },
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
    return null
  })
})
