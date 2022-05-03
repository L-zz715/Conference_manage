import { fetchPermission } from "@/api/index"
import router, { DynamicRoutes, routes } from "@/router/index"
import allRoutes from "@/router/dynamic-router"
import { recursionRouter, setDefaultRoute } from "@/utils/recursion-router"

export default {
    namespaced: true,
    state: {
        permissionList: null,
        sidebarMenu: [],// 导航菜单
        currentMenu: 'home', // 高亮
        selectedMenuName: [],
        userProfile:null
    },
    mutations: {
        SET_PERMISSION(state, routes) {
            state.permissionList = routes
        },
        CLEAR_PERMSSION(state) {
            state.permissionList = null
        },
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
        CLEAR_MENU(state) {
            state.sidebarMenu = []
        },
        SET_CURRENTMENU(state, selectedMenu) {
            state.currentMenu = selectedMenu
        },
        SET_SELECTEDMENUNAME(state, selectedMenuNameList) {
            state.selectedMenuName = selectedMenuNameList
        },
        GET_USERPROFILE(state,userProfile){
            state.userProfile = userProfile
        },
        CLEAR_USERPROFILE(state){
            state.userProfile = null
        }
    },
    // 异步访问
    actions: {
        async FETCH_PERMISSION({ commit, state }) {
           
            let permissionList = await fetchPermission();
            // 筛选
            let newRoutes = recursionRouter(permissionList.data, allRoutes);
            let MainContainer = DynamicRoutes.find(v => v.path === "");

            let children = MainContainer.children;
            children.push(...newRoutes)

            // 生成菜单
            commit("SET_MENU", children);

            // 设置默认路由
            setDefaultRoute([MainContainer]);
            // 初始化路由
            let initialRoutes = router.options.routes;
           
            router.addRoutes(DynamicRoutes);
            commit("SET_PERMISSION", [...initialRoutes, ...DynamicRoutes])
        },

    }
}