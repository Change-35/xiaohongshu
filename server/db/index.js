const mysql = require('mysql')
const config = require('../config')

// 数据库
const poolSql = mysql.createPool({
  host: config.database.HOST, //url
  port: config.database.PORT, //端口
  user: config.database.USERNAME, //库名称
  password: config.database.PASSWORD, //数据库密码
  database: config.database.DATABASE, //表名称
})

// 查询
function query(sql, value = []) {
  return new Promise((resolve, reject) => {
    poolSql.query(sql, value, (error, result) => {
      error && reject(error) //有错误信息时reject
      resolve(result) //抛出查询结果
    })
  })
}

module.exports = query