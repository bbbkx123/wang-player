import Vue from 'vue'
import App from './App.vue'
import router from './router'
import components from './components'
import store from './store'
import conf from './config.js'
import axios from 'axios'
import './assets/fonts/iconfont.css'
import './base/css/reset.css'

axios.defaults.baseURL = conf.baseURL
// 跨域请求 需要打开, 否则 可能会因为没带上 cookie 导致 301
axios.defaults.withCredentials = true
Vue.config.productionTip = false

Vue.use(components)

Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
