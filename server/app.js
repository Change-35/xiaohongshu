const Koa = require('koa');
const router = require('./router')
const cors = require('koa2-cors') // 跨域
const bodyParser  = require('koa-bodyparser') // 获取接口参数
const koaJwt  = require('koa-jwt') // 解码token
const config = require('./config')
const tools = require('./tools')

// 实例
const app = new Koa()

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = {
      code: 0,
      status: err.statusCode || err.status || 500,
      message: err.message
    };
  }
})

app.use(koaJwt({ secret: config.secret }).unless({
  path: [
    /^\/api\/login/,
    /^\/api\/register/,
  ]
}))

app.use(bodyParser() /*获取接口参数 */).use(router.routes() /*配置路由*/).use(cors() /*跨域 */)

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000');
})
