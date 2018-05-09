//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    community: [],
    scrollTop: 0,
    interval: true,
    pageIndex: 1,
    pageCount: '',
    show: false,
    current: 0,
    showSelect: true,
    currentTab: 0,
    communityCount: 0,
    nav: [
      {
        item: '全部',
        index: -1
      },
      {
        item: '党员大会',
        index: 2
      },
      {
        item: '支委会',
        index: 1
      },
      {
        item: '党小组会',
        index: 3
      },
      {
        item: '党课',
        index: 0
      }
    ]
  },
  //点击对应切换调取对应的数据
  changeNav(e) {
    let currentTab = e.currentTarget.dataset.index;
    this.setData({
      currentTab: currentTab
    });
    this.goSelect();
    this.getPostings(currentTab);
  },
  getListData(){
    this.getPostings(this.data.currentTab);
  },
  onLoad: function (options) {
    this.getData(20, -1, -1);
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight,
          userID: wx.getStorageSync('userInfo').orgID
        });
      }
    });
    // 月末25号提示未完成任务
    if (new Date().getDate() >= 25) this.getUnfinished();
    if (new Date().getDate() >= 1 && new Date().getDate() <= 5) wx.showModal({
      title: '请及时添加近期工作',
      content: '',
      showCancel: false,
      confirmText: '我知道了'
    })
  },
  goSelect(){
    this.setData({
      showSelect: !this.data.showSelect
    })
  },
  // 分享
  onShareAppMessage: function (res) {
    let ctx = this, actId = res.target.dataset.actid;
    return {
      title: '鼓楼党建e生活',
      path: `/pages/detail/detail?cid=${actId}`,
      success: function (res) {
        // ctx.userDo(actId, '0')
      },
      fail: function (res) {
      }
    }
  },
  //获取未完成工作
  getUnfinished() {
    getApp().$ajax({
      httpUrl: getApp().api.getUnfinishedUrl,
      data: {
        orgID: this.data.userID
      }
    }).then(({ data }) => {
      let newList = [];
      if (data.state == 0) {
        if (data.orgList && data.orgList.length >= 10) newList = data.orgList.slice(0, 10);
        this.setData({
          Unfinished: data.content,
          UnfinishedLists: newList,
          showUnfinished: true
        })
      }
      wx.hideLoading();
    })
  },
  hideUnfinished() {
    this.setData({
      showUnfinished: false
    })
  },
  //获取数据方法
  getData(pageNub, cType, meetingType) {
    getApp().$ajax({
      httpUrl: getApp().api.getPostingsUrl,
      data: {
        pageNumber: pageNub,
        cType: cType,
        meetingType: meetingType
      }
    }).then(({ data }) => {
      wx.stopPullDownRefresh();
      for (let i = 0; i < data.community.length; i++) {
        data.community[i].type = ['党课', '支委会', '党员大会', '党小组会'];
      };
      this.setData({
        community: data.community,
        communityCount: data.communityCount,
        communityTop: data.communityTop
      });
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    let currentTab = this.data.currentTab;
    this.getPostings(currentTab);
  },
  //上拉加载更多
  onReachBottom: function () {
    let currentTab = this.data.currentTab;
    if (this.data.communityCount % 20 != 0) {//判断页码总数是否能整除
      let pageCount = Math.ceil(this.data.communityCount / 20);
      this.setData({
        pageCount: pageCount
      })
    } else {
      let pageCount = this.data.communityCount / 20;
      this.setData({
        pageCount: pageCount
      })
    };
    this.data.pageIndex++;
    if (currentTab == 0) {
      this.reachData(20, this.data.pageIndex, -1, -1)
    } else if (currentTab == 1) {//党员大会
      this.reachData(20, this.data.pageIndex, 0, 2)
    } else if (currentTab == 2) {//党委会
      this.reachData(20, this.data.pageIndex, 0, 1)
    } else if (currentTab == 3) {//党小组会
      this.reachData(20, this.data.pageIndex, 0, 3)
    } else {//党课
      this.reachData(20, this.data.pageIndex, 0, 0)
    }
  },
  //上拉加在更多
  reachData: function (pageNumber, pageIndex, cType, meetingType) {
    //判断页码总数减去当前页码是否还存在下一页
    if (this.data.pageCount - this.data.pageIndex >= 0) {
      getApp().$ajax({
        httpUrl: getApp().api.getMorePostingUrl,
        data: {
          pageNumber: pageNumber,
          pageIndex: pageIndex,
          cType: cType,
          meetingType: meetingType
        }
      }).then(({ data }) => {
        wx.stopPullDownRefresh();
        //区分模版是在详情页面调用还是主页
        for (let i = 0; i < data.community.length; i++) {
          data.community[i].isDetail = true;
        }
        const publishs = [...this.data.community, ...data.community];
        this.setData({
          community: publishs
        })
        wx.hideLoading();
      })
    }
  },
  // 点击对应切换调取对应的数据
  getPostings(currentTab) {
    // 获取全部帖子
    if (currentTab == 0) {
      this.getData(20, -1, -1)
    } else if (currentTab == 1) {//党员大会
      this.getData(20, 0, 2)
    } else if (currentTab == 2) {//支委会
      this.getData(20, 0, 1)
    } else if (currentTab == 3) {//党小组会
      this.getData(20, 0, 3)
    } else {//党课
      this.getData(20, 0, 0)
    }
  },
  //点击+显示发帖
  onAnimate() {
    this.setData({
      show: !this.data.show
    })
  },
  //发帖
  goPublish(e) {
    let posttype = e.currentTarget.dataset.posttype;
    wx.navigateTo({
      url: '/pages/index/publish/publish',
      success: (res) => {
        this.onAnimate();
      }
    })
  },
  // 点击进入详情
  goDetail(e) {
    let cType = e.currentTarget.dataset.type,
      cID = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '/pages/home/detail/detail?cType=' + cType + '&cID=' + cID
    })
  },
  // 获取组件传递id
  toIndexActid(e) {
    this.setData({
      actID: e.detail
    })
  },
  // 点击头像回到组织详情
  gopartydetail(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/databases/detail/detail?orgID=' + data.orgid + '&higherOrgID=' + data.higherorgid
    })
  },
  // 搜索
  showSearch() {
    wx.navigateTo({
      url: '/pages/home/searchList/searchList'
    })
  }
})
