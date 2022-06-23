export default{
    LOGIN_IN(state,token){
        state.UserToken = token
    },
    LOGIN_OUT(state){
        state.UserToken = ""
    },
    // 设置用户角色列表
    SET_USERROLELIST(state, roleList){
        state.UserRoleList = roleList
    },
    // 清除用户角色列表
    CLEAR_USERROLELIST(state){
        state.UserRoleList = ""
    },
    // 设置当前用户角色
    SET_CURRENTROLE(state, role){
        state.currentRole = role
    },
    // 清除当前用户角色
    CLEAR_CURRENTROLE(state){
        state.currentRole = ""

    },

    
}