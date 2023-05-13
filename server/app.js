const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  ctx.response.body = {
    code: 1,
    message: '请求成功',
    data: [
      {
        name: 'kobe',
        age: '24'
      },
      {
        name: 'durant',
        age: '35'
      },
      {
        name: 'james',
        age: '6'
      }
    ]
  };
};

app.use(main);

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000');
})
