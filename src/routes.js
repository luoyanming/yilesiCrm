import login from './views/login.vue'
import layout from './views/layout.vue'
import orderList from './views/orderList.vue'
import courseList from './views/courseList.vue'
import courseCreate from './views/courseCreate.vue'
import courseDetail from './views/courseDetail.vue'

let routes = [
    {
        path: '/',
        component: login,
        name: '易乐思后台管理系统'
    },
    {
        path: '/login',
        component: login,
        name: '登录'
    },
    {
        path: '/',
        component: layout,
        name: '课程上传',
        children: [
            {
                path: '/course',
                component: courseList,
                name: '课程列表',
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/course/create',
                component: courseCreate,
                name: '课程新增',
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail',
                component: courseDetail,
                name: '课程详情',
                meta: {
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/',
        component: layout,
        name: '订单管理',
        children: [
            {
                path: '/order',
                component: orderList,
                name: '订单列表',
                meta: {
                    requiresAuth: true
                }
            }
        ]
    }
];

export default routes;