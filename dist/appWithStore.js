webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

/**
 * vuex v2.1.1
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

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {}
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state
      var getters = this.$store.getters
      if (namespace) {
        var module = this.$store._modulesNamespaceMap[namespace]
        if (!module) {
          warnNamespace('mapState', namespace)
          return
        }
        state = module.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
  })
  return res
})

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {}
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val
    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
})

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {}
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val
    res[key] = function mappedGetter () {
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val))
      }
      return this.$store.getters[val]
    }
  })
  return res
})

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {}
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val
    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    }
  })
  return res
})

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}

function warnNamespace (helper, namespace) {
  console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace))
}

/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); })
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

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime
  this._children = Object.create(null)
  this._rawModule = rawModule
};

var prototypeAccessors$1 = { state: {},namespaced: {} };

prototypeAccessors$1.state.get = function () {
  return this._rawModule.state || {}
};

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key]
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn)
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn)
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn)
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn)
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  var this$1 = this;

  // register root module (Vuex.Store options)
  this.root = new Module(rawRootModule, false)

  // register all nested modules
  if (rawRootModule.modules) {
    forEachValue(rawRootModule.modules, function (rawModule, key) {
      this$1.register([key], rawModule, false)
    })
  }
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root
  return path.reduce(function (namespace, key) {
    module = module.getChild(key)
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update(this.root, rawRootModule)
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  var parent = this.get(path.slice(0, -1))
  var newModule = new Module(rawModule, runtime)
  parent.addChild(path[path.length - 1], newModule)

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime)
    })
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1))
  var key = path[path.length - 1]
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key)
};

function update (targetModule, newModule) {
  // update target module
  targetModule.update(newModule)

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        console.warn(
          "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
          'manual reload is needed'
        )
        return
      }
      update(targetModule.getChild(key), newModule.modules[key])
    }
  }
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
  this._committing = false
  this._actions = Object.create(null)
  this._mutations = Object.create(null)
  this._wrappedGetters = Object.create(null)
  this._modules = new ModuleCollection(options)
  this._modulesNamespaceMap = Object.create(null)
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
  installModule(this, state, [], this._modules.root)

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state)

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); })
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm.$data.state
};

prototypeAccessors.state.set = function (v) {
  assert(false, "Use store.replaceState() to explicit replace store state.")
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

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
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); })

  if (options && options.silent) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    )
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

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
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm.state = state
  })
};

Store.prototype.registerModule = function registerModule (path, rawModule) {
  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
  this._modules.register(path, rawModule)
  installModule(this, this.state, path, this._modules.get(path))
  // reset store to update getters...
  resetStoreVM(this, this.state)
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path] }
  assert(Array.isArray(path), "module path must be a string or an Array.")
    this._modules.unregister(path)
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1))
    Vue.delete(parentState, path[path.length - 1])
  })
  resetStore(this)
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions)
  resetStore(this)
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function resetStore (store) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  store._modulesNamespaceMap = Object.create(null)
  var state = store.state
  // init all modules
  installModule(store, state, [], store._modules.root, true)
  // reset vm
  resetStoreVM(store, state)
}

function resetStoreVM (store, state) {
  var oldVm = store._vm

  // bind store public getters
  store.getters = {}
  var wrappedGetters = store._wrappedGetters
  var computed = {}
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); }
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
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
  var namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (namespace) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1))
    var moduleName = path[path.length - 1]
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state)
    })
  }

  var local = module.context = makeLocalContext(store, namespace)

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, path)
  })

  module.forEachAction(function (action, key) {
    var namespacedType = namespace + key
    registerAction(store, namespacedType, action, local, path)
  })

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local, path)
  })

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}

/**
 * make localized dispatch, commit and getters
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace) {
  var noNamespace = namespace === ''

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options)
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type
        if (!store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type))
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options)
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type
        if (!store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type))
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters object must be gotten lazily
  // because store.getters will be changed by vm update
  Object.defineProperty(local, 'getters', {
    get: noNamespace ? function () { return store.getters; } : function () { return makeLocalGetters(store, namespace); }
  })

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {}

  var splitPos = namespace.length
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos)

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    })
  })

  return gettersProxy
}

function registerMutation (store, type, handler, path) {
  var entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler(getNestedState(store.state, path), payload)
  })
}

function registerAction (store, type, handler, local, path) {
  var entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler({
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: getNestedState(store.state, path),
      rootGetters: store.getters,
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

function registerGetter (store, type, rawGetter, local, path) {
  if (store._wrappedGetters[type]) {
    console.error(("[vuex] duplicate getter key: " + type))
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      getNestedState(store.state, path), // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
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

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }
  return { type: type, payload: payload, options: options }
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
  version: '2.1.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions
}

return index;

})));

/***/ },
/* 6 */,
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Cinema_vue__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Cinema_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Cinema_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Home_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Home_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Home_vue__);



__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router___default.a)





/* harmony default export */ exports["a"] = new __WEBPACK_IMPORTED_MODULE_1_vue_router___default.a({
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        { path: '/cinema', component: __WEBPACK_IMPORTED_MODULE_2__Cinema_vue___default.a },
        { path: '/index', component: __WEBPACK_IMPORTED_MODULE_3__Home_vue___default.a },
        { path: '*', redirect: '/index' }
    ]
});


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apiProxy__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__localCache__ = __webpack_require__(15);




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

let state = Object.assign({}, localCache, __WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].getCache(MPLAYER_PL), {
    playingId: null,
    markedSongs:[],
    playMode:1
})



__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vuex___default.a)

const store = new __WEBPACK_IMPORTED_MODULE_1_vuex___default.a.Store({
    state: state,
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
        /*   */
        async channels({state}) {
            let channels = await __WEBPACK_IMPORTED_MODULE_2__apiProxy__["a" /* default */].channels()
            state.channels = channels.result[0].channellist
        },
        /* 随心听 */
        async toHearts({dispatch, commit, state}) {
            let channel = state.channels[~~(Math.random() * state.channels.length)]
            let hearts = await __WEBPACK_IMPORTED_MODULE_2__apiProxy__["a" /* default */].channelSongs(channel['ch_name'])
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

            __WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].setCache(MPLAYER_PL, state)
        },
        /* 移除收藏的一首歌曲 */
        removeSong(state, id) {
            let index = state.favorites.findIndex(value => value.songid === id)
            if (index >= 0) {
                state.favorites.splice(index, 1)
            }
            __WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].setCache(MPLAYER_PL, state)
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
            __WEBPACK_IMPORTED_MODULE_3__localCache__["a" /* default */].setCache(MPLAYER_PL, state)
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

/* harmony default export */ exports["a"] = store;


/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(33)

/* template */
var __vue_template__ = __webpack_require__(80)
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
/* 12 */,
/* 13 */
/***/ function(module, exports) {

exports.sync = function (store, router) {
  store.registerModule('route', {
    state: {},
    mutations: {
      'router/ROUTE_CHANGED': function (state, to) {
        store.state.route = Object.freeze({
          name: to.name,
          path: to.path,
          hash: to.hash,
          query: to.query,
          params: to.params,
          fullPath: to.fullPath
        })
      }
    }
  })

  var isTimeTraveling = false
  var currentPath

  // sync router on store change
  store.watch(
    function (state) { return state.route },
    function (route) {
      if (route.fullPath === currentPath) {
        return
      }
      isTimeTraveling = true
      currentPath = route.fullPath
      router.push(route)
    },
    { sync: true }
  )

  // sync store on router navigation
  router.afterEach(function (to) {
    if (isTimeTraveling) {
      isTimeTraveling = false
      return
    }
    currentPath = to.fullPath
    store.commit('router/ROUTE_CHANGED', to)
  })
}


/***/ },
/* 14 */,
/* 15 */
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
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".header{background-color:#f60;position:fixed;z-index:999;height:45px;top:0;width:200px;right:0}.header .inner{max-width:\"800px\";box-sizing:\"border-box\";margin:0 auto;padding:15px 5px}.header a{color:hsla(0,0%,100%,.8);line-height:24px;transition:color .15s ease;display:inline-block;vertical-align:middle;font-weight:300;letter-spacing:.075em;margin:0 1em;font-size:15px}.header a:hover{color:#fff}", ""]);

// exports


/***/ },
/* 18 */,
/* 19 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".ui-reelList-header-column{position:relative;display:inline-block;width:26%}.ui-reelList-cell,.ui-reelList-header-column{padding:0}.ui-reelList-row{position:relative}", ""]);

// exports


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".column3{right:5px}.light{color:red;font-size:15px}", ""]);

// exports


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#player{width:100%}.mb-layout-ft{text-align:left}.left-panel{position:absolute;left:0;top:0}.main-panel{width:auto;margin:22px 150px}.right-panel{position:absolute;width:120px;top:22px;right:0}", ""]);

// exports


/***/ },
/* 22 */,
/* 23 */,
/* 24 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".column2{right:280px}", ""]);

// exports


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#searchBar{left:20%!important}", ""]);

// exports


/***/ },
/* 26 */,
/* 27 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "#fm-panel{display:flex;position:relative;flex-flow:column;background:#fff url(//mu6.bdstatic.com/cms/mbox/fm/night.jpg) repeat 0 0}#fm-panel .flex-bottom,#fm-panel .flex-top{flex:1}#fm-panel .flex-middle{flex:2}", ""]);

// exports


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".playingList li{color:rgba(41,79,52,.6);margin:0 0 0 30px}.playingList .text{color:inherit}.playingItem{background-color:rgba(68,141,119,.24)}.playingList .song-item{float:right;position:absolute;right:30px}.hide{display:none}.show{display:\"inline-block\"}", ""]);

// exports


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".ui-reelList-cell{position:relative;display:inline-block;width:26%}", ""]);

// exports


/***/ },
/* 30 */,
/* 31 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".fm-player{position:relative;top:0}.fm-player .fm-play-panel{margin-top:50px}", ""]);

// exports


/***/ },
/* 32 */,
/* 33 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-055f15b5!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
			var newContent = require("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-055f15b5!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 34 */,
/* 35 */
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
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-17b1452d!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./SongList.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-17b1452d!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./SongList.vue");
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
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-19a0326e!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Lry.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-19a0326e!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Lry.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-200fab8a!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Player.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-200fab8a!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Player.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 38 */,
/* 39 */,
/* 40 */
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
		module.hot.accept("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-468d6dfb!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Home.vue", function() {
			var newContent = require("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-468d6dfb!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Home.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-46af0399!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./SearchBox.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-46af0399!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./SearchBox.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 42 */,
/* 43 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-6bfaa20d!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Cinema.vue", function() {
			var newContent = require("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-6bfaa20d!./../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Cinema.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-798ace82!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./PlayingList.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-798ace82!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./PlayingList.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-c9009a22!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Song.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-c9009a22!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Song.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 46 */,
/* 47 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-dbc86b72!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Slide.vue", function() {
			var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.10.0.2@vue-loader/lib/style-rewriter.js?id=data-v-dbc86b72!./../../../node_modules/.10.0.2@vue-loader/lib/selector.js?type=styles&index=0!./Slide.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(43)

/* script */
__vue_exports__ = __webpack_require__(70)

/* template */
var __vue_template__ = __webpack_require__(90)
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
/* 55 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(40)

/* script */
__vue_exports__ = __webpack_require__(71)

/* template */
var __vue_template__ = __webpack_require__(87)
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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(36)

/* script */
__vue_exports__ = __webpack_require__(72)

/* template */
var __vue_template__ = __webpack_require__(83)
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
/* 57 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(37)

/* script */
__vue_exports__ = __webpack_require__(73)

/* template */
var __vue_template__ = __webpack_require__(84)
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
/* 58 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(44)

/* script */
__vue_exports__ = __webpack_require__(74)

/* template */
var __vue_template__ = __webpack_require__(91)
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
/* 59 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(41)

/* script */
__vue_exports__ = __webpack_require__(75)

/* template */
var __vue_template__ = __webpack_require__(88)
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
/* 60 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(47)

/* script */
__vue_exports__ = __webpack_require__(76)

/* template */
var __vue_template__ = __webpack_require__(95)
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
/* 61 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(45)

/* script */
__vue_exports__ = __webpack_require__(77)

/* template */
var __vue_template__ = __webpack_require__(93)
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
/* 62 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* styles */
__webpack_require__(35)

/* script */
__vue_exports__ = __webpack_require__(78)

/* template */
var __vue_template__ = __webpack_require__(82)
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
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Slide_vue__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Slide_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Slide_vue__);
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
    name:'cinima',
    components:{Slide: __WEBPACK_IMPORTED_MODULE_0__components_Slide_vue___default.a},
    methods:{

    }
};





/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Player_vue__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Player_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_Player_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_SongList_vue__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_SongList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_SongList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PlayingList_vue__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PlayingList_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_PlayingList_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Lry_vue__ = __webpack_require__(56);
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
        this.$store.dispatch('channels')         
    }
};


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store_apiProxy__ = __webpack_require__(7);
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
        'playingId',  
        'songDetail'         
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
/* 73 */
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
            this.paused = player.paused  
        },
        timeupdate:function(){
           this.$store.commit('currentTime',player.currentTime)
        },
        outerPlay:function(){ 
            if(!this.playingId){
                return
            }            
            player.paused? player.play():player.pause()
            this.paused = player.paused 
        },
        listenHearts: function(){
            this.$store.dispatch('toHearts')
        }
    },
    watch:{
        songDetail(to,from){
            if(to.bitrate)  {
                setTimeout( ()=>{
                    player.src = '/api/song?fileLink=' + to.bitrate['file_link']  
                    player.play()
                },50)
            }
      }
    },
    mounted:function(){
       
    }

};


/***/ },
/* 74 */
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
        changePlayingId:function(ev){
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
/* 75 */
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
            this.keyWords && this.$store.dispatch('searchAsync', this.keyWords)               
        }
    }        
};


/***/ },
/* 76 */
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
    name:'slide'
};




/***/ },
/* 77 */
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
    props:['song','allChecked'],
    data(){
        return {
            isChecked:false
        }
    },
    methods:{
        addSong:function(){
            this.$store.commit('addSong',this.song)
        },
        changePlayingId:function(){
            this.$store.dispatch('changeId',this.song.songid)
        },
        checkSong:function(){
            this.isChecked = !this.isChecked
            this.$store.commit('markSong',{
                isAdd:this.isChecked,
                song:this.song
            })
        }           
    },
    computed:{
        classList(){
            return 'ui-widget-content ui-reelList-row emptyHeart even ' + (this.isChecked ?  'ui-reelList-checked' :'')
        }
    },
    watch:{
        allChecked(to){
            this.isChecked = this.allChecked
            this.$store.commit('markSong',{
                isAdd:this.isChecked,
                song:this.song
            })
        }
    }              
};


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Song_vue__ = __webpack_require__(61);
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
    data(){
        return{
            allChecked : false              
        }
    },
    components: {
        Song: __WEBPACK_IMPORTED_MODULE_0__Song_vue___default.a
    },
    computed: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["mapState"])({
        songs: state => state.result
    }),
    methods: {
        checkAll:function(){
            this.allChecked = ! this.allChecked
        },
        addSongs:function(){
            this.$store.commit('addSong',this.$store.state.markedSongs)     
            this.allChecked = false           
        }
    },
    mounted: function (ev) {
        this.$store.dispatch('hotSongs')
    }
};



/***/ },
/* 79 */,
/* 80 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', [_c('div', {
    staticClass: "header"
  }, [_c('div', {
    staticClass: "inner"
  }, [_c('router-link', {
    attrs: {
      "to": "/index"
    }
  }, [_vm._v("播放器")]), _c('router-link', {
    attrs: {
      "to": "/cinema"
    }
  }, [_vm._v("影院模式")])])]), _c('transition', {
    attrs: {
      "name": "fade",
      "mode": "out-in"
    }
  }, [_c('router-view')])])
},staticRenderFns: []}

/***/ },
/* 81 */,
/* 82 */
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
      directives: [{
        name: "on",
        rawName: "v-on",
        value: (_vm.markSong),
        expression: "markSong"
      }],
      key: item.id,
      attrs: {
        "song": item,
        "allChecked": _vm.allChecked
      }
    })
  })) : _c('div', {
    staticStyle: {
      "text-align": "center",
      "margin": "20px 0"
    }
  }, [_c('div', {
    staticClass: "text"
  }, [_vm._v("没有数据")])])]), _c('div', {
    staticClass: "ui-reelList-footer"
  }, [_c('div', {
    staticClass: "p-footer",
    staticStyle: {
      "display": "block"
    },
    attrs: {
      "id": "myFooter"
    }
  }, [_c('div', {
    staticClass: "select-all-combo",
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.checkAll($event)
      }
    }
  }, [_c('div', {
    class: ['select-all-checkbox', _vm.allChecked ? 'select-all-checked' : 'select-all-unchecked']
  }, [_c('span')]), _c('div', {
    staticClass: "select-all-text"
  }, [_vm._v("全选")])]), _c('div', {
    staticClass: "playlist-button add-button",
    staticStyle: {
      "display": "block"
    },
    on: {
      "click": _vm.addSongs
    }
  }), _c('div', {
    staticClass: "playlist-button delete-button",
    staticStyle: {
      "display": "block"
    }
  }), _c('div', {
    staticClass: "playlist-length"
  }, [_vm._v("共有"), _c('span', [_vm._v(_vm._s(_vm.songs.length))]), _vm._v("首歌")])])])])
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
/* 83 */
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
      "href": "javascript:void(0)"
    }
  }, [_c('img', {
    attrs: {
      "width": "180",
      "height": "180",
      "src": _vm.songDetail ? _vm.songDetail.songinfo.pic_big : '//mu9.bdstatic.com/player/static/css/image-32/default_album.jpg'
    }
  })]), _c('div', {
    staticClass: "album-name"
  }, [_c('a', {
    staticClass: "log",
    attrs: {
      "target": "_blank",
      "href": "javascript:void(0)"
    }
  }, [_vm._v(_vm._s(_vm.songDetail ? _vm.songDetail.songinfo.author : ''))]), _c('span', {
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
/* 84 */
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
/* 85 */,
/* 86 */,
/* 87 */
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
/* 88 */
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
/* 89 */,
/* 90 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    attrs: {
      "id": "fm-panel"
    }
  }, [_c('div', {
    staticClass: "flex-top"
  }, [_vm._v("top")]), _c('div', {
    staticClass: "flex-middle"
  }, [_vm._m(0), _c('div', [_c('slide')]), _vm._m(1)]), _c('div', {
    staticClass: "flex-bottom"
  }, [_vm._v("bottom")])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', [_c('a', {
    staticClass: "next-page",
    attrs: {
      "href": "javascript:;",
      "title": ""
    }
  }, [_c('i', {
    staticClass: "arrow velocity-animating"
  })])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', [_c('a', {
    staticClass: "next-page",
    attrs: {
      "href": "javascript:;",
      "title": ""
    }
  }, [_c('i', {
    staticClass: "arrow velocity-animating"
  })])])
}]}

/***/ },
/* 91 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', [_vm._m(0), _c('div', {
    staticClass: "playingList"
  }, [_c('ul', {
    on: {
      "click": _vm.changePlayingId
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
/* 92 */,
/* 93 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    class: _vm.classList,
    staticStyle: {
      "top": "0px"
    },
    attrs: {
      "reellist-row": "0"
    }
  }, [_c('div', {
    staticClass: "ui-reelList-cell  c0"
  }, [_c('div', {
    staticClass: "ui-reelList-checkbox",
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.checkSong($event)
      }
    }
  }, [_c('span')]), _c('span', {
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
        _vm.changePlayingId($event)
      }
    }
  }, [_vm._v(">>")])])])
},staticRenderFns: []}

/***/ },
/* 94 */,
/* 95 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', {
    staticClass: "fm-player"
  }, [_c('div', {
    staticClass: "fm-album"
  }, [_c('a', {
    staticClass: "play stop",
    attrs: {
      "href": "javascript:;",
      "target": "_blank",
      "hidefocus": "true",
      "title": "播放[空格键]"
    }
  }, [_c('img', {
    staticStyle: {
      "display": "block"
    },
    attrs: {
      "src": "http://musicdata.baidu.com/data2/pic/89086641/89086641.jpg@s_0,w_300",
      "width": "240",
      "height": "240"
    }
  })]), _c('div', {
    staticClass: "mask",
    staticStyle: {
      "display": "block"
    }
  }), _c('a', {
    staticClass: "mask-text",
    staticStyle: {
      "display": "inline"
    },
    attrs: {
      "href": "javascript:;",
      "title": "播放[空格键]"
    }
  }, [_vm._v("点击继续播放")])]), _c('div', {
    staticClass: "fm-songinfo"
  }, [_c('p', {
    staticClass: "fm-song-title"
  }, [_c('a', {
    attrs: {
      "target": "_blank",
      "title": "力量",
      "href": "http://music.baidu.com/song/13744545?pst=mbox_fm"
    }
  }, [_vm._v("力量")])]), _c('p', {
    staticClass: "fm-artist-name"
  }, [_vm._v("\n            作词："), _c('a', {
    attrs: {
      "target": "_blank",
      "href": ""
    }
  }), _vm._v(" 作曲："), _c('a', {
    attrs: {
      "target": "_blank",
      "href": ""
    }
  })]), _c('p', {
    staticClass: "fm-album-name"
  }, [_vm._v("\n            专辑："), _c('a', {
    attrs: {
      "target": "_blank",
      "title": "《真的很在乎》",
      "href": "http://music.baidu.com/album/13744553?pst=mbox_fm"
    }
  }, [_vm._v("《真的很在乎》")])]), _c('p', {
    staticClass: "fm-artist-name",
    attrs: {
      "target": ""
    }
  }, [_vm._v("\n            演唱："), _c('a', {
    attrs: {
      "target": "_blank",
      "title": "杨坤",
      "href": "http://music.baidu.com/artist/1380?pst=mbox_fm"
    }
  }, [_vm._v("杨坤")])])]), _c('div', {
    staticClass: "fm-play-panel"
  }, [_c('ul', [_c('li', {
    staticClass: "fm-play"
  }, [_c('a', {
    staticClass: "play stop",
    attrs: {
      "href": "javascript:;",
      "title": "播放[空格键]",
      "hidefocus": "true"
    }
  })]), _c('li', {
    staticClass: "fm-next"
  }, [_c('a', {
    attrs: {
      "href": "javascript:;",
      "title": "下一首[→]",
      "hidefocus": "true"
    }
  })]), _c('li', {
    staticClass: "fm-trashcan"
  }, [_c('a', {
    attrs: {
      "href": "javascript:;",
      "title": "垃圾桶",
      "hidefocus": "true"
    }
  })])])])])
}]}

/***/ },
/* 96 */,
/* 97 */,
/* 98 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__App_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex_router_sync__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex_router_sync___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vuex_router_sync__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__router__ = __webpack_require__(8);






// sync the router with the vuex store.
// this registers `store.state.route`
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_vuex_router_sync__["sync"])(__WEBPACK_IMPORTED_MODULE_1__store__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4__router__["a" /* default */])

const app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_0_vue___default.a.util.extend({
    router: __WEBPACK_IMPORTED_MODULE_4__router__["a" /* default */],
    store: __WEBPACK_IMPORTED_MODULE_1__store__["a" /* default */]
}, __WEBPACK_IMPORTED_MODULE_2__App_vue___default.a))

app.$mount('#app')



/***/ }
],[98]);
//# sourceMappingURL=appWithStore.js.map