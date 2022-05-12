import axios from '@/utils/http'
import store from '@/store'

// 路由权限获取(根据登录用户角色)
export function fetchPermission() {
    return axios.get('permission?role=' + store.state.currentRole)
}

// 获得选中的角色的权限列表
export function getRoleRights(role) {
    return axios.get('permission?role=' + role)
}

// 登录用户角色获取
export function login(user) {
    return axios.post('login', user)
}

// 根据查询字段获得用户列表
export function getUsers(params) {
    return axios.get('users', params)
}

export function getAllUsers(){
    return axios.get('allusers')
}

export function getAllRoles() {
    return axios.get('roles')
}

// 获得登入用户信息
export function getProfile(token) {
    const authTok = token
    return axios.get('profile', authTok)
}

export function addUser(userInfo) {
    return axios.post('register', userInfo)
}

export function modifyUser(userId, userInfo) {
    return axios.put(`users/${userId}`, userInfo)
}

export function searchUser(userId) {
    return axios.get(`users/${userId}`)
}

export function deleteUser(userId) {
    return axios.delete(`users/${userId}`)
}

// 获得所有会议列表
export function getAllConfers(params) {
    return axios.get('conference',params)
}

// 获得当前用户参与的会议的列表 通过用户名和查询字段对象筛选
export function getAttendConfers(username,params) {
    return axios.get(`conference/${username}`,params)
}

// 获得当前用户参与的会议 只通过用户名
export function getAttConferList(username) {
    return axios.get(`conferences/${username}`)
}

// 创建会议
export function addConference(params){
    return axios.post('conference', params)
}

// 修改会议
export function editConference(conferId,params){
    return axios.put(`conference/${conferId}`,params)
}

// 获取会议 by id
export function searchConference(conferId) {
    return axios.get(`aconference/${conferId}`)
}

// 删除会议 by id
export function deleteConference(conferId){
    return axios.delete(`conference/${conferId}`)

}

// 获取文章 同过查询在所有文章里查找
export function getPapers(params){
    return axios.get('paper',params)
}

// 获取文章 根据作者名
export function getPapersByAuthor(authorName,params){
    return axios.get(`papers/${authorName}`,params)
}

// 获取文章 by id
export function searchPaper(paperId,params) {
    return axios.get(`paper/${paperId}`,params)
}

// 获取需要评论的文章列表
export function reviewPapers(reviewerName,params){
    return axios.get(`rpapers/${reviewerName}`,params)
}

// 添加文字
export function addPaper(conferId,params){
    return axios.post(`paper/${conferId}`,params)
}

// 修改文章
export function editPaper(paperId, params){
    return axios.put(`paper/${paperId}`,params)
}

// 删除文章
export function deletePaper(paperId){
    return axios.delete(`apaper/${paperId}`)
}