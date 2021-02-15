import Vue from 'vue'
import App from './App.vue'
import router from './router'
import components from './components'
import store from './store'
// import axios from 'util/http'

import './assets/fonts/iconfont.css'
import './base/css/reset.css'

Vue.config.productionTip = false
Vue.use(components)

// Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
