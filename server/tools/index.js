const tokenCheck = function () {
  return async function (ctx, next) {
    console.log(ctx.state.user);
    if (ctx.state.user) {
      await next()
    } else {
      const body = { code: 1, status: 200, data: null, message: 'ok' }
      body.code = 0,  
      body.status = 401,
      body.message= 'Authentication Error'
      ctx.body = body
    }
  }
}

const tools = {
  tokenCheck
}

module.exports = tools