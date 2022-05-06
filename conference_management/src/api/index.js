import axios from '@/utils/http'
import store from '@/store'


export function fetchPermission(){
    // 路由权限获取(根据登录用户角色)
    return axios.get('permission?role=' + store.state.currentRole)
}

export function getRoleRights(role){
    return axios.get('permission?role=' + role)
}

export function login(user){
    // 登录用户角色获取
    return axios.post('login',user)
}

export function getUsers(params){
    return axios.get('users',params)
}

export function getAllRoles(){
    return axios.get('roles')
}

export function  getProfile(token){
    const authTok = token
    return axios.get('profile', authTok)
}

export function addUser(userInfo){
    return axios.post('register',userInfo)
}

export function modifyUser(userId,userInfo){
    return axios.put(`users/${userId}`, userInfo)
}

export function searchUser(userId){
    return axios.get(`users/${userId}`)
}

export function deleteUser(userId){
    return axios.delete(`users/${userId}`)
}