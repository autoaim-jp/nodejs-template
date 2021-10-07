const mysql = require('mysql2')

let pool = {}

const init = (config) => {
  pool = mysql.createPool({
    connectionLimit: 100,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: false,
  })
}

const executeSqlList = async (sqlList) => {
  const executeSql = (sql) => {
    return new Promise((resolve, reject) => {
      return pool.query(sql, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }

  for await (const sql of sqlList) {
    await executeSql(sql)
  }
}

const close = () => {
  pool.end()
}


module.exports = {
  init,
  executeSqlList,
  close,
}

