import apiProxy from '../apiProxy'

const defaultState = {
    loading:false, /* 是否loading */
    status:0,    /*  播放状态 */
    playingId:-1, /* 播放的id */
    songs:[],
    artists:[],
    albums:[]
}

/* 本地缓存 */
const localCache = {
    playingList:[{
        songname:'海阔天空',
        songid:'268425156'
    },{
        songname:'火星人来过',
        songid:'278860063'
    }]
}

export default {    
    state:defaultState,   
    async search(keyWords){
        let datas = await apiProxy.search(keyWords)
        return datas
     },
     async songDetail(id){
         let detail = await apiProxy.songDetail(id)
         return detail
     },


    cache:localCache,    
    addSong(songs){
        if(songs instanceof Array){
            /* 同样可以push */
            this.cache.playingList.splice(0,0,...songs)
        }else{
            if(this.cache.playingList.findIndex(s=>{
                return s.songid == songs.songid
            }) < 0){
             this.cache.playingList.push(songs)
            }
        }
    },
    deleteSong(id){
        let index = this.cache.playingList.findIndex(value=>{
            value.id === id
        })
        if(index>0){
            this.cache.playingList.splice(index,1)
        }        
    },
    clearSongs(){
        this.cache.playingList.splice(0, this.cache.playingList.length)
    }
}
