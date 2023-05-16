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

// 登录
router.post('/login', async (ctx, next) => {
  const body = { code: 1, status: 200, data: null, message: 'ok' }
  const { account, password } = ctx.request.body
  if (!(ctx.request.body.hasOwnProperty('account') && ctx.request.body.hasOwnProperty('password'))) {
    body.code = 0
    body.message = '请求体缺失account或password字段'
    ctx.body = body
    return false
  }
  try {
    const sql = 'select * from user where account = ? and password = ?'
    const data = await poolSql(sql, [account, password])
    if (!data.length) {
      body.code = 0
      body.message = '账号或密码错误。'
    } else {
      const user_id = data[0].id
      const account = data[0].account
      const payload = {user_id, account}
      body.data = {
        'access_token': jwt.sign(payload, config.secret, { expiresIn: 3600 })
      }
    }
  } catch (error) {
    body.code = 0
    body.status = error.statusCode || error.status || 500
    body.message = error
  } finally {
    ctx.body = body
  }
})

// 注册
router.post('/register', async (ctx, next) => {
  const time = new Date().getTime()
  const body = { code: 1, status: 200, data: null, message: 'ok' }
  const { action, account, password } = ctx.request.body
  if (!ctx.request.body.hasOwnProperty('action')) {
    body.code = 0
    body.message = '请求体缺失action字段'
    ctx.body = body
    return false
  }
  try {
    let sql = ''
    let data = ''
    switch (action) {
      case 'check':
        if (!ctx.request.body.hasOwnProperty('account')) {
          body.code = 0
          body.message = '请求体缺失account字段'
          ctx.body = body
          return false
        }
        if (!account.trim()) {
          body.code = 0
          body.message = 'account字段不能为空'
          ctx.body = body
          return false
        }
        sql = 'select * from user where account = ?'
        data = await poolSql(sql, [account])
        if (data.length) {
          body.code = 1
          body.message = '账号已注册' 
        } else {
          body.code = 0
          body.message = '账号未注册' 
        }
        break;
      case 'create':
        if (!(ctx.request.body.hasOwnProperty('account') && ctx.request.body.hasOwnProperty('password'))) {
          body.code = 0
          body.message = '请求体缺失account或password字段'
          ctx.body = body
          return false
        }
        if (!(account.trim() && password.trim())) {
          body.code = 0
          body.message = 'account或password字段不能为空'
          ctx.body = body
          return false
        }
        sql = 'select * from user where account = ?'
        data = await poolSql(sql, [account])
        if (data.length) {
          body.code = 0
          body.message = '账号已注册' 
        } else {
          sql = 'insert into user (account, `password`, created_at, updated_at, status) values (?, ?, ?, ?, ?)'
          data = await poolSql(sql, [account, password, time, time, 1])
          body.message = '账号新建成功' 
        }
        break;
      default:
        body.code = 0
        body.message = '不存在此action方法'
        break;
    }
  } catch (error) {
    body.code = 0
    body.status = error.statusCode || error.status || 500
    body.message = error
  } finally {
    ctx.body = body
  }
})

module.exports = router
