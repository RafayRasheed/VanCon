const { storage } = require("../common")

const saveLogin = 'login'
const saveFirstTime = 'isFirstTime'
const saveCart = 'saveCart'
const lastNoti = 'lastNotificationId'

export function firstTime() {
    storage.set(saveFirstTime, true)
}

export function containFirstTime() {
    return storage.getBoolean(saveFirstTime)
}

export function setLastNotificationId(id) {
    storage.set(lastNoti, id)
}

export function getLastNotificationId() {
    if (containCommonStorage(lastNoti)) {

        return (storage.getString(lastNoti))
    }
}
// Login
export function containLogin() {
    return storage.contains(saveLogin)
}
export function setLogin(profile) {
    storage.set(saveLogin, JSON.stringify(profile))
    return containLogin()
}

export function getLogin() {
    if (containLogin()) {

        return JSON.parse(storage.getString(saveLogin))
    } else {

        return {}
    }
}

export function deleteLogin() {
    storage.delete(saveLogin)
    return containLogin()
}



export function containCommonStorage(key) {
    return storage.contains(key)
}
export function deleteCommonStorage(key) {
    console.log('delete Successfull local strorage', key)

    storage.delete(key)
    return
}
export function getCommonStorage(key, empty, datatype = 'string') {
    if (containCommonStorage(key)) {
        console.log('get Successfull local strorage', key, datatype)
        if (datatype == 'int') {
            return storage.getNumber(key)
        }
        return JSON.parse(storage.getString(key))
    }
    else {
        console.log('not in local strorage', key)

    }
    return empty
}
export function setCommonStorage(key, Data, datatype = 'string') {
    storage.set(key, datatype == 'int' ? Data : JSON.stringify(Data))
    console.log('set Successfull local strorage', key, datatype)

    return
}




// Cart
export function setCartLocal(cart) {
    storage.set(saveCart, JSON.stringify(cart))
}
export function getCartLocal() {
    const s = storage.getString(saveCart)
    if (s) {
        return JSON.parse(s)
    }
    return []
}