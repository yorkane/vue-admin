import Vue from 'vue'
// import 'element-ui/lib/theme-chalk/index.css' //load from external cdn file
// import '@/elemeui_import'
import ElementUI from 'element-ui';
// import lang from 'element-ui/lib/locale/lang/zh-CN'
// import locale from 'element-ui/lib/locale'
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限


// 设置语言
// locale.use(lang)

Vue.config.productionTip = false

window._$store = store
// Vue.use(ElementUI);
let app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

window._app = app
export {app, router, store}
