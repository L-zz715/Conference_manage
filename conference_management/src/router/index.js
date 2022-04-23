import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/pages/Login'
import Home from '@/pages/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',

  },
  {
    path: '/login',
    name: 'login',
    component: Login,

  },
  {
    path: '/home',
    name: 'Home',
    component: Home,

  },


]

const router = new VueRouter({
  routes
})

export default router
