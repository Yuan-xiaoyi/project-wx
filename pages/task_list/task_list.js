// pages/task_list/task_list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isAdminOrManager: false,
    scrollTop: null,
    statusList:[
      {
        label: '我的待办',
        status: "0",
        chosed: true
      },{
        label: '我的已办',
        status: "1",
        chosed: false
      }
    ],
    status: 0,
    taskList: []
  },
  chooseStatus: function(e){
    let item = e.currentTarget.dataset.index
    this.data.statusList.forEach((element, index) => {
      if(element.status === item.status){
        this.setData({[`statusList[${index}].chosed`]: true})
        this.setData({status: item.status})
      }else{
        this.setData({[`statusList[${index}].chosed`]: false})
      }
    });
    this.getTaskList();
  },
  getTaskList: function(){
    if(this.data.status == 1){ // 已办
      wx.request({
        url: app.globalData.requestUrl + '/finishedFindByUserId',
        method: 'get',
        data: {'userId': this.data.userInfo.userId},
        header: {
          'content-type': 'application/json', // 默认值
          'token': app.globalData.token
        },
        success: (data) => {
          if(data.data.length > 0){
            let arr = []
            for(let i = 0; i < data.data.length; i++){
              if(arr.find(e => e.taskId == data.data[i].taskId) == undefined){
                arr.push(data.data[i])
              }
              this.setData({taskList: arr})
            }

            for(let i = 0; i < this.data.taskList.length; i++){
              this.getTaskbyId(this.data.taskList[i].taskId).then(res => {
                this.setData({[`taskList[${i}].taskDetail`]: res})
              })
            }
          }else{
            this.setData({taskList: []})
          }
        }
      })
    }else{  // 待办
      wx.request({
        url: app.globalData.requestUrl + '/backlogFindByUserId',
        method: 'get',
        data: {'userId': this.data.userInfo.userId},
        header: {
          'content-type': 'application/json', // 默认值
          'token': app.globalData.token
        },
        success: (data) => {
          if(data.data.length > 0){
            this.setData({taskList: data.data})
            for(let i = 0; i < this.data.taskList.length; i++){
              this.getTaskbyId(this.data.taskList[i].taskId).then(res => {
                this.setData({[`taskList[${i}].taskDetail`]: res})
              })
            }
          }else{
            this.setData({taskList: []})
          }
        }
      })
    }
  },

  getTaskbyId: function(taskId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.requestUrl + '/findByTaskId',
        method: 'get',
        data: {'taskId': taskId},
        header: {
          'content-type': 'application/json', // 默认值
          'token': app.globalData.token
        },
        success: (data) => {
          if(data.data.createTime){
            data.data.createTime = data.data.createTime.slice(0, 10)
          }
          if(data.data.deadline && data.data.state != 1){
            let deadline = new Date(data.data.deadline).getTime()
            let now = new Date().getTime();
            if((deadline - now) > 24 * 60 * 60 * 1000){ // 大于24h
              Object.assign(data.data, {'taskStatus': 2})
            }else if((deadline - now) > 0 && (deadline - now) < 24 * 60 * 60 * 1000){
              Object.assign(data.data, {'taskStatus': 1})
            }else{
              Object.assign(data.data, {'taskStatus': -1})
            }
          }else if(data.data.deadline && data.data.state == 1 && data.data.overTime){
            let deadline = new Date(data.data.deadline).getTime()
            let overTime = new Date(data.data.overTime).getTime();
            if((deadline - overTime) > 0){
              Object.assign(data.data, {'taskStatus': 2})
            }else{
              Object.assign(data.data, {'taskStatus': -1})
            }
          }
          resolve(data.data)
        },
        fail: (err) => {
          reject({})
        }
      })
    })
  },

  gotoDetail: function(e){
    let item = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../task_detail/task_detail?taskId=${item.taskId}&taskName=${item.taskDetail.taskName}&createPerson=${item.taskDetail.createPerson}&createTime=${item.taskDetail.createTime}&state=${item.taskDetail.state}&details=${item.taskDetail.details}&deadline=${item.taskDetail.deadline}&projectId=${item.taskDetail.projectId}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({userInfo: JSON.parse(res.data)});
        if(this.data.userInfo.post == "admin" || this.data.userInfo.post == "manager"){
          this.setData({isAdminOrManager: true})
        }
        this.getTaskList();
      }
    });
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
    this.getTaskList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  onPageScroll(e){
    this.setData({ scrollTop: e.scrollTop })
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