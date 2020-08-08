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


import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '0MvboKicpgvRxkovSB79pymHfGgg3v2z'
})

Vue.prototype.$http = request

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
