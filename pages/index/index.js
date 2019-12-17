import {
    showLoading,
    hideLoading,
    showToast,
    wxRequestPost
} from "../../assets/js/unit.js"

import apiUrl from "../../assets/js/api.js"
const {
    indexInfo: indexInfoUrl,
    newsList: newsListUrl
} = apiUrl

Page({
    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度,
        indexData: "",
        newsList : ""
    },
    //跳转到我的信息
    goMyInfo() {
        wx.navigateTo({
            url: '/pages/myInfo/myInfo',
        })
    },
    // 获取咨询列表数据
    getNewsList() {
        let dataJson = {
            PageIndex: 1,
            PageSize: 10
        };
        wxRequestPost(newsListUrl, dataJson).then((res) => {
            let _res = JSON.parse(res);
            let _tempArr = [];
            _res.forEach( (item, index)=>{
                _tempArr.push( _res.splice(0, 2) );
            } )
			let _newArr = ""
			if( _res.length != 0 ){
				_newArr = _tempArr.concat([_res])
			}else{
				_newArr = _tempArr
			}
            this.setData({
				newsList: _newArr
            })
        }).catch((res) => {
            showToast(res)
        })
    },
    // 获取首页数据
    getIndexData() {
        let dataJson = {};
        showLoading();
        wxRequestPost(indexInfoUrl, dataJson).then((res) => {
            hideLoading();
            let _res = JSON.parse(res);
            this.setData({
                indexData: _res
            })
        }).catch((res) => {
            showToast(res);
        })
    },
    //科普知识
    goKnowledge() {
        wx.navigateTo({
            url: '/pages/knowledge/knowledge',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setBackgroundColor({
          backgroundColorTop: '#32A060',
          backgroundColorBottom: '#fff'
        })
        let that = this
        that.setData({
            headerHeight: wx.getStorageSync("headerHeight")
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
		this.getIndexData();
		this.getNewsList();
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