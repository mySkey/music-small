export default {
  toast(title, duration = 1500){
    wx.showToast({
      title,
      icon: 'none',
      duration
    })
  },
  confirm(content, cb){
    wx.showModal({
      title: '温馨提示',
      content,
      success(res) {
        if (res.confirm) {
          cb && cb()
        }
      }
    })
  },
  showLoading(title){
    wx.showLoading({
      title
    })
  },
  hideLoading(){
    wx.hideLoading()
  }
}