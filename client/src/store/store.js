import apiProxy from '../apiProxy'
import localCacheProxy from './localCache'


const MPLAYER_PL = '_MPlayer_PlayingList_'

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
        songname:'恭喜发财',
        songid:'8245250'
    },{
        songname:'伤了你的心的我的心好伤心',
        songid:'580824'  
    }]
}

localCache.playingList = localCacheProxy.getCache(MPLAYER_PL) || localCache.playingList


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
            if(this.cache.playingList.findIndex(s=>s.songid == songs.songid) < 0){
             this.cache.playingList.push(songs)
            }
        }
        localCacheProxy.setCache(MPLAYER_PL,this.cache.playingList)
    },
    removeSong(id){
        let index = this.cache.playingList.findIndex(value=> value.songid === id)
        if(index>=0){
            this.cache.playingList.splice(index,1)
        } 
        localCacheProxy.setCache(MPLAYER_PL,this.cache.playingList)       
    },
    clearSongs(){
        this.cache.playingList.splice(0, this.cache.playingList.length)
        localCacheProxy.setCache(MPLAYER_PL,this.cache.playingList)
    }
}
