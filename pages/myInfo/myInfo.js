const app = getApp();
import {
    wxRequestPost,
    wxLogin,
    showToast,
    showLoading,
    hideLoading
} from "../../assets/js/unit.js"
import {
    setStorageSync,
	getStorageSync
} from "../../assets/js/common.js"
import apiUrl from "../../assets/js/api.js"
const {
    login: loginUrl,
    userInfo: userInfoUrl
} = apiUrl;


Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        userPlatformData: "",
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
    },
    //返回
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 获取用户数据
    getUserInfo(resDetail) {
        if (resDetail.detail.userInfo) {
            let detail = resDetail.detail.userInfo;
            showLoading();
            wxLogin().then((resLogin) => {
                let dataJson = {
                    code: resLogin.code,
                    avatarUrl: detail.avatarUrl,
                    nickName: detail.nickName,
                    gender: detail.gender,
                    encryptedData: resDetail.encryptedData,
                    iv: resDetail.iv,
                }
                wxRequestPost(loginUrl, dataJson).then((res) => {
                    hideLoading();
                    showToast("登录成功").then(() => {
                        setStorageSync("userId", res);
						setStorageSync("userInfo", detail);
                        this.getPlatformData();
                        this.setData({
                            userInfo: detail
                        }) 
                        console.log(this.data.userInfo);                       
                    })
                }).catch((res) => {
                    showToast(res)
                })
            }).catch((res) => {
                showToast(res)
            })
        }
    },
    // 获取用户平台数据
    getPlatformData() {
        let dataJson = {};
        // showLoading();
        wxRequestPost(userInfoUrl, dataJson).then((res) => {
            // hideLoading();
            let _res = JSON.parse(res);
            this.setData({
                userPlatformData: _res
            })
        }).catch((res) => {
            showToast(res);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            headerHeight: wx.getStorageSync("headerHeight"),
            headerBottom: wx.getStorageSync("headerBottom")
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 未登录
        // let that = this;
        // wx.getSetting({
        //     success: res => {
        //         if (res.authSetting['scope.userInfo']) {
        //             wx.getUserInfo({
        //                 success(resDetail) {
        //                     let detail = resDetail.userInfo;
        //                     that.setData({
        //                         userInfo: detail
        //                     })
        //                     that.getPlatformData();
        //                 }
        //             })
        //         }
        //     }
        // })
		this.setData({
			userInfo: app.globalData.userInfo || getStorageSync("userInfo") ? JSON.parse(getStorageSync("userInfo")) : "" || ""
		})
		this.getPlatformData();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    }
})