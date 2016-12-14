const request = require('../utils/request')
const orgRequest = require('request')


module.exports =   {

    //服务基础地址
    get baseUrl(){
        return 'http://tingapi.ting.baidu.com/v1/restserver/ting'
    },
    
    //搜索
    get  search() {
        return async function(keyWords){
            let name = decodeURI(keyWords),	
            params = 'method=baidu.ting.search.catalogSug&query=' + encodeURI(name),
            songs = await request.get(this.baseUrl + '?' +params)	
            return songs
        }
    },

    //歌曲详情
    get songDetail(){
        return async function(id){
            let songUrl = this.baseUrl + '?method=baidu.ting.song.playAAC&songid=' + id,
                songDetail = await request.get(songUrl)	
            return songDetail
        }
    },

    //歌曲流
    get mediaStream(){
        return function(fileLink){
            let options = {
                url: fileLink,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            } 
            return orgRequest(options)
        }
    }  
}