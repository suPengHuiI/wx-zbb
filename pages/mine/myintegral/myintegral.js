// pages/mine/myintegral/myintegral.js
const util = require('../../../utils/util.js');
const date = new Date();
Page({
  data: {
    date: util.formatTime(date).substring(0, 10),
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
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  changeGift(){
    wx.navigateTo({
      url: '/pages/mine/myintegral/gift/gift',
    })
  }
})