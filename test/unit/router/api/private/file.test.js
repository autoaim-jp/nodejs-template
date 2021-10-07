/**
 * @file Fle Private API のテストファイル
 * @namespace private.file
 * @memberof test.
 */
const path = require('path')
const dotenv = require('dotenv')

if (process.env.GITHUB_WORKFLOW) {
  dotenv.config({ path: path.join(__dirname, '/../../../../../.env.github') })
} else {
  dotenv.config({ path: path.join(__dirname, '/../../../../../.env') })
}

process.env.APP_PATH = path.join(__dirname, '/../../../../../')

const util = require(path.join(process.env.APP_PATH, 'lib/util'))
const testSetting = require(path.join(process.env.APP_PATH, 'test/setting'))
const testDb = require(path.join(process.env.APP_PATH, 'test/lib/testDatabase'))
const setting = require(path.join(process.env.APP_PATH, 'setting'))
const db = require(path.join(process.env.APP_PATH, 'lib/database'))

const dummyLogger = util.getLogger({ test: 1 })

testDb.init({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
})

db.init({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
}, dummyLogger, setting.codeList)


const { getFileHandler } = require(path.join(process.env.APP_PATH, 'router/api/private/file'))

beforeAll(async () => {
  await testDb.executeSqlList(testSetting.dropTableSqlList)
  await testDb.executeSqlList(testSetting.createTableSqlList)
}, 20 * 1000)

afterAll(() => {
  testDb.close()
  db.close()
})

const getPrivateFileApiSuccessTest = () => {
  const registerFileSqlList = [
    'insert into userList (userId, userName) values (1, "test user");',
    'insert into accessTokenList (userId, accessToken) values (1, "accessTokenDeadBeef1");',
    'insert into fileList (fileId, userId, fileLabel, fileName, fileContent) values (1, 1, "fileLabelDeadBeef1", "filenameabc", "file content hello world");',
  ]

  /**
   * fileLabelからファイル情報を取得するAPIのテスト
   *
   * @memberof private.file
   * @return {null}
   */
  const getFileHandlerTest = async () => {
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

    await getFileHandler(
      dummyLogger,
      setting.codeList,
      db.forWebClient.getFileByFileLabelUserId,
    )(req, res)

    expect(res.status.mock.calls[0][0]).toBe(200)
    return null
  }

  return {
    getFileHandlerTest,
  }
}

describe('success private file api', () => {
  beforeEach(async () => {
    await testDb.executeSqlList(testSetting.truncateTableSqlList)
  }, 10 * 1000)
  afterEach(async () => {
  })

  const testList = getPrivateFileApiSuccessTest()
  test('success: getFileHandler', testList.getFileHandlerTest)
})

