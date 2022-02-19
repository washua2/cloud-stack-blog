import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/animate.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { tokenUrls } from "./tokenUrls/tokenUrls.js"
import * as echarts from 'echarts';




axios.defaults.baseURL = 'http://120.78.192.153:9001';
// 添加请求拦截器
axios.interceptors.request.use(config => {

    // 获取token
    let data = {}
    let keys = ["wyhwyhwyhwyh", "sdijhcnsjd", "dweweqsdwe", "sdqwew", "scnjisddsdads"]

    keys.forEach(v => {
            data[v] = localStorage.getItem(v)
        })
        // 在发送请求之前做些什么
    if (config.method === "post") {
        config.data = config.data || {}
        if (tokenUrls.indexOf(config.url) > -1) {
            config.data = {...config.data, ...data }
        }
    }
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});



Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

Vue.use(ElementUI);
Vue.use(VueAxios, axios)
AOS.init();


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')