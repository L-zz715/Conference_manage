export default{
    LOGIN_IN(state,token){
        state.UserToken = token
    },
    LOGIN_OUT(state){
        state.UserToken = ""
    },
    SET_USERROLELIST(state, roleList){
        state.UserRoleList = roleList
    },
    CLEAR_USERROLELIST(state){
        state.UserRoleList = ""
    },
    SET_CURRENTROLE(state, role){
        state.currentRole = role
    },
    CLEAR_CURRENTROLE(state){
        state.currentRole = ""

    },
    
}