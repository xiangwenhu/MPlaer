import Vue from 'vue'
import store from './store'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import router from './router'

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

const app = new Vue(Vue.util.extend({
    router,
    store
}, App))

app.$mount('#app')

