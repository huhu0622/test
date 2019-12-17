// 语音转文字
var plugin = requirePlugin('WechatSI')
let manager = plugin.getRecordRecognitionManager()

import {
    wxRequestPost,
    showToast,
    showLoading,
    hideLoading
} from "../../assets/js/unit.js"

import {
    navigateTo,
    setStorageSync
} from "../../assets/js/common.js"
import apiUrl from "../../assets/js/api.js"
const {
    getTrashByName: getTrashByNameUrl,
    getWasteTypeList: getWasteTypeListUrl,
    correct: correctUrl
} = apiUrl


Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        showSelectBox: false,
        searchKey: "",
        searchResult: "",
        wasteList : "",
        radioResult: "",
        typeId: "",
        isIdentify : false,
        imgSrc:{
          "kehuishou":"../../assets/images/svg/kehuishou.svg",
          "qita":"../../assets/images/svg/qita_white.svg",
          "chuyu": "../../assets/images/svg/chuyu_white.svg",
          "youhai": "../../assets/images/svg/youhai_white.svg"
        },
        icon: {
          active: "../../assets/images/png/selected_circle.png",
          normal: "../../assets/images/png/default_circle.png"
        },
        changeMovePic:false
    },
    //返回
    goBack() {
      wx.navigateBack({
        delta:1
      })
    },
    goCorrection() {
        this.setData({
            showSelectBox: true
        })
    },
    changeText(e) {
        this.setData({
            searchKey: e.detail.value
        })
    },
    // 选择垃圾分类
    selectType(ev) {
      this.setData({
        TypeId: ev.currentTarget.id
      })
    },
    // 纠错提交
    jiucuoFn () {
        if (this.data.searchKey == "") {
            showToast("请选择垃圾名称");
            return false;
        }
        if (this.data.radioResult == "") {
            showToast("请选择垃圾分类");
            return false;
        }
        let dataJson = {
            Name: this.data.searchResult.Name,
            Old_Waste_TypeId: this.data.searchResult.TypeId,
            New_Waste_TypeId: this.data.radioResult,
        }
        showLoading();
        wxRequestPost(correctUrl, dataJson).then((res) => {
            hideLoading();
            showToast("提交成功").then(() => {
                this.setData({
                    showSelectBox: false
                })

            })
        }).catch((res) => {
            hideLoading();
            showToast(res)
        })
    },
    // 取消
    cancelData() {
        this.setData({
            showSelectBox: false
        })
    },
    // 提交数据
    submitData: function() {
        let dataJson = {
            WasteName: this.data.searchKey
        }
        showLoading();
        wxRequestPost(getTrashByNameUrl, dataJson).then((res) => {
            hideLoading();
            let _res = JSON.parse(res);
            console.log(_res);
            this.setData({
                searchResult: _res
            })
        }).catch((res) => {
            hideLoading();
            showToast(res);
        })
    },
    // 纠错答案选择
    onChange(event) {
        this.setData({
            radioResult: event.detail
        });
    },
    // 获取垃圾分类列表
    getWasteTypeList() {
        let dataJson = {}
        wxRequestPost(getWasteTypeListUrl, dataJson).then((res) => {
            let _res = JSON.parse(res);
            this.setData({
                wasteList: _res
            })
        }).catch((res) => {
            showToast(res);
        })
    },
  record() {
        let _this = this;
        _this.setData({
          changeMovePic:true
        })
        setTimeout(function(){
          _this.setData({
            changeMovePic: false
          })
        },2500)
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.record']) {
                    // 检测是否有语音并进行识别
                    manager.onRecognize = function (res) {
                        _this.setData({
                          changeMovePic: false
                        })
                        console.log('current result==', res.result)
                        if (res.result !== '') {
                            // 如果语音识别内容为空时
                            _this.setData({
                                searchKey: res.result,
                                isIdentify: true
                            })
                        }
                        // 识别成功，停止识别
                        manager.stop()
                    }
                    // 启动识别的必要参数设置
                    manager.start({ duration: 2500, lang: 'zh_CN' })

                    manager.onStart = function (res) {
                        console.log('录音状态==', res.msg)
                    }
                    manager.onError = function (res) {
                        _this.setData({
                            isIdentify: true
                        })
                        console.error('error msg', res.msg)
                    }
                    // 录音结束时，再次启动录音
                    manager.onStop = function (res) {
                        // 停止识别，获取最后识别的结果
                        console.log('result', res.result)
                        // 如果识别的内容为空，则不加以其他逻辑处理减少后台交互
                        if (res.result !== '') {
                            // 如果语音识别内容不为空时
                            _this.submitData();
                        }
                        // 判断是否需要重启识别
                        if (_this.isIdentify) {
                            // 启动识别的必要参数设置
                            manager.start({ duration: 2500, lang: 'zh_CN' })
                        }
                    }
                }else{
                    _this.setData({
                      changeMovePic: false
                    })
                    showToast("请先授权录音功能")
                }
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
            headerBottom: wx.getStorageSync("headerBottom")
        })
        this.getWasteTypeList();
        // 启动识别的必要参数设置
        manager.start({ duration: 2500, lang: 'zh_CN' })
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
      wx.setBackgroundColor({
        backgroundColorTop: '#32A060',
        backgroundColorBottom: '#003E85'
      })
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