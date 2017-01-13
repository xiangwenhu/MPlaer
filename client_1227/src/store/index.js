import Vue from 'vue'
import Vuex from 'vuex'
import apiProxy from './apiProxy'
import localCacheProxy from './localCache'
const MPLAYER_PL = '_MPlayer_PlayingList_'


/* 本地缓存 */
const localCache = {
    playingId: null,  /*当前播放歌曲id*/
    currentTime: -1,  /*当前播放歌曲时间*/
    songDetail: null, /*当前播放歌曲详情 */
    playMode: 1, /*  播放模式   1 顺序播放， 2单曲播放， 10随心听*/
    hearts: [],  /*  随心听歌曲 */
    keyWords: '云',/* 搜索的关键字*/
    result: [],/* 搜索的结果 */
    markedSongs: [], /* 标记的歌曲 */
    lyc: '', /* 歌词 */
    channels: [], // 频道    
    favorites: [{
        songname: '寂寞的人伤心的歌',
        songid: '265046969'
    }, {
        songname: '逆流成河',
        songid: '106125582'
    }],
}

let state = Object.assign({}, localCache, localCacheProxy.getCache(MPLAYER_PL), {
    playingId: null,
    markedSongs:[],
    playMode:1
})



Vue.use(Vuex)

const store = new Vuex.Store({
    state: state,
    actions: {
        /* 搜索歌曲 */
        async searchAsync({commit}, keyWords) {
            commit('setKeyWords', keyWords)
            let data = await apiProxy.search(keyWords)
            commit('search', data)
        },
        /*默认搜索热门歌曲 */
        async hotSongs({commit}) {
            let defaultSongs = await apiProxy.hotSongs(),
                songs = (defaultSongs['song_list'] || []).map((s) => {
                    return {
                        songid: s['song_id'],
                        songname: s.title,
                        artistname: s['artist_name']
                    }
                })
            commit('hotSongs', songs)
        },
        /* 歌曲详情 */
        async songDetail({commit}, id) {
            let detail = await apiProxy.songDetail(id)
            commit('songDetail', detail)
        },
        /*   */
        async channels({state}) {
            let channels = await apiProxy.channels()
            state.channels = channels.result[0].channellist
        },
        /* 随心听 */
        async toHearts({dispatch, commit, state}) {
            let channel = state.channels[~~(Math.random() * state.channels.length)]
            let hearts = await apiProxy.channelSongs(channel['ch_name'])
            state.hearts = hearts.result.songlist
            commit('changeMode', 10)
            dispatch('next')
        },
        /* 更换当前播放的id */
        changeId({commit, dispatch}, id) {
            commit('changeId', id)
            dispatch('songDetail', id)
        },
        /* 下一曲 */
        next({dispatch, getters}) {
            dispatch('changeId', getters.nextId)
        },
        /* 上一曲 */
        pre({dispatch, getters}) {
            dispatch('changeId', getters.preId)
        }
    },

    mutations: {
        /*设置关键字 */
        setKeyWords(state, keyWords) {
            state.keyWords = keyWords
        },
        /*更新搜索结果*/
        search(state, result) {
            state.result = result.data.song || []
        },
        /*更换播放的歌曲*/
        changeId(state, id) {
            state.playingId = id
        },
        /* 默认加载热门歌曲 */
        hotSongs(state, hotSongs) {
            state.result = hotSongs
        },
        /* 歌曲详情，包含媒体地址 */
        songDetail(state, detail) {
            state.songDetail = detail
        },
        /*  添加歌曲到收藏 */
        addSong(state, songs) {

            if (songs instanceof Array) {
                state.favorites.push(...songs)
                state.markedSongs = []
            } else {
                if (state.favorites.findIndex(s => s.songid == songs.songid) < 0) {
                    state.favorites.push(songs)
                }
                //未定逻辑。。。
            }

            localCacheProxy.setCache(MPLAYER_PL, state)
        },
        /* 移除收藏的一首歌曲 */
        removeSong(state, id) {
            let index = state.favorites.findIndex(value => value.songid === id)
            if (index >= 0) {
                state.favorites.splice(index, 1)
            }
            localCacheProxy.setCache(MPLAYER_PL, state)
        },
        /* 当前播放时间 */
        currentTime(state, time) {
            state.currentTime = time
        },
        /* 歌曲时间 */
        detail(state, detail) {
            state.detail = detail
        },
        /* 更换播放模式 */
        changeMode(state, mode) {
            state.playMode = mode
            //TODO::
            localCacheProxy.setCache(MPLAYER_PL, state)
        },
        markSong(state, s) {
            if (s.isAdd) {
                state.markedSongs.push(s.song)
            } else {
                let index = state.markedSongs.findIndex(value => value.songid === s.song.songid)
                if (index >= 0) {
                    state.markedSongs.splice(index, 1)
                }
            }
        }
    },

    getters: {
        songs(state) {
            let songs
            if (state.playMode == 1) {
                songs = state.favorites
            } else if (state.playMode == 10) {
                songs = state.hearts
            }
            return songs
        },
        nextId(state, getters) {
            let nextId,
                index = getters.songs.findIndex(p => {
                    return p.songid == state.playingId
                })
            if (index >= 0) {
                /* 是不是最后一首歌曲 */
                nextId = (index == getters.songs.length - 1) ? getters.songs[0].songid : getters.songs[index + 1].songid
            } else {
                nextId = getters.songs[0].songid
            }
            return nextId
        },
        preId(state, getters) {
            let nextId,
                index = getters.findIndex(p => {
                    return p.songid == state.playingId
                })
            if (index >= 0) {
                /* 是不是第一首歌曲 */
                let len = getters.songs.length
                state.playingId = (index == 0) ? getters.songs[len - 1].songid : getters.songs[index - 1].songid
            } else {
                state.playingId = getters.songs[0].songid
            }
            return nextId
        }
    }
})

export default store
