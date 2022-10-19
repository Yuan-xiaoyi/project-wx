var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isAdminOrManager: false,
    isCurrentXMmanger:false,
    isCurrentRWdealer: false,
    isCurrentRWchecker: false,
    task: {
      taskId: "",
      taskName: "",
      createPerson: "",
      createTime: "",
      deadline: "",
      state: 0,
      details: "",
      projectId: "",
      userName: "",
    },
    taskRecordState: 0,
    list:[],

    inputVal: "",
  },
  inputDeal(e){
    this.setData({ inputVal : e.detail.value})
  },
  inputVerify(e){
    this.setData({ inputVal : e.detail.value})
  },
  submit(){
    if(this.data.inputVal !== ""){
      this.data.list[this.data.list.length - 1].state = 1
      this.data.list[this.data.list.length - 1].solveDetails = this.data.inputVal
      let that = this
      wx.request({
        url: app.globalData.requestUrl + '/updateTaskRecord',
        method: 'post',
        data:  that.data.list[that.data.list.length - 1],
        header: {
          'content-type': 'application/json', // 默认值
          'token': app.globalData.token
        },
        success: (data) => {
          wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 2000
          })
          that.searchRecord(that.data.task.taskId)
        }
      })
    }else{
      wx.showToast({
        title: '请输入处理情况',
        icon: 'error',
        duration: 2000
      })
    }
  },

  pass(){
    this.data.list[this.data.list.length - 1].state = 2
    this.data.list[this.data.list.length - 1].checkDetails = this.data.inputVal
    let that = this
    wx.request({
      url: app.globalData.requestUrl + '/updateTaskRecord',
      method: 'post',
      data:  that.data.list[that.data.list.length - 1],
      header: {
        'content-type': 'application/json', // 默认值
        'token': app.globalData.token
      },
      success: (data) => {
        that.searchRecord(that.data.task.taskId)
        wx.request({
          url: app.globalData.requestUrl + '/updateTask',
          method: 'get',
          data:{  
            taskId: that.data.task.taskId,
            solveDetails: that.data.list[that.data.list.length - 1].solveDetails,
            state: 1
          },
          header: {
            'content-type': 'application/json', // 默认值
            'token': app.globalData.token
          },
          success: (data2) => {
            wx.showToast({
              title: data.msg,
              icon: 'success',
              duration: 2000
            })
          },
          fail: (e) => {
            wx.showToast({
              title: e.msg,
              icon: 'error',
              duration: 2000
            })
          }
        })
      }
    })
  },
  notpass(){
    if(this.data.inputVal !== ""){
      this.data.list[this.data.list.length - 1].state = 3
      this.data.list[this.data.list.length - 1].checkDetails = this.data.inputVal
      let that = this
      wx.request({
        url: app.globalData.requestUrl + '/updateTaskRecord',
        method: 'post',
        data:  that.data.list[that.data.list.length - 1],
        header: {
          'content-type': 'application/json', // 默认值
          'token': app.globalData.token
        },
        success: (data) => {
          wx.request({
            url: app.globalData.requestUrl + '/addTaskRecord',
            method: 'post',
            data: {
              'taskId': that.data.task.taskId,
              'state': 0,
              'handPersonId': that.data.list[that.data.list.length - 1].handPersonId,
              'checkPersonId': that.data.userInfo.userId
            },
            header: {
              'content-type': 'application/json', // 默认值
              'token': app.globalData.token
            },
            success: (data2) => {
              wx.showToast({
                title: data.msg,
                icon: 'success',
                duration: 2000
              })
              that.searchRecord(that.data.task.taskId)
            },
            fail: (e) => {
              wx.showToast({
                title: e.msg,
                icon: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '请输入修改意见',
        icon: 'error',
        duration: 2000
      })
    }
  },
  searchRecord(taskId){
    let that = this
    wx.request({
      url: app.globalData.requestUrl + '/findTaskRecordByTaskId',
      method: 'get',
      data: {
        taskId: taskId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': app.globalData.token
      },
      success: (data) => {
        if(data.data.length > 0){
          that.setData({"list": data.data})
          that.setData({"taskRecordState": data.data[data.data.length-1].state})
          that.setData({"task.userName": data.data[data.data.length-1].userName})
          that.setData({isCurrentRWdealer: that.data.userInfo.userId == data.data[data.data.length - 1].handPersonId})
          that.setData({isCurrentRWchecker: that.data.userInfo.userId == data.data[data.data.length - 1].checkPersonId})
        }
      }
    });
  },
  getMemberRole(){
    wx.request({
      url: app.globalData.requestUrl + '/findProjectMember',
      method: 'get',
      data: {
        projectId: this.data.task.projectId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': app.globalData.token
      },
      success: (data) => {
        let role = data.data.find(e => e.userId == this.data.userInfo.userId)
        if(role && role.role == "项目经理"){
          this.isCurrentXMmanger = true
        }else{
          this.isCurrentXMmanger = false
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      "task.taskId": options.taskId,
      "task.taskName": options.taskName,
      "task.createPerson": options.createPerson,
      "task.createTime": options.createTime,
      "task.state": options.state,
      "task.details": options.details,
      "task.projectId": options.projectId,
      "task.deadline": options.deadline,
    })
    this.searchRecord(options.taskId)
    
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({userInfo: JSON.parse(res.data)});
        if(this.data.userInfo.post == "admin" || this.data.userInfo.post == "manager"){
          this.setData({isAdminOrManager: true})
        }
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