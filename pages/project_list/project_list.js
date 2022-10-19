// pages/project_list/project_list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // projectType: "",
    statusList: [
      {
        label: '全部',
        status: -1,
        chosed: true
      },
      {
        label: '未完结',
        status: 0,
        chosed: false
      },{
        label: '已完结',
        status: 2,
        chosed: false
      }
    ],
    projectList: [],
    scrollTop: null
  },
  chooseStatus: function(e){
    let item = e.currentTarget.dataset.index
    this.data.statusList.forEach((element, index) => {
      if(element.status === item.status){
        this.setData({[`statusList[${index}].chosed`]: true})
        let that = this
        wx.request({
          url: app.globalData.requestUrl + '/findProjectBySelection',
          method: 'get',
          data: {
            userId: that.data.userInfo.userId,
            post: that.data.userInfo.post,
            // industry: that.data.projectType,
            state: item.status >= 0 ? item.status : ""
          },
          header: {
            'content-type': 'application/json', // 默认值
            'token': app.globalData.token
          },
          success(data) {
            if(data.data.length > 0){
              that.setData({projectList: data.data})
            }else{
              that.setData({projectList: []})
            }
          }
        })
      }else{
        this.setData({[`statusList[${index}].chosed`]: false})
      }
    });
  },
  gotoDetail: function(e){
    let item = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../project_detail/project_detail?projectId=${item.projectId}`
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({projectType: options.label})
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({userInfo: JSON.parse(res.data)})
        wx.request({
          url: app.globalData.requestUrl + '/findProjectBySelection',
          method: 'get',
          data: {
            userId: this.data.userInfo.userId,
            post: this.data.userInfo.post,
            // industry: this.data.projectType
          },
          header: {
            'content-type': 'application/json', // 默认值
            'token': app.globalData.token
          },
          success: (data) => {
            if(data.data.length > 0){
              this.setData({projectList: data.data})
            }else{
              this.setData({projectList: []})
            }
          }
        })
      }
    })
  },

  onPageScroll(e){
    console.log(e.scrollTop)
    this.setData({ scrollTop: e.scrollTop })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})