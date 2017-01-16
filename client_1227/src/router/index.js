import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Cinema from '../Cinema.vue'
import Home from '../Home.vue'
import Utils from '../utils'


export default new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        { path: '/cinema', component: Cinema,beforeEnter:(to, from, next)=>{
            Utils.fullScree()
            next()
        } },
        { path: '/index', component: Home },
        { path: '*', redirect: '/index' }
    ]
})
