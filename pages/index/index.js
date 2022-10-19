// index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    project: 0,
    completedProject: 0,
    disabledProject: 0,
    getProject: 0,
    messarr: [
      {
        color: '#ff6262',
        flownum: 0,
        text: "未中标"
      },
      {
        color: '#7CFC00',
        flownum: 0,
        text: "已中标"
      },
      {
        color: '#808080',
        flownum: 0,
        text: "已失效"
      }
    ]

  },

  search(){
    let that = this
    that.setData({project: 0})
    that.setData({completedProject: 0})
    that.setData({disabledProject: 0})
    that.setData({getProject: 0})
    wx.request({
      url: app.globalData.requestUrl + '/findProjectBySelection',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(data) {
        if(data.data && data.data.length > 0){
          that.setData({project: data.data.length})
          for(let i = 0; i < data.data.length; i++){
            if(data.data[i].state == 2){
              that.setData({completedProject: that.data.completedProject + 1})
            }
            if(data.data[i].state == 3){
              that.setData({disabledProject: that.data.disabledProject + 1})
            }
            if(data.data[i].bidding == '是'){
              that.setData({getProject: that.data.getProject + 1})
            }
          }{
        }
          that.setData({"messarr[0].flownum": that.data.completedProject - that.data.getProject})
          that.setData({"messarr[1].flownum": that.data.disabledProject})
          that.setData({"messarr[2].flownum": that.data.getProject})
        }
      }
    })
  },

  drawPie(){
     // 初始化
     const ctx = wx.createCanvasContext('Canvas');
     // 设置圆点 x  y   中心点
     let number = {
       x: 150,
       y: 150
     };
     // 获取数据 各类项的个数
     let term = this.data.messarr;
     let termarr = [];
     for (let t = 0; t < term.length; t++) {
       // flownum
       let thisterm = Number(term[t].flownum)
       let thiscolor = term[t].color
       termarr.push({
         data: thisterm,
         color: thiscolor
       })
     }
     console.log(termarr)
     // 设置总数
     let sign = 0;
     for (var s = 0; s < termarr.length; s++) {
       sign += termarr[s].data
     }
     //设置半径 
     let radius = 80;
     for (var i = 0; i < termarr.length; i++) {
       var start = 0;
       // 开始绘制
       ctx.beginPath()
       if (i > 0) {
         for (var j = 0; j < i; j++) {
           start += termarr[j].data / sign * 2 * Math.PI
         }
       }
       var end = start + termarr[i].data / sign * 2 * Math.PI
       ctx.arc(number.x, number.y, radius, start, end);
       ctx.setLineWidth(1);
       ctx.lineTo(number.x, number.y);
       ctx.setStrokeStyle('#fff');
       ctx.setFillStyle(termarr[i].color);
       ctx.fill();
       ctx.closePath();
       ctx.stroke();
     }
     ctx.draw();
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.search()
    // this.drawPie();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.search()
    this.drawPie();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.search()
    this.drawPie();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
