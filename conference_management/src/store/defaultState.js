export default {
    get UserToken(){
        // 获取存储到本地的token
        return sessionStorage.getItem('token')
    },
    set UserToken(value){
        // 往本地存储token
        sessionStorage.setItem('token', value)
    },
    get UserRoleList(){
        return sessionStorage.getItem('roles')
    },
    set UserRoleList(value){
        sessionStorage.setItem('roles', value)

    },
    currentRole:'',




}