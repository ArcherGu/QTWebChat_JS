import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Bridge } from './plugins';
import './plugins/element.js'

export const JsClient = new Bridge("context");

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');