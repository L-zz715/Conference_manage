/**
 * 
 * @param {*} userRouter 后台返回的路由权限json
 * @param {*} allRouter 前端配置好的路由权限数据
 * @return {Array} realRoutes 过滤后符合条件的路由
 */

//在使用这个函数的时候从fetchpermission里获得的值 res.data才是个array
 export function recursionRouter(userRouter = [],allRouter = []){
    var realRoutes = [];
    allRouter.forEach((v,i) =>{
        userRouter.forEach((item,index) =>{
            if(item.name === v.meta.name){
                if(item.children && item.children.length > 0){
                    v.children = recursionRouter(item.children,v.children);
                }
                realRoutes.push(v)
            }
        })
    })
    return realRoutes;
}

// 设置默认路由
export function setDefaultRoute(routes){
    routes.forEach((v,i) =>{
        if(v.children && v.children.length > 0){
            v.redirect = { name : v.children[0].name}
            setDefaultRoute(v.children);
        }
    })
}