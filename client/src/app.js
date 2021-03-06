import Vue from 'vue'
import App from './App.vue'

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue(Vue.util.extend({ 
}, App))

app.$mount('#app')

fetch('/api/search/%E6%B5%B7').then(response=>response.json()).then((data)=>console.log(data))
