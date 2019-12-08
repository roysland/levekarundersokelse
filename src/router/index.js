import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ViewArea from '../views/ViewArea'
import ViewBydel from '../views/ViewBydel'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/area/:area',
    component: ViewArea,
    name: 'ViewArea'
  },
  {
    path: '/:bydel/:area',
    component: ViewArea,
    name: 'ViewBydelArea'
  },
  {
    path: '/:bydel',
    component: ViewBydel,
    name: 'ViewBydel'
  }
]

const router = new VueRouter({
  routes
})

export default router
