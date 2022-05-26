import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Set from "../views/setting.vue"
import Login from "../views/login.vue"
import NewMap from "../views/map/newMap.vue"
import MapManagement from "../views/map/mapManagement.vue"
import NewScheme from "../views/exercise/newScheme.vue"
import SchemeManagement from "../views/exercise/schemeManagement.vue"
import CurrentExercise from "../views/exercise/currentExercise.vue"
import ExerciseReplay from "../views/exercise/exerciseReplay.vue"
import DeviceTable from "../views/exercise/deviceTable.vue"

Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: "/schemeManagement",
    children:
      [
        // { path: '/setting', component: Set },
        { path: "/newMap", component: NewMap },
        { path: "/mapManagement", component: MapManagement },
        { path: "/newScheme", component: NewScheme },
        { path: "/schemeManagement", component: SchemeManagement },
        { path: "/currentExercise", component: CurrentExercise },
        { path: "/exerciseReplay", component: ExerciseReplay },
        { path: "/deviceTable", component:  DeviceTable},

      ],
  },
]

const router = new VueRouter({
  routes,
})
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from从哪个路径跳转
  // next是一个函数，表示放行
  // next() 放行 next('/login')
  if (to.path === "/login") return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) return next("/login")
  next()
  return null
})
export default router
