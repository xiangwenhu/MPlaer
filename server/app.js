const Koa = require('koa')
const koaStatic  = require('koa-static') 
const path = require('path')
const views  = require('koa-views')
const bodyparser  = require('koa-bodyparser')
const routes = require('./routes')

const app = new Koa()

//bodyparser
app.use(bodyparser())

//模板
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

//静态服务器资源
app.use(koaStatic(path.resolve(__dirname,'../client')))

//自定义错误处理
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.render('404', {
        msg: '404 未找到'
      })
    }
  } catch (err) {
    let status = err.status || 500
    ctx.render('500', {
      status,
      msg: '服务器内部错误' + err.body || err.message
    })
    console.log(err)
  }
})

// x-response-time
app.use(async function (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// logger
app.use(async function (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}`)
})

//路由
routes(app)

//异常
app.on('error', (err, ctx) => {
  logger.error(ctx.url)
  logger.error(err)
  logger.error(err.stack)
})



app.listen(3000)
