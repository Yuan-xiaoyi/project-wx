var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    isAdminOrManager: false,
    isXMmanger: false,
    projectId: "",
    project:{
      projectName: "",
      createTime: "",
      proprietor: "",
      mainManager: "",
      fenManager: "",
      agent: "",
      bidding: "",
      details: ""
    },
    taskList: [],
    showTaskDetail:false,
    showModal: true,
    showModal2: true,
    showSecondModal: true,
    members: [],
    xm_manager: false,
    kh_manager: false,
    jjfa_manager: false,
    form: {
      name: "",
      detail: "",
      date: "",
      response: "",
      responseId: ""
    },
  },

  onPickerChange (e) {
    let date = e.detail
    this.setData({"form.date": date})
  },
  showModalFun(e){
    wx.showModal({
      content: e.currentTarget.dataset.index,
      showCancel:false,
      confirmText:"关闭"
    })
  },
  taskDetails(){
    this.setData({
      "showTaskDetail": !this.data.showTaskDetail
    })
  },
  showStageModal(e){
    let item = e.currentTarget.dataset.index
    wx.showModal({
      content: item,
      showCancel:false,
      confirmText:"关闭"
    })
  },
  gotoDetails(e){
    let item = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../task_detail/task_detail?taskId=${item.taskId}&taskName=${item.taskName}&createPerson=${item.createPerson}&createTime=${item.createTime}&state=${item.state}&details=${item.details}&deadline=${item.deadline}&projectId=${this.data.projectId}`
    })
  },

  btn_add(){
    this.setData({ showModal: false })
  },
  btn_add2(){
    this.setData({ showModal2: false })
  },
  modalConfirm(){
    console.log(this.data.form)
  },
  modalCancel(){
    this.setData({ showModal: true })
    this.setData({ showModal2: true })
  },
  catchtouchstart(){
    wx.hideKeyboard();
  },
  getMembers(){
    this.setData({ showSecondModal: false })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const members = this.data.members
    for (let i = 0, len = members.length; i < len; ++i) {
      members[i].checked = members[i].projectMemberId == e.detail.value
    }
    this.setData({members})
  },
  modalSecConfirm(){
    let response = this.data.members.find(e => e.checked == true)
    this.setData({
      ["form.response"]: response.userName,
      ["form.responseId"]: response.userId
    })
    this.setData({ showSecondModal: true })
  },
  modalSecCancel(){
    this.setData({ showSecondModal: true })
  },

  formSubmit: function(e) {
    const params = e.detail.value
    //校验表单
    if (params.name && params.detail && params.date && params.response && params.responseId) {
      this.addTask(params, "task")
    }else{
      wx.showToast({
        title: '请输入完整信息',
        icon: 'error',
        duration: 2000
      })
    }
  },
  formSubmit2: function(e) {
    const params = e.detail.value
    //校验表单
    if (params.name && params.detail) {
      this.addTask(params, "getback")
    }else{
      wx.showToast({
        title: '请输入完整信息',
        icon: 'error',
        duration: 2000
      })
    }
  },
  addTask(params, str){
    let form;
    if(str == "task"){
      form = {
        projectId: this.data.projectId,
        checkPersonId: this.data.userInfo.usreId,
        createPerson: this.data.userInfo.userName,
        deadline: params.date,
        details: params.detail,
        handPersonId: params.responseId,
        isTask: 1,
        state: 0,
        taskName: params.name
      }
    }else{
      form = {
        projectId: this.data.projectId,
        createPerson: this.data.userInfo.userName,
        details: params.detail,
        isTask: 0,
        taskName: params.name
      }
    }
    wx.request({
      url: app.globalData.requestUrl + `/addTask?projectId=${this.data.projectId}`,
      method: 'post',
      data: form,
      header: {
        'content-type': 'application/json', // 默认值
        'token': app.globalData.token
      },
      success: (data) => {
        if(data.data){
          if(str == "task"){
            this.addTaskRecord(data.data, params)
          }else{
            this.getTaskList()
            this.setData({ showModal2: true })
            wx.showToast({
              title: '添加反馈成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      }
    })
  },
  addTaskRecord(taskId, params){
    wx.request({
      url: app.globalData.requestUrl + '/addTaskRecord',
      method: 'post',
      data: {
        'taskId': taskId,
        'state': 0,
        'handPersonId': params.responseId,
        'checkPersonId': this.data.userInfo.userId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': app.globalData.token
      },
      success: (data) => {
        this.setData({ showModal: true })
        wx.showToast({
          title: '成功创建任务',
          icon: 'success',
          duration: 2000
        })
        this.getTaskList()
      },
      fail: () => {
        wx.request({
          url: app.globalData.requestUrl + '/deleteTask',
          method: 'get',
          data: {
            'taskId': taskId
          },
          header: {
            'content-type': 'application/json', // 默认值
            'token': app.globalData.token
          }
        })
      }
    })
  },

  getTaskList(){
    wx.request({
      url: app.globalData.requestUrl + '/findTaskByProjectId',
      method: 'get',
      data: {
        projectId: this.data.projectId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': app.globalData.token
      },
      success: (data) => {
        if(data.data && data.data.length > 0){
          for(let i = 0; i < data.data.length; i++){
            if(data.data[i].createTime){
              data.data[i].createTime = data.data[i].createTime.slice(0, 10)
            }
          }
          // data.data = data.data.reverse()
          this.setData({taskList: data.data})
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({projectId: options.projectId})
    
    wx.request({
      url: app.globalData.requestUrl + '/findProjectById',
      method: 'get',
      data: {
        projectId: this.data.projectId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'token': app.globalData.token
      },
      success: (data) => {
        if(data.data.createTime){
          data.data.createTime = data.data.createTime.slice(0, 10)
        }
        this.setData({project: data.data})
        this.getTaskList()
      }
    })
    
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({userInfo: JSON.parse(res.data)});
        if(this.data.userInfo.post == "admin" || this.data.userInfo.post == "manager"){
          this.setData({isAdminOrManager: true})
        }

        wx.request({
          url: app.globalData.requestUrl + '/findProjectMember',
          method: 'get',
          data: {
            projectId: this.data.projectId
          },
          header: {
            'content-type': 'application/json', // 默认值
            'token': app.globalData.token
          },
          success: (data) => {
            if(data.data && data.data.length > 0){
              for(let i = 0; i < data.data.length; i++){
                if(data.data[i].role == "项目经理"){
                  this.setData({"xm_manager": true});
                }
                if(data.data[i].role == "客户经理"){
                  this.setData({"kh_manager": true});
                }
                if(data.data[i].role == "解决方案经理"){
                  this.setData({"jjfa_manager": true});
                }
                
                if(this.data.userInfo.userId == data.data[i].userId){
                  data.data[i].disabled = true
                  let role = data.data[i].role
                  if(role == "项目经理"){
                    this.setData({"isXMmanger": true});
                  }else{
                    this.setData({"isXMmanger": false});
                  }
                }
              }
              this.setData({"members": data.data})
            }
          }
        })
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
    this.getTaskList()
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