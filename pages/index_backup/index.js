// 语音转文字
var plugin = requirePlugin('WechatSI')
let manager = plugin.getRecordRecognitionManager()
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
        headerHeight: '', //头部高度,
        record64: "",
        isIdentify : false
    },
    //跳转到我的信息
    goMyInfo() {
        wx.navigateTo({
            url: '/pages/myInfo/myInfo',
        })
    },

    record() {
        let _this = this;
        // 启动识别的必要参数设置
        manager.start({ duration: 30000, lang: 'zh_CN' })
        manager.onStart = function (res) {
            console.log('录音状态==', res.msg)
        }

        manager.onError = function (res) {
            console.error('error msg', res.msg)
        }
        // 检测是否有语音并进行识别
        manager.onRecognize = function (res) {
            console.log('current result==', res.result)
            _this.setData({
                record64 : res.result,
                isIdentify : true
            })
            // 识别成功，停止识别
            manager.stop()
        }
        // 录音结束时，再次启动录音
        manager.onStop = function (res) {
            console.log('record file path', res.tempFilePath)
            // 停止识别，获取最后识别的结果
            console.log('result', res.result)
            // 如果识别的内容为空，则不加以其他逻辑处理减少后台交互
            if (res.result !== '') {
                // 如果语音识别内容为空时
                _this.setData({
                    record64: res.result
                })
            }
            // 判断是否需要重启识别
            if (_this.isIdentify) {
                // 启动识别的必要参数设置
                manager.start({ duration: 30000, lang: 'zh_CN' })
            }
        }
    },
    endrecord (){
        
        
    },    
    socket(base64) {
        let apiKey = "c5eb5db6c80d7a41aa326f2258014491";
        let apiSecret = "789b43cf904a2e1064856a36356c548b";
        let host = "host: ws-api.xfyun.cn";
        let date = new Date().toGMTString();
        let request_line = "GET /v2/iat HTTP/1.1";
        let signature_origin = host + "\n" + "date: " + date + "\n" + request_line
        let signature_sha = CryptoJS.HmacSHA256(signature_origin, apiSecret);
        let signature = CryptoJS.enc.Base64.stringify(signature_sha);
        let authorization_orign = 'api_key="' + apiKey + '", algorithm="hmac-sha256", headers="host date request-line", signature="' + signature + '"';
        let authorization = global.Base64.btoa(authorization_orign);

        wx.connectSocket({
            url: 'wss://ws-api.xfyun.cn/v2/iat?authorization=' + authorization + '&date=' + date + '&host=ws-api.xfyun.cn',
            success: function(res_msg) {}
        })

        wx.onSocketOpen(() => {
            wx.sendSocketMessage({
                data: {
                    "common": {
                        "app_id": "5d28320a"
                    },
                    "business": {
                        "language": "zh_cn",
                        "domain": "iat",
                        "accent": "mandarin"
                    },
                    "data": {
                        "status": 1,
                        "format": "audio/L16;rate=16000",
                        "encoding": "raw",
                        "audio": base64
                    }
                },
                success: (res) => {
                    console.log("123")
                    console.log(res);
                }
            })
        })

        wx.onSocketMessage((res) => {
            console.log("1");
            console.log(res);
        })

        wx.onSocketError((res) => {
            console.log(res);
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        that.setData({
            headerHeight: wx.getStorageSync("headerHeight")
        })
        wx.authorize({
            scope: 'scope.record',
            success : function(){

            }
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