import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../page/Login.vue'
import Register from '../page/Register.vue'
import Home from '../page/Home.vue'
import List from '../page/List.vue'
import User from '../page/User.vue'
import ManagerLogin from '../page/ManagerLogin.vue'
import Manager from '../page/Manager.vue'
import { getUsername } from './auth.js'

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
    {
        path: '/managerLogin',
        name: 'ManagerLogin',
        component: ManagerLogin,
        meta: { requiresManager: true }
    },
    {
        path: '/manager',
        name: 'Manager',
        component: Manager,
        meta: { requiresManager: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 检查路由是否需要管理员权限
    if (to.meta.requiresManager) {
        const username = getUsername()
        if (username === 'nullname') {
            next()
        } else {
            next('/')
        }
    }
    // 检查路由是否需要认证
    else if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token')
        if (token) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router