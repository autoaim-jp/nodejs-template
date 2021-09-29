const mysql = require('mysql2')

let pool = null

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
  for(const sql of sqlList) {
    await new Promise((resolve, reject) => {
      return pool.query(sql, (err, result) => {
        if(err) {
          return reject(err)
        }
        resolve()
      })
    })
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

