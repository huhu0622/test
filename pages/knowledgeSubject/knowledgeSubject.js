import {
    showLoading,
    hideLoading,
    showToast,
    wxRequestPost
} from "../../assets/js/unit.js"

import {
    navigateTo,
    navigateBack
} from "../../assets/js/common.js"

import apiUrl from "../../assets/js/api.js"
const {
    getQuestion: getQuestionUrl,
    submitQuestionapi: submitQuestionapiUrl
} = apiUrl

Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        radio: 0,
        show1: false,
        show: false,
        icon1: {
          normal: '../../assets/images/png/Trash_1.png',
          active: '../../assets/images/png/Trash_selected_1.png'
        },
        icon2: {
          normal: '../../assets/images/png/Trash_2.png',
          active: '../../assets/images/png/Trash_selected_2.png'
        },
        icon3: {
          normal: '../../assets/images/png/Trash_3.png',
          active: '../../assets/images/png/Trash_selected_3.png'
        },
        icon4: {
          normal: '../../assets/images/png/Trash_4.png',
          active: '../../assets/images/png/Trash_selected_4.png'
        },
        result : ""
    },
    //返回
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 获取题目
    getQuestion() {
        let dataJson = {};
        showLoading();
        wxRequestPost(getQuestionUrl, dataJson).then((res) => {
            hideLoading();
            let _res = JSON.parse(res);
            console.log(_res);
            this.setData({
                questionInfo: _res
            })
        }).catch((res) => {
            showToast(res);
        });
    },
    //选择
    onChange(e) {
        this.setData({
            radio: e.detail
        });
    },
    //显示弹出框
    showMask() {
        this.setData({
            show: true
        })
    },
    //关闭弹出框
    closeMask(e) {
        this.setData({
            show: false,
            radio : 0
        })
        if (e.currentTarget.id == 1) {
            this.getQuestion();
        }
    },
    // 下次再说
    next(){
        this.setData({
            show: false,
            radio: 0
        })
        navigateBack(-1);
    },
    // 提交问题
    submitQuestion() {
        let dataJson = {
            Name: this.data.questionInfo.QuestionName,
            WasteTypeId : this.data.radio
        };
        showLoading();
        wxRequestPost(submitQuestionapiUrl, dataJson ).then((res)=>{
            hideLoading();
            let _res = JSON.parse(res);
            console.log(_res);
            this.setData({
                result : _res,
                show : true
            })
        }).catch((res)=>{
            showToast(res);
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
        this.getQuestion();
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

    }
})