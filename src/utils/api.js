import { request, requestAuth, requestFormData } from './axios.js'

//login
export const login = (name, password) => {
    return request('post', 'user/login', {
        name,
        password
    })
}
//register
export const register = (name, password, gameName) => {
    return request('post', 'user/register', {
        name,
        password,
        gameName
    })
}
//logout
export const logout = () => {
    return requestAuth('post', 'user/logout')
}


export const hashVerify = (hash,type) => {
    return requestAuth('post', 'user/hashVerification', {
        hash,
        type
    })
}
//customModel
export const customModel = (file) => {
    return requestFormData('post', 'ysm/customModel', file)
}
//authModel
export const authModel = (file) => {
    return requestFormData('post', 'ysm/auth', file)
}