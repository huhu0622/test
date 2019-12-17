import {
    getStorageSync
} from "./common.js";

import apiUrl from "./api.js"
const {
    imageRecognition: imageRecognitionUrl
} = apiUrl

const wxLogin = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res) {
                resolve(res);
            },
            fail(err) {
                reject(err);
            }
        })
    })
}
const wxRequest = (url, method, data) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            method: method,
            data: data,
            header: {
                Authorization: getStorageSync("userId")
            },
            success: function(res) {
                if (res.data.Rs == 1) {
                    resolve(res.data.Obj);
                } else if (res.data.Rs == 0) {
                    reject("请检查网络连接!");
                } else {
                    reject(res.data.Message)
                }
            },
            fail: function(res) {
                console.log(res);
                reject(res);
            }
        })
    })
}
const wxRequestGet = (url, data) => {
    return wxRequest(url, "get", data)
}
const wxRequestPost = (url, data) => {
    return wxRequest(url, "post", data)
}
const wxChooseMessageFile = (count = 1) => {
    return new Promise((resolve, reject) => {
        wx.chooseMessageFile({
            count: count,
            type: "file",
            success: function(res) {
                resolve(res)
            },
            fail: function(res) {
                reject(res)
            }
        });
    });
}
const wxUploadFile = (tempFilePath) => {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: imageRecognitionUrl,
            filePath: tempFilePath,
            name: 'upFile',
            header: {
                Authorization: getStorageSync("userId")
            },
            formData: {
                'user': 'test'
            },
            success: function(res) {
                const data = res.data
                resolve(JSON.parse(data).Obj)
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}
const showToast = (content = "操作成功", duration = 1500, icon = "none", image = "") => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: content,
            icon: icon,
            image: image,
            duration: duration,
            mask: true,
            success: function(res) {
                setTimeout(()=>{
                    resolve(res)
                }, duration)
            },
            fail: function(res) {
                reject(res)
            },
            complete: function(res) {},
        })
    })
}
const showLoading = (title = "加载中") => {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: title,
            mask: true,
            success: function(res) {
                resolve(res)
            },
            fail: function(res) {
                reject(res)
            },
            complete: function(res) {},
        })
    })
}
const hideLoading = () => {
    wx.hideLoading();
}
// 是否授权用户信息
const isAuthorize = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (res.authSetting["scope.userInfo"]) {
                    resolve(true)
                } else {
                    reject(false)
                }
            }
        })
    })
}

module.exports = {
    wxLogin,
    wxRequest,
    wxRequestGet,
    wxRequestPost,
    wxChooseMessageFile,
    wxUploadFile,
    showToast,
    showLoading,
    hideLoading,
    isAuthorize,
}