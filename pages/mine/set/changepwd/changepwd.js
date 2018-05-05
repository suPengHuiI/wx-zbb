Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  submit(e) {
    let data = e.detail.value, userinfo = wx.getStorageSync('userinfo');
    for (let i in data) {
      if (data[i] == '') {
        wx.showToast({
          title: '请确认信息是否完整',
          icon: 'none'
        })
      } else {
        if (data.oldPassword != userinfo.personCard) {
          wx.showToast({
            title: '请确认原密码是否正确',
            icon: 'none'
          });
          return false;
        }
        if (data.password != data.password1) {
          wx.showToast({
            title: '两次密码不一致，请重新输入',
            icon: 'none'
          });
          return false;
        }
      }
    }
    getApp().$ajax({
      httpUrl: getApp().api.resetPasswordUrl,
      data: {
        userId: userinfo.id,
        password: data.password
      }
    }).then(({ data }) => {
      wx.showToast({
        title: '密码修改成功',
        icon: 'none',
        success() {
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      })
    })
  }
})