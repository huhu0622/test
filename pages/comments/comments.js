import {
    showLoading,
    hideLoading,
    showToast,
    wxRequestPost
} from "../../assets/js/unit.js"

import {
    getStorageSync
} from "../../assets/js/common.js"

import apiUrl from "../../assets/js/api.js"
const {
    getTrashCommentList: getTrashCommentListUrl,
    addTrashComment: addTrashCommentUrl,
    deleteTrashComment: deleteTrashCommentUrl
} = apiUrl

Page({

    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        trashId : "",
        pageIndex : 1,
        commentData : [],
        totalSize : 0,
        bottom:0
    },
    //返回
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 获取评论列表
    getCommentList (){
        let dataJson = {
            TrashId : this.data.trashId,
            PageIndex : this.data.pageIndex,
            PageSize : 10
        };
        let that = this;
        wx.request({
            url: getTrashCommentListUrl,
            data: dataJson,
            header: {
                Authorization: getStorageSync("userId")
            },
            method: 'post',
            success: function(res) {
                if (res.data.Rs == 1 ){
                    let _res = JSON.parse(res.data.Obj);
                    if (that.data.pageIndex == 1) {
                        that.setData({
                            commentData: _res
                        });
                    } else {
                        that.setData({
                            commentData: that.data.commentData.concat(_res)
                        });
                    }
                    that.setData({
                        totalSize: res.data.TotalSize
                    })
                }else if (res.data.Rs == 0) {
                    reject("请检查网络连接!");
                } else {
                    reject(res.data.Message)
                }
            },
            fail: function(res) {
                showToast(res.data.Message);
            }
        })
    },
    // 删除评论
    deleteComment (e){
        let dataJson = {
            Id: e.currentTarget.id
        };
        showLoading();
        wxRequestPost(deleteTrashCommentUrl, dataJson).then((res)=>{
            hideLoading();
            this.setData({
                pageIndex : 1
            })
            this.getCommentList();
        }).catch((res)=>{
            showToast(res);
        })
    },
    contentChange (e){
        this.setData({
            comment : e.detail.value
        })
    },
    //获取焦点
    inputFocus(e){
      this.setData({
        bottom: e.detail.height
      })
    },
    //失去焦点
    inputBlur(e){
      this.setData({
        bottom: 0
      })
    },
    // 添加评论
    addComment(){
        if( this.data.comment == "" ){
            showToast("请填写评论");
            return false;
        }
        let dataJson = {
            TrashId: this.data.trashId,
            Comment : this.data.comment
        }
        wxRequestPost(addTrashCommentUrl, dataJson).then((res)=>{
            this.setData({
                comment : "",
                pageIndex: 1
            })
            this.getCommentList();
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
            headerBottom: wx.getStorageSync("headerBottom"),
            trashId: options.transhId
        })

        wx.startPullDownRefresh();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.setData({
            pageIndex : 1,
            commentData : []
        })
        this.getCommentList();
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.setData({
            pageIndex: ++this.data.pageIndex,
        })
        this.getCommentList();
    },
})