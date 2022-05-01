import axios from '@/utils/http'
import store from '@/store'


export function fetchPermission(){
    // 路由权限获取(根据登录用户角色)
    return axios.get('permission?role=' + store.state.currentRole)
}

export function login(user){
    // 登录用户角色获取
    return axios.post('login',user)
}

export function getAllUser(){
    return axios.get('users')
}