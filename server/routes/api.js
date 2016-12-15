const Router = require('koa-router')
const apiProxy = require('../model/index')

const router = 	new Router({
    prefix:'/api'
})

//搜索
router.get('/search/:keyWords', async (ctx)=>{
     let data = await apiProxy.search(ctx.params.keyWords)
     ctx.body = data
})
//媒体流
.get('/song',async(ctx)=>{
    let fileLink = ctx.query.fileLink    
    ctx.body = apiProxy.mediaStream(fileLink)	
})
//歌曲详情
.get('/song/detail/:id',async(ctx)=>{
    let detail = await apiProxy.songDetail(ctx.params.id)
    ctx.body = detail
})

module.exports = router