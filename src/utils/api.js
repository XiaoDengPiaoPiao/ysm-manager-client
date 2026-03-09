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
    return requestAuth('post', 'ysm/hashVerification', {
        hash,
        type
    })
}
//customModel
export const customModel = (file) => {
    return requestFormData('post', 'ysm/custom', file)
}
//authModel
export const authModel = (file) => {
    return requestFormData('post', 'ysm/auth', file)
}
//authModelList
export const getAuthModel = () => {
    return requestAuth('get', 'user/models/auth')
}


//customModelList
export const getCustomModel = () => {
    return requestAuth('get', 'user/models/custom')
}
//authModelList
export const getAuthModelList = () => {
    return requestAuth('get', 'user/models/auth')
}
//allModelList
export const getAllModel = () => {
    return requestAuth('get', 'user/models/all')
}

//authorizeModel
export const authorizeModel = (id) => {
    return requestAuth('post', `ysm/auth/${id}`)
}
//deauthorizeModel
export const deauthorizeModel = (id) => {
    return requestAuth('post', `ysm/deauth/${id}`)
}
//deleteAuthModel
export const deleteAuthModel = (id) => {
    return requestAuth('delete', `ysm/auth/${id}`)
}
//userinfo
export const getUserInfo = () => {
    return requestAuth('get', 'user/info')
}
//updateGameName
export const updateGameName = (gameName) => {
    return requestAuth('post', 'user/updateGameName', {
        gameName
    })
}
//resetPassword
export const resetPassword = (username, adminSecretKey) => {
    return request('post', 'admin/resetPassword', {
        username,
        adminSecretKey
    })
}
//user/changePassword
export const changePassword = (oldPassword, newPassword) => {
    return requestAuth('post', 'user/changePassword', {
        oldPassword,
        newPassword
    })
}

export const getModelByFileName = (fileName, adminSecretKey) => {
    return request('post', `admin/getmodel`, {
        fileName,
        adminSecretKey
    })
}
export const deleteModel = (id, adminSecretKey) => {
    return request('delete', `admin/delmodel/${id}`, {
        adminSecretKey
    })
}