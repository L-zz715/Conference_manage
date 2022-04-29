export default {
    get UserToken(){
        // 获取存储到本地的token
        return localStorage.getItem('token')
    },
    set UserToken(value){
        // 往本地存储token
        localStorage.setItem('token', value)
    }
}