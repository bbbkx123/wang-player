import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import * as getters from './getters'
// 输出state变化的日志
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 检测是否为生产环境 
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: debug,
  // plugins: debug ? [createLogger()] : []
})
