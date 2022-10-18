// app.js
App({
  globalData: {
    requestUrl: "http://192.168.99.2:8899",
    // fakePhone: "19923218989", // 测试人员普通
    fakePhone: "15235465456", // "", // ertyweratWE
    token: ""
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    let that = this
    wx.request({
      url: that.globalData.requestUrl + '/loginWx',
      method: 'get',
      data: { 'phoneNumber': that.globalData.fakePhone },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(data) {
        wx.setStorage({
          key: 'token', //本地缓存中指定的 key(类型：string)
          data: data.data.token, //需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
          success: (s) => {
            console.log('存储token成功====', s);
            wx.request({
              url: that.globalData.requestUrl + '/findUserByPhoneNumber',
              method: 'get',
              data: {
                phoneNumber: that.globalData.fakePhone
              },
              header: {
                'content-type': 'application/json', // 默认值
                "token": data.data.token
              },
              success(res) {
                wx.setStorage({
                  key: 'userInfo', //本地缓存中指定的 key(类型：string)
                  data: JSON.stringify(res.data), //需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
                  success: (s) => {
                    console.log('存储缓存成功====', s);
                    that.globalData.token = data.data.token
                  },
                  fail: (f) => {
                    console.log('存储缓存失败====', f);
                  }
                })
              },
              fail(er) {
                console.log(er)
              }
            })
          },
          fail: (f) => {
            console.log('存储token失败====', f);
          }
        })
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})

