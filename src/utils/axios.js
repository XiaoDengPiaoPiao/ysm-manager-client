import axios from 'axios'
import { getToken, removeToken } from './auth.js'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 处理401未授权
    if (error.response && error.response.status === 401) {
      // 清除token
      removeToken()
      // 跳转到登录页面
      window.location.href = '#/login'
      return Promise.reject(new Error('登录会话已被销毁，请重新登录'))
    }
    
    if (error.response && error.response.data && error.response.data.message) {
      // 如果服务器返回了message，使用服务器返回的错误信息
      return Promise.reject(new Error(error.response.data.message))
    }
    // 否则使用默认错误信息
    return Promise.reject(error)
  }
)

// 封装axios请求
//无需鉴权
export const request = (method, url, data = {}) => {
    // DATA深拷贝
    data = JSON.parse(JSON.stringify(data))
    return service({
        method,
        url,
        data
    }).then(res => {
        return res.data
    }).catch(err => {
        throw err
    })
}

//需要鉴权
export const requestAuth = (method, url, data = {}) => {
    // 从auth获取token
    const token = getToken()
    if (!token) {
        throw new Error('No token found')
    }
    // DATA深拷贝
    data = JSON.parse(JSON.stringify(data))
    return service({
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method,
        url,
        data
    }).then(res => {
        return res.data
    }).catch(err => {
        throw err
    })
}

//multipart/form-data
export const requestFormData = (method, url, data = null) => {
    // 从auth获取token
    const token = getToken()
    if (!token) {
        throw new Error('No token found')
    }
    return service({
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
        method,
        url,
        data
    }).then(res => {
        return res.data
    }).catch(err => {
        throw err
    })
}
export default {request, requestAuth, requestFormData}