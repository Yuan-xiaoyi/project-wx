// pages/search/search.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    searchType: "",
    searchValue: "",
    list: []
  },
  getValue(e){
    this.setData({searchValue: e.detail.value})
  },
  search(){
    if(this.data.searchType == "project"){
      wx.request({
        url: app.globalData.requestUrl + '/findProjectBySelection',
        method: 'get',
        data: {
          userId: this.data.user.userId,
          post: this.data.user.post,
          projectName: this.data.searchValue
        },
        header: {
          'content-type': 'application/json', // 默认值
          'token': app.globalData.token
        },
        success: (data) => {
          this.setData({list: data.data})
        }
      })
    }else if(this.data.searchType == "task"){
      wx.request({
        url: app.globalData.requestUrl + '/findProjectBySelection',
        method: 'get',
        data: {
          userId: this.data.user.userId,
          post: this.data.user.post
        },
        header: {
          'content-type': 'application/json', // 默认值
          'token': app.globalData.token
        },
        success: (data) => {
          let arr = []
          data.data.forEach(e => {
            arr.push(e.projectId)
          })
          wx.request({
            url: app.globalData.requestUrl + `/findTaskBySelection?taskName=${this.data.searchValue}&isTask=1`,
            method: 'post',
            data: arr,
            header: {
              'content-type': 'application/json', // 默认值
              'token': app.globalData.token
            },
            success: (data2) => {
              this.setData({list: data2.data})
            }
          })
        }
      })
    }
  },

  
  gotoDetail: function(e){
    let item = e.currentTarget.dataset.index
    if(this.data.searchType == "project"){
      wx.navigateTo({
        url: `../project_detail/project_detail?projectId=${item.projectId}`
      })
    }else if(this.data.searchType == "task"){
      wx.navigateTo({
        url: `../task_detail/task_detail?taskId=${item.taskId}&taskName=${item.taskName}&createPerson=${item.createPerson}&createTime=${item.createTime}&state=${item.state}&details=${item.details}&deadline=${item.deadline}&projectId=${item.projectId}`
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({searchType: options.searchType})
    
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({user: JSON.parse(res.data)})
      }
    })
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