import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import { Message, MessageBox, Notification, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
import './assets/css/iconfont.css'
import config from './assets/js/config'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 解析并展示markdown内容
import MarkdownPreview from 'vue-meditor'
import VueCalendarHeatmap from 'vue-calendar-heatmap'
import dayjs from 'dayjs'
import VueAliplayerV2 from "vue-aliplayer-v2";
import TagCloud from 'TagCloud'

Vue.config.productionTip = false
Vue.prototype.config = config
Vue.use(mavonEditor)
Vue.use(MarkdownPreview)
Vue.use(ElementUI)
Vue.use(TagCloud)
Vue.use(VueCalendarHeatmap)
Vue.use(VueAxios, axios)
Vue.use(VueAliplayerV2);
Vue.component('v-chart', ECharts)
Vue.prototype.$moment = dayjs
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.filter('date', function (value, formatStr = 'YYYY-MM-DD') {
  return dayjs(value).format(formatStr)
})

Vue.filter('dateTime', function (value, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(value).format(formatStr)
})

NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
})

// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   if (to.path == '/login') {
//     next()
//   } else if (!store.state.userInfo) {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })

// router.afterEach(() => {
//   NProgress.done()
// })

axios.defaults.baseURL = '/api/'
axios.interceptors.request.use((config) => {
  config.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(
  (response) => {
    switch (response.data.code) {
      case 40001:
        Vue.prototype.$message({
          type: 'error',
          message: response.data.message
        })
        router.push({ path: '/login' })
        break
      case 50000:
        Vue.prototype.$message({
          type: 'error',
          message: response.data.message
        })
        break
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)


new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
