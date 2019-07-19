// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCookies from 'vue-cookies'
import Vuex from 'vuex'

import filters from '@/filter/filter'
import api from '@/request/api'
import until from '../until/until'
import store from './vuex/store'

Vue.use(ElementUI);
Vue.use(VueCookies)
Vue.use(until);
Vue.use(Vuex)
let Base64 = require('js-base64').Base64;
Vue.prototype.$ajax = axios
Vue.prototype.$api = api
//全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})


const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : "http://ap.zhuniu.com"

// 根据 process.env.NODE_ENV 的值判断当前是什么环境
const instance = axios.create({
  baseURL: host
})
Vue.prototype.$http = instance


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
