import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../page/Login.vue'
import Register from '../page/Register.vue'

const routes = [
    {
        path: '/',
        alias: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router