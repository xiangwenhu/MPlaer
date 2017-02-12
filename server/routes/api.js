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
    let data = await apiProxy.songDetail(ctx.params.id)
    ctx.body = data
})
.get('/artist/info/:uid',async(ctx)=>{
    let data = await apiProxy.artistInfo(ctx.params.uid)
    ctx.body = data
})
.get('/lry/:id',async(ctx)=>{
    let data = await apiProxy.lry(ctx.params.id)
    ctx.body = data
})
.get('/getAll', async(ctx)=>{
    let data = await apiProxy.getAll(ctx.query.baseUrl = null, ctx.query.query)
    ctx.body = data
})

module.exports = router