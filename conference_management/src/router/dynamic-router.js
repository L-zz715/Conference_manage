/* 用户管理 */
const User = () => import('@/pages/user-manage')
const UserList = () => import('@/pages/user-manage/user-list')
/* 角色管理 */
const Role = () => import('@/pages/role-manage')
const RoleList = () => import('@/pages/role-manage/role-list')
/* 会议管理 */
const Conference = () => import('@/pages/conference-manage')
const ConferenceList = () => import('@/pages/conference-manage/conference-list')
/* 文章管理 */
const Paper = () => import('@/pages/paper-manage')
const PaperList = () => import('@/pages/paper-manage/paper-list')
const PaperSubmit = () => import('@/pages/paper-manage/paper-submit')
const ReviewAssign = () => import('@/pages/paper-manage/review-assign')
const ReviewSubmit = () => import('@/pages/paper-manage/review-submit')

/* 需要权限判断的所有路由 */
const allRoutes = [
    {
        path:'/user',
        component: User,
        name:'user-manage',
        meta: {
            name:'用户管理',
            icon: 'icon-service'
        },
        children:[
            {
                path:'list',
                component: UserList,
                name:'user-list',
                meta: {
                    name:'用户列表',
                    icon: 'icon-service'
                },
            }
        ]
    },
    {
        path:'/role',
        component: Role,
        name:'role-manage',
        meta: {
            name:'角色管理',
            icon: 'icon-service'
        },
        children:[
            {
                path:'list',
                component: RoleList,
                name:'role-list',
                meta: {
                    name:'角色列表',
                    icon: 'icon-service'
                },
            }
        ]
    },
    {
        path:'/conference',
        component: Conference,
        name:'conference-manage',
        meta: {
            name:'会议管理',
            icon: 'icon-service'
        },
        children:[
            {
                path:'list',
                component: ConferenceList,
                name:'conference-list',
                meta: {
                    name:'会议列表',
                    icon: 'icon-service'
                },
            }
        ]
    },
    {
        path:'/paper',
        component: Paper,
        name:'paper-manage',
        meta: {
            name:'文章管理',
            icon: 'icon-service'
        },
        children:[
            {
                path:'list',
                component: PaperList,
                name:'paper-list',
                meta: {
                    name:'文章列表',
                    icon: 'icon-service'
                },
            },
            {
                path:'paperSubmit',
                component: PaperSubmit,
                name:'paper-submit',
                meta: {
                    name:'提交文章',
                    icon: 'icon-service'
                },
            },
            {
                path:'reviewAssign',
                component: ReviewAssign,
                name:'paper-review-assign',
                meta: {
                    name:'审核分配',
                    icon: 'icon-service'
                },
            },
            {
                path:'reviewSubmit',
                component: ReviewSubmit,
                name:'paper-review-submit',
                meta: {
                    name:'审核文章',
                    icon: 'icon-service'
                },
            }
        ]
    },
]

export default allRoutes
