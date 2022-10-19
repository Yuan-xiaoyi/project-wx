// js
var app = getApp()
Page({
  data: {
    userInfo: '',
    getUserInfo: true, //显示登录按钮(wx:if 是遇 true 显示，hidden 是遇 false 显示。)
    SessionKey: '',
    OpenId: '',
    code: '',
    isCanUse: true, //uni.getStorageSync('isCanUse'), //默认为true
    token: '',
    userInfo: {
      nickName: "test",
      avatarUrl: "../../icons/wx_login.png",
    }
  },

  onLoad() {
    // wx.getStorage({ //异步获取缓存
    //   key: "userInfo", //本地缓存中指定的 key
    //   success: (res) => {
    //     console.log('获取缓存成功', res.data)
    //     this.setData({
    //       userInfo: JSON.parse(res.data), //将得到的缓存给key 
    //       getUserInfo: false,
    //     })
    //     fail: (err) => {
    //       console.log("获取失败", err);
    //     }
    //   }
    // }); 
  },

  getUserProfile(e) { //获取用户信息绑定的单击事件
    wx.getUserProfile({ //获取用户信息
      desc: '用户登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("---", res);
        this.setData({userInfo: res.userInfo})
        wx.setStorage({
          key: 'userInfo', //本地缓存中指定的 key(类型：string)
          data: JSON.stringify(res.userInfo), //需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
          success: (s) => {
            console.log('存储缓存成功====', s);
            this.setData({
              getUserInfo: false //隐藏登录按钮  
            })
          },
          fail: (f) => {
            console.log('存储缓存失败====', f);
          }
        })
        // wx.setStorage({ //第二个缓存
        //   key: "count",
        //   data: "缓存2"
        // })
      },
      fail: (err) => {
        console.log("获取用户信息失败", err);
      }
    })
  },
  wxLogin(e) {
    /** 正式应用时注掉 **/
    this.setData({
      getUserInfo: false //隐藏登录按钮  
    })
    /** 正式应用时注掉 **/
    
    let p1 = this.wxSilentLogin() // 获取code
    let p2 = this.wxGetUserProfile() // 获取用户信息
    p1.then((code) => {
      return code
    }).then((code) => {
      this.setData({code: code})
      return new Promise((resolve, reject) => {
        p2.then((res) => {
          resolve({
            code,
            iv: res.iv,
            encryptedData: res.encryptedData,
          })
        }).catch((err) => {
          reject(err)
        })
      })
    }).then((res) => {
      console.log('code', res.code)
      console.log('encrypted_data', res.encryptedData)
      console.log('iv', res.iv)
      let _this = this
      
      // 请求服务器
      wx.request({
        url: app.globalData.requestUrl + '/wx/getsessionkey',
        method: 'get',
        data: {
          js_code: res.code,
          encryptedData: res.encryptedData,
          iv: res.iv,
        },
        header: {
          'content-type': 'application/json', // 默认值
        },
        success(data) {
          if(data.statusCode == 200) {
            if(data.data==undefined){
              wx.showToast({
                icon: "none",
                title: '信息获取失败，请重新登录！',
              })
              return false
            }else{
              console.log("获取用户信息成功：", data.data)
              _this.setData({
                userInfo: data.data
              })

              if(data.data.phoneNumber==undefined){
                // 获取手机号失败 
                console.log("获取手机号失败");
                return false
              }else {
                _this.setData({
                  getUserInfo: false //隐藏登录按钮  
                })
              }
            }
          }
        },
        fail: function(err) {
          console.log(err);
          // wx.showToast({
          //   icon: "none",
          //   title: 'session_key获取失败，请重新登录！',
          // })
          return
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  wxGetUserProfile: function () {
    // 获取头像昵称等
    let _this = this
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '用户登录',
        success: (res) => {
          resolve(res)
        },
        // 失败回调
        fail: (err) => {
          reject(err)
          console.log('选择了拒绝')
        },
      })
    })
  },
  wxSilentLogin: function () {
    // 获取code
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          resolve(res.code)
          console.log('获取得到的loginres', res)
        },
        fail(err) {
          reject(err)
        },
      })
    })
  },
  wxOut: function(){
    wx.setStorage({
      key: 'userInfo', //本地缓存中指定的 key(类型：string)
      data: '', //需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
      success: () => {
        wx.setStorage({
          key: 'token', //本地缓存中指定的 key(类型：string)
          data: '', //需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
          success: () => {
            this.setData({"getUserInfo": true})
          },
          fail: (f) => {
            console.log('清空token失败====', f);
          }
        })
      },
      fail: (f2) => {
        console.log('清空缓存失败====', f2);
      }
    })
  }
  // getPhoneNumber: function (e) {
  //   var self = this
  //   if (e.detail.errMsg !== 'getPhoneNumber:ok') return
  //   wx.showLoading()
  //   wx.checkSession({
  //     success(res) {
  //       if (self.code) {
  //         //    2.访问登录凭证校验接口获取session_key
  //         wx.request({
  //           url: 'https://api.weixin.qq.com/sns/jscode2session',
  //           data: {
  //             appid: '小程序appid',
  //             secret: '小程序密钥',
  //             js_code: self.code,
  //             grant_type: 'authorization_code',
  //           },
  //           method: 'GET',
  //           header: {
  //             'content-type': 'application/json',
  //           },
  //           success: function (data) {
  //             console.log('获取到session_key啦', data)
  //             if (data.statusCode == 200) {
  //               //3. 解密
  //               wx.request({
  //                 url: '后台提供的接口',
  //                 data: {
  //                   encryptedData: e.detail.encryptedData,
  //                   iv: e.detail.iv,
  //                   sessionKey: data.data.session_key,
  //                 },
  //                 method: 'GET',
  //                 header: {
  //                   'content-type': 'application/json',
  //                 },
  //                 success: function (data) {
  //                   wx.hideLoading()
  //                   console.log('获取到的手机号是', data.data.phoneNumber)
  //                 },
  //                 fail: function (err) {
  //                   console.log(err)
  //                 },
  //               })
  //             }
  //           },
  //           fail: function (err) {
  //             console.log(err)
  //           },
  //         })
  //       } else {
  //         wx.showToast({
  //           icon: 'none',
  //           title: '授权失败，请重新授权',
  //         })
  //       }
  //     },
  //     fail() {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '登录过期，请重新登录',
  //       })
  //     },
  //   })
  // }
})