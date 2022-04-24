import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Users from '@/pages/user/Users'

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
    children:[
      {
        path: '/users',
        name: 'Users',
        component: Users,
    
      },
    ]
  },


]

const router = new VueRouter({
  routes
})

export default router
