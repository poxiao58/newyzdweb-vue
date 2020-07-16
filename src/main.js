import 'babel-polyfill'
import Vue from 'vue'

import '../theme/index.css'
import ElementUI from 'element-ui'

import '@/styles/index.scss'

import App from './App'
import router from './router'
import store from './store'

import '@/icons'
import '@/permission'

import request from './utils/request'
Vue.prototype.$http = request

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
