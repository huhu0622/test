import {
    showLoading,
    hideLoading,
    showToast,
    wxRequestPost
} from "../../assets/js/unit.js"

import apiUrl from "../../assets/js/api.js"
const { newsList: newsListUrl } = apiUrl

Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        newsList : [],
        pageIndex : 1,
    },
    //返回
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    //详情
    goDetail(e) {
        let newsId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/knowledgeDetails/knowledgeDetails?newsId=' + newsId + "&info=list",
        })
    },
    //答题 挑战
    goChallenge() {
        wx.navigateTo({
            url: '/pages/knowledgeSubject/knowledgeSubject',
        })
    },
    // 获取咨询列表数据
    getNewsList(){
        let dataJson = {
            PageIndex: this.data.pageIndex,
            PageSize : 6
        };
        wxRequestPost(newsListUrl, dataJson ).then((res)=>{
            let _res = JSON.parse(res);
            if( this.data.pageIndex == 1 ){
                this.setData({
                    newsList: _res
                })
            }else{
                this.setData({
                    newsList: this.data.newsList.concat(_res)
                })
            }
            wx.stopPullDownRefresh();
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
            headerBottom: wx.getStorageSync("headerBottom")
        });
        this.getNewsList();
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.setData({
            pageIndex : 1,
            //newsList : []
        })
        this.getNewsList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.setData({
            pageIndex : ++this.data.pageIndex
        })
        this.getNewsList();
    }
})