import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './router/permission'
import '@/assets/css/global.css'
import './plugins/element.js'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

// 将富文本编辑器注册为可用的组件
Vue.use(VueQuillEditor /* { default global options } */)

// 定义全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  // 解决时差问题
  dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#app')
