const Router = require('koa-router')
const poolSql = require('../db') // mysql操作
const jwt = require('jsonwebtoken') // 创建token
const config = require('../config')

const router = new Router({
  prefix:'/api'
})

router.get('/user', async (ctx, next) => {
  // const payload = ctx.state.user
  const body = { code: 1, status: 200, data: null, message: 'ok' }
  try {
    const sql = 'select * from user'
    const data = await poolSql(sql)
    body.data = data
  } catch (error) {
    body.message = error,
    body.code = '0'
  } finally {
    ctx.body = body
  }
})

router.post('/login', async (ctx, next) => {
  const body = { code: 1, status: 200, data: null, message: 'ok' }
  const { account, password } = ctx.request.body
  if (!(account && password)) {
    body.code = 0
    body.status = 404
    body.message = '请求体缺少account或password字段'
    ctx.body = body
    return false
  }
  try {
    const sql = 'select * from user where account = ? and password = ?'
    const data = await poolSql(sql, [account, password])
    if (!data.length) {
      body.code = 0
      body.message = '查询为空'
    } else {
      const user_id = data[0].id
      const account = data[0].account
      const payload = {user_id, account}
      body.data = jwt.sign(payload, config.secret, { expiresIn: 3600 })
    }
  } catch (error) {
    body.message = error,
    body.code = '0'
  } finally {
    ctx.body = body
  }
})

module.exports = router
