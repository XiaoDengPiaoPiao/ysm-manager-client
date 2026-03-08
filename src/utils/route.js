import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../page/Login.vue'
import Register from '../page/Register.vue'
import Home from '../page/Home.vue'
import List from '../page/List.vue'
import User from '../page/User.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/list',
        name: 'List',
        component: List,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/user',
        name: 'User',
        component: User,
        meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 检查路由是否需要认证
    if (to.meta.requiresAuth) {
        // 检查是否有token
        const token = localStorage.getItem('token')
        if (token) {
            next()
        } else {
            // 没有token，跳转到登录页面
            next('/login')
        }
    } else {
        next()
    }
})

export default router