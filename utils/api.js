// const app = getApp()
// const API_HOST = app.globalData.requestUrl //接口前缀
function api(url, method, data) {
  return new Promise((resolve, reject) => {
    wx.showLoading();
    var header = {
      'content-type': 'application/json'
    }
    const apiFun = function() {
      wx.request({
        url: url,
        data,
        method,
        header: header,
        timeout: 6000,
        success: (res) => {
          wx.hideLoading();
          if (res.statusCode === 500) {
            wx.showModal({
              title: '提示',
              content: '网络服务异常！',
              showCancel: false
            })
            reject(res);
          } else if (res.statusCode === 200) {
            let resData = res.data;
            let code = resData.code || '200';
            if(code == '200'){
              if(res.header.refreshToken){ // token刷新机制
                wx.setStorage({
                  key: 'token', //本地缓存中指定的 key(类型：string)
                  data: res.header.refreshToken, //需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
                  success: (s) => {
                    console.log('更新token成功====', s);
                  },
                  fail: (f) => {
                    console.log('更新token失败====', f);
                  }
                })
              }
              resolve(res);
            } else {
              //业务处理
              reject(res);
            }
          } else {
            wx.showModal({
              title: '错误信息',
              content: '操作失败！如需帮助请联系技术人员',
              showCancel: false
            })
          }
        },
        fail: (err) => {
          wx.hideLoading();
          wx.showModal({
            title: '错误信息',
            content: '网络不可用，请检查你的网络状态或稍后再试！',
            showCancel: false
          })
          reject(err);
        }
      })
    }
    wx.getStorage({
      key: 'token',
      success: (res) => {
        Object.assign(header, {'token': res.data})
        apiFun();
      },
      fail: () => {
        apiFun();
      }
    })
  })
}

module.exports = {
  api: api,
}