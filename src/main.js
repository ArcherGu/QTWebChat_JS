import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Bridge } from './plugins';

//Webchannel的初始化
var init = _ => {
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');
}

export const JsClient = new Bridge("context", init);