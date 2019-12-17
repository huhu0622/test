const app = getApp();
var QQMapWX = require('../../static/qqmap-wx-jssdk.min.js');
import {
    showLoading,
    hideLoading,
    showToast,
    wxRequestPost
} from "../../assets/js/unit.js"

import apiUrl from "../../assets/js/api.js"
const {
    getTrashList: getTrashListUrl,
    getTrash: getTrashUrl,
    addTrashPraise: addTrashPraiseUrl
} = apiUrl


Page({
    /**
     * 页面的初始数据
     */
    data: {
        headerHeight: '', //头部高度
        headerBottom: '', //头部底部距离
        bodyHeight: '', //内容高度
        animationData: {},
        inputFocus: false,
        searchContent: '',
        iconPath: "",
        latitude: "",
        longitude: "",
        mapObj: "",
        qqmapsdk: "",
        markers: [],
        resultList: [],
        showMark: false,
        trashInfo: "",
        showDotClick: false
    },
    //返回
    goBack() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    //打点
    goCheck() {
        wx.navigateTo({
            url: '/pages/mapping/mapping'
        })
    },
    //拍照
    goPhoto() {
        wx.navigateTo({
            url: '/pages/photoRecognition/photoRecognition'
        })
    },
    //语音
    goVoice() {
        wx.navigateTo({
            url: '/pages/voiceQuery/voiceQuery'
        })
    },
	homeFn (){
		this.getCurLocation();
	},
    //显示搜索
    showSearch() {
        // let animation = wx.createAnimation({
        //     duration: 800,
        //     timingFunction: 'ease-in',
        // })

        // this.animation = animation
        // animation.bottom('0').step()
        // this.setData({
        //     animationData: animation.export()
        // })
        this.setData({
            showDotClick: true
        })
    },
    //隐藏搜索
    hideSearch() {
        // let animation = wx.createAnimation({
        //     duration: 800,
        //     timingFunction: 'ease-in',
        // })
        // this.animation = animation
        // animation.bottom('-100%').step()
        // this.setData({
        //     animationData: animation.export()
        // })
        this.setData({
            showDotClick: false
        })
    },
    // 点击地图
    tapMap() {
        this.hideSearch()
    },
    focusInput() {
      this.setData({
        inputFocus: true,
        searchContent: ''
      })
      this.foucus()
    },
    inputSearch() {
        let that = this;
        showLoading();
        this.qqmapsdk.search({
            keyword: this.data.searchContent,
            success(res) {
                hideLoading();
                that.setData({
                    resultList: res.data
                })
            }
        })
    },
    input(e) {
        this.setData({
            searchContent: e.detail.value
        })
    },
    // 获取点列表
    getDotList() {
        let dataJson = {};
        wxRequestPost(getTrashListUrl, dataJson).then((res) => {
            let _res = JSON.parse(res);
            let pointArr = [];
            _res.map((item, index) => {
                // 1 垃圾处理厂 2 分类垃圾桶 3 垃圾转运站 4 普通垃圾桶
                pointArr.push({
                    id: item.Id,
                    latitude: item.Lat,
                    longitude: item.Lng,
                    iconPath: `../../assets/images/png/lajiicon${item.Trash_TypeId}.png`,
                    width: 20,
                    height: 20
                })
            });
            this.setData({
                markers: pointArr
            })
        }).catch((res) => {
            showToast(res);
        })
    },
    // 获取当前位置
    getCurLocation() {
        let that = this;
        wx.getLocation({
			type: 'gcj02',
            success(res) {
                const latitude = res.latitude
                const longitude = res.longitude
                that.setData({
                    latitude: latitude,
                    longitude: longitude
                })
            }
        })
    },
    // 删除搜索的点
    removePointer(type) {
        let pointeArr = this.data.markers;
        let _temArr = pointeArr.filter((item, index) => {
            return !item.type || item.type != type
        });
        this.setData({
            markers: _temArr
        });
    },
    // 跳转到指定位置
    gotoPoint(ev) {
        this.removePointer("search");
        let lng = ev.currentTarget.dataset.lng;
        let lat = ev.currentTarget.dataset.lat;
        let markerArr = this.data.markers;
        markerArr.push({
            type: "search",
            longitude: lng,
            latitude: lat,
            iconPath: "../../assets/images/png/mark_green.png"
        });
        this.setData({
            longitude: lng,
            latitude: lat,
            markers: markerArr,
            resultList: []
        });
        this.hideSearch();
    },
    // 查看点信息
    tapMarker(e) {
        this.hideSearch();

        let dataJson = {
            TrashId: e.markerId
        }
        showLoading();
        wxRequestPost(getTrashUrl, dataJson).then((res) => {
            hideLoading();
            let _res = JSON.parse(res);
            this.setData({
                trashInfo: _res,
                showMark: true
            });
        }).catch((res) => {
            hideLoading();
            showToast(res)
        })

    },
    // 赞 踩 取消
    addPraiseUrl(e) {
        console.log(e);
        let that = this;
        let dataset = e.currentTarget.dataset;
        let trashId = dataset.trashid;
        let isAgree = dataset.isagree;

		let praise = dataset.praise;

		if (praise != 0){
			if( praise == 1 ){		// 赞
				if (isAgree == 1 ){
					isAgree = 0;
				}else{
					showToast("请先取消赞");
					return false;
				}
			}
			if( praise == 2 ){		// 踩
				if (isAgree == 2) {
					isAgree = 0;
				} else {
					showToast("请先取消踩");
					return false;
				}
			}
		}

        let dataJson = {
            TrashId: trashId,
            Praise: isAgree
        }
        wxRequestPost(addTrashPraiseUrl, dataJson).then((res) => {
            showToast("提交成功");
			let dataJson = {
				TrashId: trashId
			}
			wxRequestPost(getTrashUrl, dataJson).then((res) => {
				let _res = JSON.parse(res);
				this.setData({
					trashInfo: _res
				});
			}).catch((res) => {
				showToast(res)
			})
        }).catch((res) => {
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
            bodyHeight: wx.getStorageSync("screenHeight") - wx.getStorageSync("headerHeight"),
        });
        this.qqmapsdk = new QQMapWX({
            key: app.globalData.mapKey
        });
        this.getCurLocation();
        this.getDotList();
    },
    //跳转评论
    goComment(e) {
        wx.navigateTo({
            url: '/pages/comments/comments?transhId=' + e.currentTarget.id,
        })
        this.closeMark();
    },
    //隐藏弹框
    closeMark() {
        this.setData({
            showMark: false
        })
    },
})