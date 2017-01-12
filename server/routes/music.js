const Router = require('koa-router')

const router = 	new Router()

router.get('/',async (ctx)=>{
    await ctx.render('index',{})
}).get('/index',async (ctx)=>{
    await ctx.render('indexWithStore')
})

module.exports = router