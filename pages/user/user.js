Page({
  data: {
    contact_tel: "",
    show_customer_service: 0,
    coupon_new_add: 0,
    favorite_new_add: 45
  },
  //跳转别的路由
  toMiniProgram(){
    wx.navigateToMiniProgram({
      appId: 'wxfe268b762b926462', 
    
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功  
        console.log(" 嘎嘎嘎")
      }
    }) 
  },
  onLoad: function(e) {
    getApp().page.onLoad(this, e);
    this.loadData1()
    this.loadGoodsList()
  },
  loadGoodsList: function() { // 获取收藏产品
    var o = this;
    getApp().request({
      url: getApp().api.user.favorite_list,
      data: {
        page: 1
      },
      complete: function(t) {
        console.log(t)
        o.setData({
          favorite_new_add: t.data.data.row_count
        });
      }
    });
  },
  loadData1: function() { // 获取优惠券数量
    var a = this;
    getApp().request({
      url: getApp().api.coupon.index,
      data: {
        status: 0
      },
      success: function(t) {
        0 == t.code && a.setData({
          coupon_new_add: t.data.list.length
        });
      },
    });
  },
  loadData: function(e) {
    var t = this;
    t.setData({
      store: getApp().core.getStorageSync(getApp().const.STORE)
    }), getApp().request({
      url: getApp().api.user.index,
      success: function(o) {
        if (0 == o.code) {
          if ("my" == t.data.__platform) o.data.menus.forEach(function(e, t, a) {
            "bangding" === e.id && o.data.menus.splice(t, 1, 0);
          });
          t.setData(o.data), getApp().core.setStorageSync(getApp().const.PAGES_USER_USER, o.data),
            getApp().core.setStorageSync(getApp().const.SHARE_SETTING, o.data.share_setting),
            getApp().core.setStorageSync(getApp().const.USER_INFO, o.data.user_info);
        }
      }
    });
  },
  onReady: function(e) {
    getApp().page.onReady(this);
  },
  onShow: function(e) {
    getApp().page.onShow(this);
    this.loadData();
  },
  callTel: function(e) {
    var t = e.currentTarget.dataset.tel;
    getApp().core.makePhoneCall({
      phoneNumber: t
    });
  },
  apply: function(t) {
    var a = getApp().core.getStorageSync(getApp().const.SHARE_SETTING),
      o = getApp().getUser();
    1 == a.share_condition ? getApp().core.navigateTo({
      url: "/pages/add-share/index"
    }) : 0 != a.share_condition && 2 != a.share_condition || (0 == o.is_distributor ? getApp().core.showModal({
      title: "申请成为" + this.data.store.share_custom_data.words.share_name.name,
      content: "是否申请？",
      success: function(e) {
        e.confirm && (getApp().core.showLoading({
          title: "正在加载",
          mask: !0
        }), getApp().request({
          url: getApp().api.share.join,
          method: "POST",
          data: {
            form_id: t.detail.formId
          },
          success: function(e) {
            0 == e.code && (0 == a.share_condition ? (o.is_distributor = 2, getApp().core.navigateTo({
              url: "/pages/add-share/index"
            })) : (o.is_distributor = 1, getApp().core.navigateTo({
              url: "/pages/share/index"
            })), getApp().core.setStorageSync(getApp().const.USER_INFO, o));
          },
          complete: function() {
            getApp().core.hideLoading();
          }
        }));
      }
    }) : getApp().core.navigateTo({
      url: "/pages/add-share/index"
    }));
  },
  verify: function(e) {
    getApp().core.scanCode({
      onlyFromCamera: !1,
      success: function(e) {
        getApp().core.navigateTo({
          url: "/" + e.path
        });
      },
      fail: function(e) {
        getApp().core.showToast({
          title: "失败"
        });
      }
    });
  },
  member: function() {
    getApp().core.navigateTo({
      url: "/pages/member/member"
    });
  },
  integral_mall: function(e) {
    var t, a;
    getApp().permission_list && getApp().permission_list.length && (t = getApp().permission_list,
      a = "integralmall", -1 != ("," + t.join(",") + ",").indexOf("," + a + ",")) && getApp().core.navigateTo({
      url: "/pages/integral-mall/index/index"
    });
  },
  clearCache: function() {
    wx.showActionSheet({
      itemList: ["清除缓存"],
      success: function(e) {
        if (0 === e.tapIndex) {
          wx.showLoading({
            title: "清除中..."
          });
          getApp().getStoreData();
          setInterval(function() {
            wx.hideLoading();
          }, 1e3);
        }
      }
    });
  },
  completemessage: function(e) {
    var t = this.data.__wxapp_img.cell,
      a = [t.cell_1.url, t.cell_2.url, t.cell_3.url, t.cell_4.url, t.cell_5.url];
    getApp().core.previewImage({
      current: a[0],
      urls: a
    });
  }
});