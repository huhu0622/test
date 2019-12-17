import {
    wxUploadFile,
    showToast,
    showLoading,
    hideLoading
} from "../../assets/js/unit.js"

import {
    navigateTo,
    setStorageSync
} from "../../assets/js/common.js"


Page({
    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        bodyHeight: '', //内容高度
    },
    //返回
    goBack() {
      wx.navigateBack({
        delta:1
      })
    },
    takePhoto() {
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
			quality: 'low',
            success: (res) => {
                let src = res.tempImagePath;
                showLoading();
                wxUploadFile(src).then((res)=>{
                    hideLoading();
                    let data = JSON.parse(res);
                    console.log(data);
                    setStorageSync( "objInfo", data );
                    navigateTo("/pages/photoResult/index");
                }).catch((res)=>{
                    hideLoading();
                    showToast(res)
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        that.setData({
            headerHeight: wx.getStorageSync("headerHeight"),
            headerBottom: wx.getStorageSync("headerBottom"),
            bodyHeight: wx.getStorageSync("screenHeight") - wx.getStorageSync("headerHeight"),
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})