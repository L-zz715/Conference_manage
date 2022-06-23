import router from "./index"
import store from "@/store/index"

router.beforeEach((to, from, next) => {
    // 验证token
    if (!store.state.UserToken) {
        if (to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)) {
            next()
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        if (!store.state.permission.permissionList) {
            // 储存目前用户的角色
            store.commit(
                "SET_CURRENTROLE",
                window.sessionStorage.getItem("currentRole")
            )
            
            // 设置菜单，保存用户信息等
            store.dispatch("permission/FETCH_PERMISSION").then(() => {
                // 储存可能被多次使用的role数据
                store.dispatch("permission/GET_ROLELIST_FROMOBJ")
                next({
                    path: to.path
                })

            })
        } else {
            // store存在权限
            if (to.path !== "/login") {
                next();
            } else {
                next(from.fullPath)
            }
        }
    }
})