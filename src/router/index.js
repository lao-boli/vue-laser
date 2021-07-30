import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import(/* webpackChunkName: "group-home" */ '../views/Home.vue')
// import Home from '../views/Home.vue'
const Login = () => import(/* webpackChunkName: "group-home" */ '../views/login.vue')
// const Set = () => import(/* webpackChunkName: "group-home" */ '../views/setting.vue')
// import Set from '../views/setting.vue'
const NewMap = () => import(/* webpackChunkName: "group-map" */ '../views/map/newMap.vue')
// import NewMap from '../views/map/newMap.vue'
const MapManagement = () => import(/* webpackChunkName: "group-map" */ '../views/map/mapManagement.vue')
// import MapManagement from '../views/map/mapManagement.vue'
const NewScheme = () => import(/* webpackChunkName: "group-exercise" */ '../views/exercise/newScheme.vue')
// import NewScheme from '../views/exercise/newScheme.vue'
const SchemeManagement = () => import(/* webpackChunkName: "group-exercise" */ '../views/exercise/schemeManagement.vue')
// import SchemeManagement from '../views/exercise/schemeManagement.vue'
const CurrentExercise = () => import(/* webpackChunkName: "group-exercise" */ '../views/exercise/currentExercise.vue')
// import CurrentExercise from '../views/exercise/currentExercise.vue'
const ExerciseReplay = () => import(/* webpackChunkName: "group-exercise" */ '../views/exercise/exerciseReplay.vue')
// import ExerciseReplay from '../views/exercise/exerciseReplay.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/schemeManagement',
    children:
      [
        // { path: '/setting', component: Set },
        { path: '/newMap', component: NewMap },
        { path: '/mapManagement', component: MapManagement },
        { path: '/newScheme', component: NewScheme },
        { path: '/schemeManagement', component: SchemeManagement },
        { path: '/currentExercise', component: CurrentExercise },
        { path: '/exerciseReplay', component: ExerciseReplay }
      ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from从哪个路径跳转
  // next是一个函数，表示放行
  // next() 放行 next('/login')
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
