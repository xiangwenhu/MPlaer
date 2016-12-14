webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(5)

/* template */
var __vue_template__ = __webpack_require__(9)
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
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(6)

/* template */
var __vue_template__ = __webpack_require__(10)
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = {}

/* script */
__vue_exports__ = __webpack_require__(7)

/* template */
var __vue_template__ = __webpack_require__(8)
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Player_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Player_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_Player_vue__);
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



/* harmony default export */ exports["default"] = {
    name:'appp',

    components:{
        SearchBox: __WEBPACK_IMPORTED_MODULE_0__components_SearchBox_vue___default.a,
        Player: __WEBPACK_IMPORTED_MODULE_1__components_Player_vue___default.a
    },
    
    data(){
        return {
            title:'轻量的音乐盒子'
        }
    }
};


/***/ },
/* 6 */
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
//
//
//
//
//
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
    name:'player'
};



/***/ },
/* 7 */
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

/* harmony default export */ exports["default"] = {
  name: 'search-box',  
  data () {
    return {     
    }
  },
  computed: {   
  },
  methods: {   
  }
};


/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
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
    staticClass: "sug-input",
    attrs: {
      "type": "text",
      "placeholder": "输入歌曲、歌手、专辑名",
      "size": "24",
      "autocomplete": "off",
      "name": "key",
      "id": "search-sug-input"
    }
  })]), _c('input', {
    attrs: {
      "type": "submit",
      "id": "search-sug-submit",
      "value": ""
    }
  }), _c('div', {
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
  }, [_vm._v("专辑")])])])])])])])
}]}

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _c('div', [_vm._v("   \n   " + _vm._s(_vm.title) + "\n   "), _c('search-box'), _c('player')])
},staticRenderFns: []}

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._c;
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
    staticClass: "prev"
  }, [_c('a', {
    staticClass: "wg-button",
    attrs: {
      "hidefocus": "true",
      "title": "上一首[←]"
    }
  }, [_c('span', {
    staticClass: "wg-button-inner"
  })])]), _c('li', {
    staticClass: "play wg-button",
    attrs: {
      "title": "暂停"
    }
  }, [_c('span', {
    staticClass: "wg-button-inner"
  }, [_c('a', {
    attrs: {
      "hidefocus": "true"
    }
  })])]), _c('li', {
    staticClass: "next"
  }, [_c('a', {
    staticClass: "wg-button",
    attrs: {
      "hidefocus": "true",
      "title": "下一首[→]"
    }
  }, [_c('span', {
    staticClass: "wg-button-inner"
  })])])])]), _c('div', {
    staticClass: "right-panel"
  }, [_c('div', {
    staticClass: "playmod",
    attrs: {
      "id": "playMode"
    }
  }, [_c('span', {
    staticClass: "list-mode",
    attrs: {
      "title": "顺序播放"
    }
  })]), _c('div', {
    staticClass: "volume",
    attrs: {
      "id": "volumeWrap"
    }
  }, [_c('a', {
    staticClass: "mute wg-button",
    attrs: {
      "hidefocus": "true",
      "title": "静音"
    }
  }, [_c('span', {
    staticClass: "wg-button-inner"
  })]), _c('div', {
    staticClass: "vol-slider-wrapper"
  }, [_c('div', {
    staticClass: "vol-slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all",
    attrs: {
      "id": "volSlider"
    }
  }, [_c('div', {
    staticClass: "ui-slider-range ui-widget-header ui-slider-range-min",
    staticStyle: {
      "width": "86%"
    }
  }, [_c('span', {
    staticClass: "ui-slider-range-inner"
  })]), _c('a', {
    staticClass: "ui-slider-handle ui-state-default ui-corner-all",
    staticStyle: {
      "left": "86%"
    },
    attrs: {
      "hidefocus": "true"
    }
  }, [_c('span')])])])]), _c('div', {
    staticClass: "hq",
    attrs: {
      "id": "hq"
    }
  }, [_c('div', {
    staticClass: "hq-switch",
    attrs: {
      "id": "hqSwitch"
    }
  }, [_c('i', {
    staticClass: "icon vip-gold-new"
  }), _c('span', {
    staticClass: "hq-desc"
  }, [_vm._v("选择音质")])]), _c('div', {
    staticClass: "hq-switch-loading"
  })])]), _c('div', {
    staticClass: "main-panel"
  }, [_c('div', {
    staticClass: "pane"
  }, [_c('audio', {
    attrs: {
      "id": "player",
      "controls": ""
    }
  })])])])]), _c('div', {
    staticClass: "switch-fm-btn-wrapper"
  }, [_c('a', {
    staticClass: "switch-fm-btn",
    attrs: {
      "href": "javascript:;",
      "id": "switchFm",
      "title": "随便听听"
    }
  }, [_c('i', {
    staticClass: "icon-ting"
  }), _c('span', [_vm._v("随心听")])])])])
}]}

/***/ },
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__App_vue__);




// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_0_vue___default.a.util.extend({ 
}, __WEBPACK_IMPORTED_MODULE_1__App_vue___default.a))

app.$mount('#app')

console.log('dsdsdss')

/***/ }
],[12]);
//# sourceMappingURL=app.js.map