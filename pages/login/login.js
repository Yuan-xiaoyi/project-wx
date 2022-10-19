// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onGetPhoneNumber(e) {
    var that = this;
    wx.login({
      success (res) {
        if (res.code) {
          console.log('步骤2获检查用户登录状态，获取用户电话号码！', res)
          wx.request({
            url: '这里写自己的获取授权的服务器地址',
            data: {code: res.code},
            header: {'content-type': 'application/json'},
            success: function(res) {
              console.log("步骤三获取授权码，获取授权openid，session_key",res);
              var userphone=res.data.data;
              wx.setStorageSync('userphoneKey',userphone);
              //解密手机号
              var msg = e.detail.errMsg;
              var sessionID=wx.getStorageSync("userphoneKey").session_key;
              var encryptedData=e.detail.encryptedData;
              var iv=e.detail.iv;
              if (msg == 'getPhoneNumber:ok') {//这里表示获取授权成功
                wx.checkSession({
                  success:function(){
                        //这里进行请求服务端解密手机号
                    that.deciyption(sessionID,encryptedData,iv);
                  },
                  fail:function(){
                    // that.userlogin()
                  }
                })
              }
 
            },fail:function(res){
                console.log("fail",res);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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