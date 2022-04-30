import axios from '@/utils/http'
import store from '@/store'


export function fetchPermission(){
    // 路由权限获取(根据登录用户角色)
    const role = axios.get('permission?role=' + store.state.currentRole)
    console.log(role)
    return role
}

export function login(user){
    // 登录用户角色获取
    return axios.post('login',user)
}

export function getAllUser(){
    const res = axios.get('users')
    console.log(res)
    return axios.get('users')
}