webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

/**
 * vuex v2.0.0-rc.6
 * (c) 2016 Evan You
 * @license MIT
 */
(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vuex = factory());
}(this, (function () { 'use strict';

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook

  devtoolHook.emit('vuex:init', store)

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState)
  })

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state)
  })
}

function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1
    Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options
    // store injection
    if (options.store) {
      this.$store = options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

function mapState (states) {
  var res = {}
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      return typeof val === 'function'
        ? val.call(this, this.$store.state, this.$store.getters)
        : this.$store.state[val]
    }
  })
  return res
}

function mapMutations (mutations) {
  var res = {}
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
}

function mapGetters (getters) {
  var res = {}
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedGetter () {
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val))
      }
      return this.$store.getters[val]
    }
  })
  return res
}

function mapActions (actions) {
  var res = {}
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    }
  })
  return res
}

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Vue // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  assert(Vue, "must call Vue.use(Vuex) before creating a store instance.")
  assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.")

  var state = options.state; if ( state === void 0 ) state = {};
  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._options = options
  this._committing = false
  this._actions = Object.create(null)
  this._mutations = Object.create(null)
  this._wrappedGetters = Object.create(null)
  this._runtimeModules = Object.create(null)
  this._subscribers = []
  this._watcherVM = new Vue()

    // bind commit and dispatch to self
  var store = this
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  }

  // strict mode
  this.strict = strict

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], options)

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state)

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); })
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm.state
};

prototypeAccessors.state.set = function (v) {
  assert(false, "Use store.replaceState() to explicit replace store state.")
};

Store.prototype.commit = function commit (type, payload, options) {
    var this$1 = this;

  // check object-style commit
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }
  var mutation = { type: type, payload: payload }
  var entry = this._mutations[type]
  if (!entry) {
    console.error(("[vuex] unknown mutation type: " + type))
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
  })
  if (!options || !options.silent) {
    this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); })
  }
};

Store.prototype.dispatch = function dispatch (type, payload) {
  // check object-style dispatch
  if (isObject(type) && type.type) {
    payload = type
    type = type.type
  }
  var entry = this._actions[type]
  if (!entry) {
    console.error(("[vuex] unknown action type: " + type))
    return
  }
  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  var subs = this._subscribers
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return function () {
    var i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  assert(typeof getter === 'function', "store.watch only accepts a function.")
  return this._watcherVM.$watch(function () { return getter(this$1.state); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm.state = state
  })
};

Store.prototype.registerModule = function registerModule (path, module) {
  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
  this._runtimeModules[path.join('.')] = module
  installModule(this, this.state, path, module)
  // reset store to update getters...
  resetStoreVM(this, this.state)
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
    delete this._runtimeModules[path.join('.')]
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1))
    Vue.delete(parentState, path[path.length - 1])
  })
  resetStore(this)
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  updateModule(this._options, newOptions)
  resetStore(this)
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function updateModule (targetModule, newModule) {
  if (newModule.actions) {
    targetModule.actions = newModule.actions
  }
  if (newModule.mutations) {
    targetModule.mutations = newModule.mutations
  }
  if (newModule.getters) {
    targetModule.getters = newModule.getters
  }
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!(targetModule.modules && targetModule.modules[key])) {
        console.warn(
          "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
          'manual reload is needed'
        )
        return
      }
      updateModule(targetModule.modules[key], newModule.modules[key])
    }
  }
}

function resetStore (store) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  var state = store.state
  // init root module
  installModule(store, state, [], store._options, true)
  // init all runtime modules
  Object.keys(store._runtimeModules).forEach(function (key) {
    installModule(store, state, key.split('.'), store._runtimeModules[key], true)
  })
  // reset vm
  resetStoreVM(store, state)
}

function resetStoreVM (store, state) {
  var oldVm = store._vm

  // bind store public getters
  store.getters = {}
  var wrappedGetters = store._wrappedGetters
  var computed = {}
  Object.keys(wrappedGetters).forEach(function (key) {
    var fn = wrappedGetters[key]
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); }
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; }
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: { state: state },
    computed: computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    // dispatch changes in all subscribed watchers
    // to force getter re-evaluation.
    store._withCommit(function () {
      oldVm.state = null
    })
    Vue.nextTick(function () { return oldVm.$destroy(); })
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length
  var state = module.state;
  var actions = module.actions;
  var mutations = module.mutations;
  var getters = module.getters;
  var modules = module.modules;

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1))
    var moduleName = path[path.length - 1]
    store._withCommit(function () {
      Vue.set(parentState, moduleName, state || {})
    })
  }

  if (mutations) {
    Object.keys(mutations).forEach(function (key) {
      registerMutation(store, key, mutations[key], path)
    })
  }

  if (actions) {
    Object.keys(actions).forEach(function (key) {
      registerAction(store, key, actions[key], path)
    })
  }

  if (getters) {
    wrapGetters(store, getters, path)
  }

  if (modules) {
    Object.keys(modules).forEach(function (key) {
      installModule(store, rootState, path.concat(key), modules[key], hot)
    })
  }
}

function registerMutation (store, type, handler, path) {
  if ( path === void 0 ) path = [];

  var entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler(getNestedState(store.state, path), payload)
  })
}

function registerAction (store, type, handler, path) {
  if ( path === void 0 ) path = [];

  var entry = store._actions[type] || (store._actions[type] = [])
  var dispatch = store.dispatch;
  var commit = store.commit;
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler({
      dispatch: dispatch,
      commit: commit,
      getters: store.getters,
      state: getNestedState(store.state, path),
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function wrapGetters (store, moduleGetters, modulePath) {
  Object.keys(moduleGetters).forEach(function (getterKey) {
    var rawGetter = moduleGetters[getterKey]
    if (store._wrappedGetters[getterKey]) {
      console.error(("[vuex] duplicate getter key: " + getterKey))
      return
    }
    store._wrappedGetters[getterKey] = function wrappedGetter (store) {
      return rawGetter(
        getNestedState(store.state, modulePath), // local state
        store.getters, // getters
        store.state // root state
      )
    }
  })
}

function enableStrictMode (store) {
  store._vm.$watch('state', function () {
    assert(store._committing, "Do not mutate vuex store state outside mutation handlers.")
  }, { deep: true, sync: true })
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

var index = {
  Store: Store,
  install: install,
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions
}

return index;

})));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
const defaultOptions = {
    headers:{
        isFetch:1
    }
}

/* harmony default export */ exports["a"] = {
    baseUrl:'/api/',
    fetchData(url,options = defaultOptions){
        return new Promise((resolve,reject)=>{
            fetch(url,options).then(response=>response.json())
            .then(data=>resolve(data)).catch(err=>reject(err))
        })
    },
    async search(title){
       let datas = await this.fetchData(this.baseUrl + 'search/'+ title)
       return datas
    },
    async songDetail(id){
        let data  = await this.fetchData(this.baseUrl + 'song/detail/' + id)
        return data
    },    
    async artistIfo(uid){
        let data  = await this.fetchData(this.baseUrl + 'artist/info/' + uid)
        return data
    },
    async lry(id){
        let data  = await this.fetchData(this.baseUrl + 'lry/' + id)
        return data
    },
    async hotSongs(){
        let data = await this.fetchData(this.baseUrl + 'getAll?query=' + encodeURIComponent('from=qianqian&version=2&method=baidu.ting.billboard.billList&format=json&type=2&offset=0&size=50') )
        return data    
    },
    async channels(){
        let data = await this.fetchData(this.baseUrl + 'getAll?query=' + encodeURIComponent('from=qianqian&version=2&method=baidu.ting.radio.getCategoryList&format=json') )
        return data    
    },
    async channelSongs(cname){
        let data = await this.fetchData(this.baseUrl + 'getAll?query=' + encodeURIComponent('from=qianqian&version=2.1.0&method=baidu.ting.radio.getChannelSong&format=json&pn=0&rn=199&channelname=' + cname))
        return data
    }
};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apiProxy__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__localCache__ = __webpack_require__(13);




const MPLAYER_PL = '_MPlayer_PlayingList_'


/* 本地缓存 */
const localCache = {
    playingId: null,  /*当前播放歌曲id*/   
    currentTime: -1,  /*当前播放歌曲时间*/
    songDetail: null, /*当前播放歌曲详情 */
    playMode: 1, /*  播放模式 */
    hearts: [],  /*  随心听歌曲 */
    keyWords: '云',/* 搜索的关键字*/
    result: [],/* 搜索的结果 */
    lyc:'', /* 歌词 */
    favorites:[{
        songname:'恭喜发财',
        songid:'8245250'
    },{
        songname:'伤了你的心的我的心好伤心',
        songid:'580824'  
    }],
}

let state  =  Object.assign( {}, localCache ,__WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].getCache(MPLAYER_PL))



__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vuex___default.a)

const store = new __WEBPACK_IMPORTED_MODULE_1_vuex___default.a.Store({
    state:state,
    actions: {
        /* 搜索歌曲 */
        async searchAsync({commit}, keyWords) {
            commit('setKeyWords', keyWords)
            let data = await __WEBPACK_IMPORTED_MODULE_2__apiProxy__["a" /* default */].search(keyWords)
            commit('search', data)
        },
        /*默认搜索热门歌曲 */
        async hotSongs({commit}) {
            let defaultSongs = await __WEBPACK_IMPORTED_MODULE_2__apiProxy__["a" /* default */].hotSongs(),
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
            let detail = await __WEBPACK_IMPORTED_MODULE_2__apiProxy__["a" /* default */].songDetail(id)
            commit('songDetail', detail)
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
        addSong(state, song) {
            state.favorites.push(song)
            __WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].setCache(MPLAYER_PL,state)
        },
        /* 移除收藏的一首歌曲 */
        removeSong(state, id) {
            let index = state.favorites.findIndex(value => value.songid === id)
            if (index >= 0) {
                state.favorites.splice(index, 1)
            }
           __WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].setCache(MPLAYER_PL,state)
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
           __WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].setCache(MPLAYER_PL,state)
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

/* harmony default export */ exports["a"] = store;


/***/ },
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(27)

/* script */
__vue_exports__ = __webpack_require__(57)

/* template */
var __vue_template__ = __webpack_require__(65)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = {
    getCache(key){
        let data = localStorage.getItem(key)
        return JSON.parse(data)
    },
    setCache(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    }
};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".playingList li{color:rgba(41,79,52,.6);margin:0 0 0 30px}.playingList .text{color:inherit}.playingItem{background-color:rgba(68,141,119,.24)}.playingList .song-item{float:right;position:absolute;right:30px}.hide{display:none}.show{display:\"inline-block\"}", ""]);

// exports


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".column2{right:280px}", ""]);

// exports


/***/ },
/* 16 */,
/* 17 */,
/* 18 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".ui-reelList-cell{position:relative;display:inline-block;width:26%}", ""]);

// exports


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#player{width:100%}.mb-layout-ft{text-align:left}.left-panel{position:absolute;left:0;top:0}.main-panel{width:auto;margin:22px 150px}.right-panel{position:absolute;width:120px;top:22px;right:0}", ""]);

// exports


/***/ },
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".ui-reelList-header-column{position:relative;display:inline-block;width:26%}.ui-reelList-cell,.ui-reelList-header-column{padding:0}.ui-reelList-row{position:relative}", ""]);

// exports


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".column3{right:5px}.light{color:red;font-size:15px}", ""]);

// exports


/***/ },
/* 25 */,
/* 26 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-08eb9b04!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./PlayingList.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-08eb9b04!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./PlayingList.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-24e4a473!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
			var newContent = require("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-24e4a473!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 28 */,
/* 29 */,
/* 30 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-4e5f14ad!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Song.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-4e5f14ad!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Song.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-68861479!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Player.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-68861479!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Player.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-b724d02a!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./SongList.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-b724d02a!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./SongList.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-c3c3556a!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Lry.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-c3c3556a!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Lry.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(36)

/* script */
__vue_exports__ = __webpack_require__(58)

/* template */
var __vue_template__ = __webpack_require__(76)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(31)

/* script */
__vue_exports__ = __webpack_require__(59)

/* template */
var __vue_template__ = __webpack_require__(71)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(26)

/* script */
__vue_exports__ = __webpack_require__(60)

/* template */
var __vue_template__ = __webpack_require__(64)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(61)

/* template */
var __vue_template__ = __webpack_require__(69)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(30)

/* script */
__vue_exports__ = __webpack_require__(62)

/* template */
var __vue_template__ = __webpack_require__(68)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(35)

/* script */
__vue_exports__ = __webpack_require__(63)

/* template */
var __vue_template__ = __webpack_require__(75)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}

__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

module.exports = __vue_exports__


/***/ },
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Player_vue__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Player_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_Player_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_SongList_vue__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_SongList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_SongList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PlayingList_vue__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PlayingList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_PlayingList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Lry_vue__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Lry_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_Lry_vue__);
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ exports["default"] = {
    name: 'appp',

    components: {
        SearchBox: __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue___default.a,
        Player: __WEBPACK_IMPORTED_MODULE_1__components_Player_vue___default.a,
        SongList: __WEBPACK_IMPORTED_MODULE_2__components_SongList_vue___default.a,
        PlayingList: __WEBPACK_IMPORTED_MODULE_3__components_PlayingList_vue___default.a,
        Lry: __WEBPACK_IMPORTED_MODULE_4__components_Lry_vue___default.a
    },       
    methods: {  
       
    },
    mounted: function () {
        if(this.$store.state.favorites){
            this.$store.dispatch('changeId',this.$store.state.favorites[0].songid)
        }           
    }
};


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store_apiProxy__ = __webpack_require__(6);
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


 
/* harmony default export */ exports["default"] = {
    name:'lry',      
    data(){
        return{
            lryArr:[],
            title:'',              
            currentIndex:-1
        }
    },
    computed:__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapState"])([
        'currentTime',
        'playingId'           
    ]),
    watch:{
        currentTime(to,from){
         let i = this.lryArr.findIndex(v=>v[0]>to)   
            if(i<0){
                return
            }
            if(!(i == 0 || i == this.lryArr.length - 1)){ /* 不是开头和结尾 */
                i = i - 1
            }
            if(i != this.currentIndex ){                              
                this.currentIndex = i   
                let cEl = lrcWrap.querySelector('[data-index="index-' + i + '"]');
                if(cEl !=null){ 
                    let offsetHeight = lrcWrap.offsetHeight,
                        offsetTop = cEl.offsetTop 
                    lrcWrap.scrollTop = offsetTop > offsetHeight ? offsetTop - offsetHeight/2.0 : offsetTop/2.0
                }
            }                 
        },
        async playingId(to){
            lrcWrap.scrollTop = 0
            let lryObj = await __WEBPACK_IMPORTED_MODULE_1__store_apiProxy__["a" /* default */].lry(to) 
            this.title =  lryObj.title
            /* 歌词单独使用，不托管store */
            this.lryArr = lryObj.lrcContent.split('\n').map(v=>v.split(/\]/g).map((l,i)=>{
                return (i == 0 ? l.replace('[','') :l) /* ["00:00.33","海阔天空"] */
            })).map((v,index)=>{
                /*  有的没有歌词进度信息 */
                if(v.length > 1){
                    v[0] = v[0].split(':').reduce((pre,cur,i)=>{
                        return  (~~pre)*60 + +cur
                    })                        
                }
                return v
            })          
        }
    }       
};



/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
    name:'player',     
    data(){
        return {
            url:null,
            paused:true               
        }
    },
    computed:__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapState"])({
        playingId: state => state.playingId,
        songDetail:  state => state.songDetail
    }),
    methods:
    {
        ended:function(){
            this.$store.dispatch('next')              
        }, 
        pre:function(){
            this.$store.dispatch('pre')  
        },
        next:function(){
            this.$store.dispatch('next')  
        },
        togglePlay:function(){               
          
        },
        timeupdate:function(){
           this.$store.commit('currentTime',player.currentTime)
        },
        outerPlay:function(){ 
         
        },
        listenHearts: function(){
                
        }
    },
    watch:{
        songDetail(to,from){
            if(to.bitrate)  {
                player.src = '/api/song?fileLink=' + to.bitrate['file_link']  
                player.play()
            }
      }
    },
    mounted:function(){
       
    }

};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
    name:'playing-list',             
    methods:{
        changeId:function(ev){
            let el = ev.target               
            if(el.getAttribute("data-id") != null){
                this.$store.dispatch('changeId',el.getAttribute("data-id"))
            }
        },           
        msenter(ev){
            let classList = ev.currentTarget.querySelector('.song-item').classList
            classList.add('show')
            classList.remove('hide')           
        },
        msleave(ev){
            let classList = ev.currentTarget.querySelector('.song-item').classList
            classList.add('hide')
            classList.remove('show')
        },
        removeSong:function(ev){
            let el = ev.target
            if(el.getAttribute('data-id') != null){
               this.$store.commit('removeSong',el.getAttribute('data-id'))
            }
        }
    },
    computed:__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapState"])({
        pid: state=>state.playingId,
        list: state => state.favorites
    }),  

};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ exports["default"] = {
    name: 'search-box',   
    methods: {
        search: async function (ev) {
            this.$store.dispatch('searchAsync', this.keyWords)
            console.log(JSON.stringify(this.$store.state))
        }
    }        
};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
    name:'song',
    props:['song'],
    methods:{
        addSong:function(){
            this.$store.commit('addSong',this.song)
        },
        changeId:function(){
            this.$store.dispatch('changeId',this.song.songid)
        }
    }        
};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Song_vue__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Song_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Song_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vuex__);
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
    name: 'song-list',
    components: {
        Song: __WEBPACK_IMPORTED_MODULE_0__Song_vue___default.a
    },
    computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["mapState"])({
        songs: state => state.result
    }),
    methods: {

    },
    mounted: function (ev) {
        this.$store.dispatch('hotSongs')
    }
};



/***/ },
/* 64 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', [_vm._m(0), _c('div', {
    staticClass: "playingList"
  }, [_c('ul', {
    on: {
      "click": _vm.changeId
    }
  }, _vm._l((_vm.list), function(item) {
    return _c('li', {
      key: item.songid,
      staticClass: "ui-lrc-sentence ui-lrc-prev",
      attrs: {
        "data-id": item.songid
      },
      on: {
        "mouseenter": function($event) {
          $event.stopPropagation();
          _vm.msenter($event)
        },
        "mouseleave": function($event) {
          $event.stopPropagation();
          _vm.msleave($event)
        }
      }
    }, [_c('a', {
      class: ['text', item.songid == _vm.pid ? 'playingItem' : ''],
      attrs: {
        "data-id": item.songid
      }
    }, [_vm._v(_vm._s(item.songname))]), _c('a', {
      class: ['song-item', 'hide'],
      attrs: {
        "data-id": item.songid,
        "href": "javascript:void(0)"
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.removeSong($event)
        }
      }
    }, [_vm._v("x")])])
  }))])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "list list-temp ui-droppable playing",
    attrs: {
      "id": "list_temp"
    }
  }, [_c('a', {
    staticClass: "icon column1-icon list-temp-icon",
    attrs: {
      "hidefocus": "true"
    }
  }), _c('a', {
    staticClass: "text"
  }, [_vm._v("收藏列表")]), _c('a', {
    staticClass: "column1-icon listening-icon listen-icon-playing",
    attrs: {
      "hidefocus": "true"
    }
  })])
}]}

/***/ },
/* 65 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', [_c('search-box'), _c('div', {
    staticClass: "default-main",
    attrs: {
      "id": "mainContent"
    }
  }, [_c('div', {
    staticClass: "main-wrapper"
  }, [_c('div', {
    staticClass: "mb-layout-bd column1",
    attrs: {
      "id": "leftCol"
    }
  }, [_c('div', {
    staticClass: "leftbar-bottom-bg"
  }, [_c('div', {
    staticClass: "leftbar-outer"
  }, [_c('div', {
    staticClass: "leftbar"
  }, [_c('playing-list', {
    attrs: {
      "pid": _vm.playingId
    },
    on: {
      "changePlayId": _vm.changePlayId
    }
  })])])])]), _c('div', {
    staticClass: "mb-layout-bd column2"
  }, [_c('div', {
    staticClass: "tab-main ui-tabs ui-widget ui-widget-content ui-corner-all",
    attrs: {
      "id": "tab"
    }
  }, [_c('div', {
    staticClass: "tab-content cfix"
  }, [_c('song-list', {
    on: {
      "changePlayId": _vm.changePlayId
    }
  })])])]), _c('lry', {
    directives: [{
      name: "ref",
      rawName: "v-ref",
      value: (_vm.lryC),
      expression: "lryC"
    }],
    attrs: {
      "playingId": _vm.playingId,
      "currentTime": _vm.currentTime,
      "songDetails": _vm.songDetails
    }
  })])]), _c('player', {
    attrs: {
      "playingId": _vm.playingId
    },
    on: {
      "toHearts": _vm.toHearts,
      "timeupdate": _vm.updatetime,
      "songDetail": _vm.detail,
      "playNextSong": _vm.nextSong,
      "playPreSong": _vm.preSong
    }
  })])
},staticRenderFns: []}

/***/ },
/* 66 */,
/* 67 */,
/* 68 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "ui-widget-content ui-reelList-row emptyHeart even",
    staticStyle: {
      "top": "0px"
    },
    attrs: {
      "reellist-row": "0"
    }
  }, [_c('div', {
    staticClass: "ui-reelList-cell  c0"
  }, [_vm._m(0), _c('span', {
    staticClass: "listening-icon"
  }), _c('span', {
    staticClass: "similar-icon cur-similar"
  }), _c('span', {
    staticClass: "ui-reelList-songname"
  }, [_c('span', {
    staticClass: "songname-txt"
  }, [_vm._v(_vm._s(_vm.song.songname))])])]), _c('div', {
    staticClass: "ui-reelList-cell  c1"
  }, [_c('a', {
    staticClass: "a-link"
  }, [_vm._v(_vm._s(_vm.song.artistname))])]), _c('div', {
    staticClass: "ui-reelList-cell  c2"
  }, [_vm._v("《"), _c('a', {
    staticClass: "a-link"
  }, [_vm._v(_vm._s(_vm.song.album))]), _vm._v("》")]), _c('div', {
    staticClass: "ui-reelList-cell  c3",
    staticStyle: {
      "width": "auto"
    }
  }, [_c('span', {
    attrs: {
      "data-id": _vm.song.songid
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.addSong($event)
      }
    }
  }, [_vm._v("+")]), _c('span', {
    attrs: {
      "data-id": _vm.song.songid
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.changeId($event)
      }
    }
  }, [_vm._v(">>")])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "ui-reelList-checkbox"
  }, [_c('span')])
}]}

/***/ },
/* 69 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "mb-layout-hd cmb-comm",
    attrs: {
      "alog-alias": "mbox-header",
      "monkey": "mbox-header"
    }
  }, [_c('div', {
    staticClass: "top-banner"
  }, [_c('div', {
    staticStyle: {
      "left": "556px"
    },
    attrs: {
      "id": "searchBar"
    }
  }, [_c('div', {
    attrs: {
      "action": "search"
    }
  }, [_c('span', {
    staticClass: "ui-watermark-container ui-watermark-input"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.keyWords),
      expression: "keyWords"
    }],
    staticClass: "sug-input",
    attrs: {
      "type": "text",
      "placeholder": "输入歌曲、歌手、专辑名",
      "size": "24",
      "autocomplete": "off",
      "name": "key",
      "id": "search-sug-input"
    },
    domProps: {
      "value": _vm._s(_vm.keyWords)
    },
    on: {
      "keyup": function($event) {
        if (_vm._k($event.keyCode, "enter", 13)) { return; }
        _vm.search($event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.keyWords = $event.target.value
      }
    }
  })]), _c('input', {
    attrs: {
      "type": "button",
      "id": "search-sug-submit",
      "value": ""
    },
    on: {
      "click": _vm.search
    }
  }), _vm._m(0)])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "sug-result",
    staticStyle: {
      "display": "none"
    }
  }, [_c('p', {
    staticClass: "sug-source sug-quku"
  }, [_vm._v("曲库搜索")]), _c('dl', {
    staticClass: "sug-artist clearfix"
  }, [_c('dt', {
    staticClass: "sug-title clearfix"
  }, [_vm._v("歌手")])]), _c('dl', {
    staticClass: "sug-song clearfix"
  }, [_c('dt', {
    staticClass: "sug-title clearfix"
  }, [_vm._v("歌曲")])]), _c('dl', {
    staticClass: "sug-album clearfix"
  }, [_c('dt', {
    staticClass: "sug-title clearfix"
  }, [_vm._v("专辑")])])])
}]}

/***/ },
/* 70 */,
/* 71 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "mb-layout-ft minwidth",
    attrs: {
      "onselectstart": "return false;",
      "alog-alias": "mbox-play-ctrl",
      "monkey": "mbox-play-ctrl"
    }
  }, [_c('div', {
    staticClass: "panel",
    attrs: {
      "id": "playPanel"
    }
  }, [_c('div', {
    staticClass: "panel-inner"
  }, [_c('div', {
    staticClass: "left-panel",
    attrs: {
      "id": "leftPanel"
    }
  }, [_c('ul', {
    staticClass: "play-btn"
  }, [_c('li', {
    staticClass: "prev",
    on: {
      "click": _vm.pre
    }
  }, [_vm._m(0)]), _c('li', {
    class: ['play wg-button', _vm.paused ? 'stop' : ''],
    attrs: {
      "title": "暂停"
    },
    on: {
      "click": _vm.outerPlay
    }
  }, [_vm._m(1)]), _c('li', {
    staticClass: "next",
    on: {
      "click": _vm.next
    }
  }, [_vm._m(2)])])]), _c('div', {
    staticClass: "main-panel"
  }, [_c('div', {
    staticClass: "pane"
  }, [_c('audio', {
    attrs: {
      "volume": "-1",
      "id": "player",
      "controls": "",
      "data-id": _vm.playingId
    },
    on: {
      "timeupdate": _vm.timeupdate,
      "ended": _vm.ended,
      "pause": _vm.togglePlay,
      "play": _vm.togglePlay
    }
  })])]), _c('div', {
    staticClass: "right-panel"
  }, [_c('a', {
    staticClass: "switch-fm-btn",
    attrs: {
      "href": "javascript:;",
      "id": "switchFm",
      "title": "随便听听"
    },
    on: {
      "click": _vm.listenHearts
    }
  }, [_c('i', {
    staticClass: "icon-ting"
  }), _c('span', [_vm._v("随心听")])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('a', {
    staticClass: "wg-button",
    attrs: {
      "hidefocus": "true",
      "title": "上一首[←]"
    }
  }, [_c('span', {
    staticClass: "wg-button-inner"
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('span', {
    staticClass: "wg-button-inner"
  }, [_c('a', {
    attrs: {
      "hidefocus": "true"
    }
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('a', {
    staticClass: "wg-button",
    attrs: {
      "hidefocus": "true",
      "title": "下一首[→]"
    }
  }, [_c('span', {
    staticClass: "wg-button-inner"
  })])
}]}

/***/ },
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "tab-page reelList_922366 ui-reelList ui-widget ui-tabs-panel ui-widget-content ui-corner-bottom fullHeartShow list-temp",
    attrs: {
      "id": "page-song"
    }
  }, [_vm._m(0), _c('div', {
    staticClass: "ui-reelList-viewport"
  }, [(_vm.songs.length > 0) ? _c('div', {
    staticClass: "ui-reelList-canvas"
  }, _vm._l((_vm.songs), function(item) {
    return _c('song', {
      key: item.id,
      attrs: {
        "song": item
      },
      on: {
        "changeId": _vm.changeId
      }
    })
  })) : _c('div', {
    staticStyle: {
      "text-align": "center",
      "margin": "20px 0"
    }
  }, [_c('div', {
    staticClass: "text"
  }, [_vm._v("没有数据")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "ui-reelList-header ui-state-default",
    staticStyle: {
      "overflow": "hidden"
    }
  }, [_c('div', {
    staticClass: "ui-reelList-header-column c0",
    staticStyle: {
      "overflow": "hidden"
    }
  }, [_c('div', {
    staticClass: "ui-reelList-checkbox"
  }), _c('div', {
    staticClass: "sort-item",
    attrs: {
      "data-sortkey": "songName"
    }
  }, [_vm._v("歌曲\n                "), _c('span', {
    staticClass: "sort-arrow-icon",
    staticStyle: {
      "display": "inline"
    }
  }), _c('ul', {
    staticClass: "ui-reelList-sort-box",
    staticStyle: {
      "display": "none"
    }
  }, [_c('li', {
    staticClass: "select",
    attrs: {
      "data-sortmethod": "default"
    }
  }, [_vm._v("默认")]), _c('li', {
    attrs: {
      "data-sortmethod": "increase"
    }
  }, [_vm._v("歌曲升序")]), _c('li', {
    attrs: {
      "data-sortmethod": "decrease"
    }
  }, [_vm._v("歌曲降序")])])])]), _c('div', {
    staticClass: "ui-reelList-header-column c1",
    staticStyle: {
      "overflow": "hidden"
    }
  }, [_c('div', {
    staticClass: "sort-item",
    attrs: {
      "data-sortkey": "artistName"
    }
  }, [_vm._v("歌手\n                "), _c('span', {
    staticClass: "sort-arrow-icon",
    staticStyle: {
      "display": "inline"
    }
  }), _c('ul', {
    staticClass: "ui-reelList-sort-box",
    staticStyle: {
      "display": "none"
    }
  }, [_c('li', {
    staticClass: "select",
    attrs: {
      "data-sortmethod": "default"
    }
  }, [_vm._v("默认")]), _c('li', {
    attrs: {
      "data-sortmethod": "increase"
    }
  }, [_vm._v("歌手升序")]), _c('li', {
    attrs: {
      "data-sortmethod": "decrease"
    }
  }, [_vm._v("歌手降序")])])])]), _c('div', {
    staticClass: "ui-reelList-header-column c2",
    staticStyle: {
      "overflow": "hidden"
    }
  }, [_c('div', {
    staticClass: "sort-item",
    attrs: {
      "data-sortkey": "albumName"
    }
  }, [_vm._v("专辑\n                "), _c('span', {
    staticClass: "sort-arrow-icon",
    staticStyle: {
      "display": "inline"
    }
  }), _c('ul', {
    staticClass: "ui-reelList-sort-box",
    staticStyle: {
      "display": "none"
    }
  }, [_c('li', {
    staticClass: "select",
    attrs: {
      "data-sortmethod": "default"
    }
  }, [_vm._v("默认")]), _c('li', {
    attrs: {
      "data-sortmethod": "increase"
    }
  }, [_vm._v("专辑升序")]), _c('li', {
    attrs: {
      "data-sortmethod": "decrease"
    }
  }, [_vm._v("专辑降序")])])])])])
}]}

/***/ },
/* 76 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "mb-layout-bd column3",
    attrs: {
      "id": "lrcCol"
    }
  }, [_c('div', {
    staticClass: "album-wrapper"
  }, [_c('a', {
    staticClass: "log",
    attrs: {
      "target": "_blank",
      "href": ""
    }
  }, [_c('img', {
    attrs: {
      "width": "180",
      "height": "180",
      "src": _vm.songDetails ? _vm.songDetails.songinfo.pic_big : '//mu9.bdstatic.com/player/static/css/image-32/default_album.jpg'
    }
  })]), _c('div', {
    staticClass: "album-name"
  }, [_c('a', {
    staticClass: "log",
    attrs: {
      "target": "_blank",
      "href": "javascript:void(0)"
    }
  }, [_vm._v(_vm._s(_vm.songDetails ? _vm.songDetails.songinfo.author : ''))]), _c('span', {
    staticClass: "icon"
  })])]), _c('div', {
    staticClass: "lrc-wrapper ui-lrc ui-lrc-vertical lrc",
    staticStyle: {
      "bottom": "50px"
    },
    attrs: {
      "id": "lrcWrap"
    }
  }, [((_vm.lryArr || []).length > 0) ? _c('ul', _vm._l((_vm.lryArr), function(item, index) {
    return _c('li', {
      class: _vm.currentIndex == index ? 'light' : '',
      attrs: {
        "item": item,
        "data-index": 'index-' + index
      }
    }, [_vm._v("\n                " + _vm._s(item.length > 1 ? item[1] : item[0]) + "\n            ")])
  })) : _c('div', {
    staticClass: "no-lrc"
  }, [_c('div'), _c('span', {
    staticClass: "no-lrc-hint"
  }, [_vm._v("该歌曲暂时没有歌词"), _c('a', {
    attrs: {
      "href": "javascript:;",
      "id": "requestLrc"
    }
  }, [_vm._v("求歌词")])]), _c('span', {
    staticClass: "send-lrc-request"
  }, [_vm._v("已经告诉ta啦")])])]), _vm._m(0)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "ui-resizable",
    attrs: {
      "id": "lrcResize"
    }
  }, [_c('div', {
    staticClass: "resizable-icon",
    attrs: {
      "id": "widResize"
    }
  })])
}]}

/***/ },
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__App_vue__);




// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_0_vue___default.a.util.extend({ 
    store: __WEBPACK_IMPORTED_MODULE_1__store__["a" /* default */]
}, __WEBPACK_IMPORTED_MODULE_2__App_vue___default.a))

app.$mount('#app')



/***/ }
],[80]);
//# sourceMappingURL=appWithStore.js.map