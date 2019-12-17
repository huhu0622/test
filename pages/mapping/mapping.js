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
    getTrashTypeList: getTrashTypeListUrl,
    addTrash: addTrashUrl
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
        isMove: false,
        isInit: true,
        mapCtx: "",
        latitude: "",
        longitude: "",
        curAddress: "",
        qqmapsdk: "",
        trashTypeList: [],
        markers: [],
        typeId: "",
        showDotClick: false
    },
    //返回首页
    goBack() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    //查看
    goCheck() {
        wx.navigateTo({
            url: '/pages/checkFacilities/checkFacilities'
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
    //显示打点
    showDot() {
        // let animation = wx.createAnimation({
        //     duration: 800,
        //     timingFunction: 'ease-out',
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
    //隐藏打点
    hideDot() {
        // let animation = wx.createAnimation({
        //     duration: 800,
        //     timingFunction: 'ease-out',
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
    tapmap() {
        this.hideDot();
        this.setData({
            typeId: ""
        })
    },
    // 拖拽地图
    dragmap(ev) {
        let that = this;
        // 开始拖拽
        if (ev.detail.type == "begin") {
            this.setData({
                isMove: true,
            })
        }
        // 结束拖拽
        if (ev.detail.type == "end" && (ev.causedBy == 'scale' || ev.causedBy == 'drag')) {
            if (this.data.isInit) { // 初始化执行一次
                this.setData({
                    isInit: false,
                    isMove: false
                })
            }
            this.mapCtx.getCenterLocation({
                success(res) {
                    const lng = res.longitude;
                    const lat = res.latitude;

                    if (lng == that.data.longitude && lat == that.data.latitude) return false;

                    that.setData({
                        longitude: lng,
                        latitude: lat,
                    })

                    that.lnglatToAddress(lng, lat);
                }
            })
        }
    },
    // 获取当前位置
    getCurLocation() {
        let that = this;
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                that.lnglatToAddress(that.data.longitude, that.data.latitude)
            }
        })
    },
    // 选择打点分类
    selectType(ev) {
        this.setData({
            typeId: ev.currentTarget.id
        })
    },
    // 获取当前打点类型
    getTrashTypeList() {
        let dataJson = {}
        wxRequestPost(getTrashTypeListUrl, dataJson).then((res) => {
            let _res = JSON.parse(res);
            this.setData({
                trashTypeList: _res
            })
        }).catch((res) => {
            showToast(res)
        })
    },
    // 提交数据
    submitData() {
        if (this.data.typeId == "") {
            showToast("请选择分类类型");
            return false;
        }
        let dataJson = {
            Lng: this.data.longitude,
            Lat: this.data.latitude,
            Address: this.data.curAddress,
            Trash_TypeId: this.data.typeId
        };
        showLoading();
        wxRequestPost(addTrashUrl, dataJson).then((res) => {
            hideLoading();
            let _pointerArr = this.data.markers;
            _pointerArr.push({
                latitude: this.data.latitude,
                longitude: this.data.longitude,
                iconPath: `../../assets/images/png/lajiicon${this.data.typeId}.png`,
                width: 20,
                height: 20
            });
            this.setData({
                markers: _pointerArr,
                typeId: ""
            });
            this.hideDot();

        }).catch((res) => {
            hideLoading();
            showToast(res);

            this.hideDot();
            this.setData({
                typeId: ""
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        this.mapCtx = wx.createMapContext('map')
        this.setData({
            headerHeight: wx.getStorageSync("headerHeight"),
            headerBottom: wx.getStorageSync("headerBottom"),
            bodyHeight: wx.getStorageSync("screenHeight") - wx.getStorageSync("headerHeight"),
        })
        // 获取当前位置
        this.getCurLocation();
        // 获取垃圾分类类型
        this.getTrashTypeList();

    },
    // 经纬度转换为地址
    lnglatToAddress(lng, lat) {
        let that = this;
        this.qqmapsdk = new QQMapWX({
            key: app.globalData.mapKey
        });
        this.qqmapsdk.reverseGeocoder({
            location: {
                latitude: lat,
                longitude: lng
            },
            success(res) {
                that.setData({
                    curAddress: res.result.address
                })
            }
        });
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
})