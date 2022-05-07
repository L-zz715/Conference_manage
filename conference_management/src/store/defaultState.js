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
    interestOptions: [
        {
          value: "人工智能",
          label: "人工智能",
        },
        {
          value: "物联网",
          label: "物联网",
        },
        {
          value: "大数据",
          label: "大数据",
        },
        {
          value: "信息安全",
          label: "信息安全",
        },
        {
          value: "云计算",
          label: "云计算",
        },
      ],




}