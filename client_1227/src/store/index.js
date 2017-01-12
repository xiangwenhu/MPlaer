import Vue from 'vue'
import Vuex from 'vuex'
import apiProxy from './apiProxy'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        playingId:null,  /*当前播放歌曲id*/
        currentTime:-1,  /*当前播放歌曲时间*/
        songDetails:null, /*当前播放歌曲详情 */
        playMode:1, /*  播放模式 */
        hearts:[],  /*  收藏的歌曲 */
        search:null ,/* 搜索的关键字*/
    },

    actions: {

    },

    mutations: {
     
    },

    getters: {
      
    }
})

export default store
