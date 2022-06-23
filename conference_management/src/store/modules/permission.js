import { fetchPermission, getAllRoles,getProfile } from "@/api/index"
import router, { DynamicRoutes, routes } from "@/router/index"
import allRoutes from "@/router/dynamic-router"
import { recursionRouter, setDefaultRoute } from "@/utils/recursion-router"

export default {
    namespaced: true,
    state: {
        permissionList: null,
        sidebarMenu: [],  // 导航菜单
        currentMenu: 'home',  // 高亮
        selectedMenuName: [],   // 选择的菜单名
        userProfile:null,   // 用户信息
        allRoleList:[],  // 所有角色列表
        roleObjList:null    //角色对象列表（包含角色信息）
    },
    mutations: {
        // 权限
        SET_PERMISSION(state, routes) {
            state.permissionList = routes
        },
        CLEAR_PERMSSION(state) {
            state.permissionList = null
        },
        // 导航菜单
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
        CLEAR_MENU(state) {
            state.sidebarMenu = []
        },
        // 当前菜单项
        SET_CURRENTMENU(state, selectedMenu) {
            state.currentMenu = selectedMenu
        },
        CLEAR_CURRENTMENU(state){
            state.currentMenu = ''
        },
        // 选择的菜单
        SET_SELECTEDMENUNAME(state, selectedMenuNameList) {
            state.selectedMenuName = selectedMenuNameList
        },
        CLEAR_SELECTEDMENUNAME(state){
            state.selectedMenuName = []
        },
        // 用户信息
        SET_USERPROFILE(state,userProfile){
            state.userProfile = userProfile
        },
        CLEAR_USERPROFILE(state){
            state.userProfile = null
        },
        // 所有角色列表
        SET_ALLROLELIST(state,allRoleList){
            state.allRoleList = allRoleList
        },
        SET_ROLEOBJLIST(state,roleObjList){
            state.roleObjList = roleObjList
        }
        
    },
    // 异步访问
    actions: {
        // 设置动态路由和保存用户信息
        async FETCH_PERMISSION({ commit, state }) {
            const permissionList = await fetchPermission();
            // 根据角色和权限筛选菜单
            let newRoutes = recursionRouter(permissionList.data, allRoutes);
            let MainContainer = DynamicRoutes.find(v => v.path === "");

            // 生成菜单
            let children = MainContainer.children;
            children.push(...newRoutes)
            commit("SET_MENU", children);

            // 设置默认路由
            setDefaultRoute([MainContainer]);
            // 初始化路由
            let initialRoutes = router.options.routes;
            // 添加动态路由
            router.addRoutes(DynamicRoutes);
            commit("SET_PERMISSION", [...initialRoutes, ...DynamicRoutes])

            const token =  window.sessionStorage.getItem("token")
            //保存用户信息
            const res2 = await getProfile(token);
            commit("SET_USERPROFILE", res2.data)
        },

        // 获得所有角色列表，保存所有角色名的列表
        async GET_ROLELIST_FROMOBJ({commit, state}){
            const res = await getAllRoles()
            const roleObjList = res.data
            commit("SET_ROLEOBJLIST",roleObjList)
    
            let allRoleList = []
            roleObjList.forEach(item => {
                allRoleList.push(item.rolename)
            });
            commit("SET_ALLROLELIST",allRoleList)
            allRoleList = []
        }

    }
}