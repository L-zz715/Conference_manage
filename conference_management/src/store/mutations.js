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
    GET_USERROLELIST(state){
        state.UserRoleList = ""
    }
    
}