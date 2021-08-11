import Vue from "vue"
import App from "./App.vue"
import "./plugins/element.js"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/css/global.css"
import axios from "axios"
import { HappyScroll } from "vue-happy-scroll"
import Qs from "qs"
// 导入nprogress包
import Nprogress from "nprogress"
import {
  basePort, baseURL, wsPath, fullBaseURL,
} from "./globle.js"
import router from "./router"
import "nprogress/nprogress.css"
// 引入css
import "vue-happy-scroll/docs/happy-scroll.css"

axios.defaults.baseURL = `http://${baseURL}:${basePort}/`
// 在reques拦截器中展示进度条
axios.interceptors.request.use((config) => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem("token")
  // 在最后必须return config
  return config
})
// 在response拦截器中隐藏进度条
axios.interceptors.response.use((config) => {
  Nprogress.done()
  return config
})
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$qs = Qs
// Vue.prototype.$md5 = md5
Vue.filter("dateFormat", (originVal) => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (`${dt.getMonth() + 1}`).padStart(2, "0")
  const d = (`${dt.getDate()}`).padStart(2, "0")
  const hh = (`${dt.getHours()}`).padStart(2, "0")
  const mm = (`${dt.getMinutes()}`).padStart(2, "0")
  const ss = (`${dt.getSeconds()}`).padStart(2, "0")
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 自定义组件名
Vue.component("happy-scroll", HappyScroll)

new Vue({
  // @ts-ignore
  router,
  render: (h) => h(App),
}).$mount("#app")
