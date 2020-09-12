import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入样式表
import '@/assets/css/global.css'
// 导入字体图标
// import '@/assets/fonts/iconfont.css'
// 导入icons文件，以使用svg-icon
import './icons'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
