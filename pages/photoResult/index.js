import {
    getStorageSync,
    navigateBack
} from "../../assets/js/common.js"

import {
    wxRequestPost,
    showToast,
    showLoading,
    hideLoading
} from "../../assets/js/unit.js"

import apiUrl from "../../assets/js/api.js"
const {
    correct,
    getWasteTypeList
} = apiUrl

Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        objInfo: "",
        radioResult: "",
        isPersonRadio: false,
        wasteList: [],
        imgSrc: {
          "kehuishou": "../../assets/images/svg/kehuishou_blue.svg",
          "qita": "../../assets/images/svg/qita_black.svg",
          "chuyu": "../../assets/images/svg/chuyu_1.svg",
          "youhai": "../../assets/images/svg/youhai.svg"
        },
        icon:{
          "active":"../../assets/images/png/selected_circle.png",
          "normal":"../../assets/images/png/default_circle.png"
        }
    },
    // 继续
    goonPhoto(){
        navigateBack(-1)
    },
    // 纠错切换
    switchPer() {
        this.setData({
            isPersonRadio: !this.data.isPersonRadio
        })
    },
    // 纠错答案选择
    onChange(event) {
        this.setData({
            radioResult: event.detail
        });
    },
    // 纠错提交
    submitData() {
        if (this.data.radioResult == "" ){
            showToast("请选择垃圾分类");
            return false;
        }
        let dataJson = {
            Name: this.data.objInfo.Name,
            Old_Waste_TypeId: this.data.objInfo.TypeId,
            New_Waste_TypeId: this.data.radioResult,
        }
        showLoading();
        wxRequestPost(correct, dataJson ).then( (res)=>{
            hideLoading();
            showToast("提交成功").then(()=>{
                this.setData({
                    isPersonRadio : false
                })
            })
        } ).catch((res)=>{
            hideLoading();
            showToast(res)
        })
    },
    // 取消
    cancelData(){
        this.setData({
            isPersonRadio : false
        })
    },
    //返回
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 获取垃圾分类列表
    getWasteTypeList (){
        let dataJson = {}
        wxRequestPost(getWasteTypeList, dataJson).then((res)=>{
            let _res = JSON.parse(res);
            this.setData({
                wasteList: _res
            })
        }).catch((res)=>{
            showToast(res);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setBackgroundColor({
          backgroundColorBottom: '#fff'
        })
        let objInfo = JSON.parse(getStorageSync("objInfo"));
        console.log( objInfo );
        this.setData({
            headerHeight: wx.getStorageSync("headerHeight"),
            headerBottom: wx.getStorageSync("headerBottom"),
            objInfo: objInfo,
        })
        this.getWasteTypeList();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      wx.setBackgroundColor({
        backgroundColorBottom: '#fff'
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    }
})