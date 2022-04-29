import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/pages/login'
import Home from '@/pages/home'
import NotFound from "@/pages/errorPage/404"
import Forbidden from "@/pages/errorPage/403"
import Layout from '@/pages/layout'

Vue.use(VueRouter)

// 初始化路由
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

// 动态路由
export const DynamicRoutes = [
  {
    path:'',
    component: Layout,
    name:'container',
    // redirect:'home',
    meta:{
      requiresAuth:true,
      name:"首页"
    },
    children:[
      {
        path:'home',
        component:Home,
        name:"home",
        meta:{
          //用name进行匹配规则
          name:"首页",
          icon:"icon-name"  //显示的图标
        }
      }
    ]
  },
  {
    path:'/403',
    component:Forbidden
  },
  {
    path:'*',
    component:NotFound
  }
]

const router = new VueRouter({
  routes
})

export default router
