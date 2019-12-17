import {
    showLoading,
    hideLoading,
    showToast,
    wxRequestPost
} from "../../assets/js/unit.js"

import apiUrl from "../../assets/js/api.js"
const { newsDetail: newsDetailUrl } = apiUrl

Page({
    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        newsDetail : {},
        newsId:'',
        source:'',
        newsContent:''
    },
    //返回
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    //回到首页
    goHome(){
      wx.navigateTo({
        url: '/pages/index/index'
      })
    },
    // 获取新闻详情
    getNewsDetail(newsId){
        let dataJson = {
            id: newsId,
        }
        showLoading();
        wxRequestPost(newsDetailUrl, dataJson ).then((res)=>{
            hideLoading();
            let _res = JSON.parse(res);
            console.log(_res);
            this.setData({
                newsDetail : _res,
              newsContent: _res.Content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
            })
        }).catch((res)=>{
            showToast(res)
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
            newsId: options.newsId,
            source: options.info
        })
        that.getNewsDetail(options.newsId);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
      let that = this
      let newsId = that.data.newsId
      return {
        path: '/pages/knowledgeDetails/knowledgeDetails?newsId=' + newsId + "&info=share"
      }
    }
})