import {
    wxLogin,
    wxRequestPost,
    showToast
} from "./assets/js/unit.js"
import {
    setStorageSync,
    navigateTo,
	removeStorageSync
} from "./assets/js/common.js"
import apiUrl from "./assets/js/api.js"
const {
    login: loginUrl
} = apiUrl;


App({
    onLaunch: function() {
        let that = this;
		removeStorageSync("userInfo")
        //判断是不是刘海屏123123123123
        try {
            const res = wx.getSystemInfoSync()

            let statusBar = res.statusBarHeight //状态栏高度
            let custom = wx.getMenuButtonBoundingClientRect(); //菜单按钮
            let customBar = custom.bottom + custom.top - statusBar

            wx.setStorageSync("headerHeight", customBar)
            wx.setStorageSync("headerBottom", custom.top + 5)
            wx.setStorageSync("screenHeight", res.windowHeight)

			// 获取用户信息
			wx.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						wxLogin().then((resLogin) => {
							wx.getUserInfo({
								success(resDetail) {
									let detail = resDetail.userInfo;
									let dataJson = {
										code: resLogin.code,
										avatarUrl: detail.avatarUrl,
										nickName: detail.nickName,
										gender: detail.gender,
										encryptedData: resDetail.encryptedData,
										iv: resDetail.iv,
									}
									wxRequestPost(loginUrl, dataJson).then((res) => {
										setStorageSync("userId", res);
										that.globalData.userInfo = detail
									}).catch((res) => {
										showToast(res);
									})
								},
							})
						})
					} else {
						navigateTo('/pages/myInfo/myInfo')
					}
				}
			})

        } catch (e) {
            console.log(e)
        }
	},
	onShow: function(){
		let that = this;
        
    },
	onHide: function(){
		console.log(123);
	},
    globalData: {
        userInfo: "",
        mapKey: 'DHVBZ-6B6R6-AZXSK-MU5LU-JKE76-YMBEO'
    }
})