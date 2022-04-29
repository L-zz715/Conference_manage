import axios from '@/utils/http'
import store from '@/store'

// export function fetchPermission(){
//     // 路由权限获取
//     return axios.get('/api/permission?user=' + store.state.UserToken)
// }

// export function login(user){
//     // 登录用户角色获取 传参user是登录的角色：admin  vip等
//     return axios.get('/api/login?user=' + user)
// }

export function register(user){
    return axios.post('/api/register', user)
}

export function login(user){
    return axios.post('/api/users',user)
}

export function getAllUser(){
    return axios.get('/api/users')
}