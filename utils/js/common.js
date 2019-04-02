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
  },
  analysis(str) {
    str = str.slice(str.indexOf('00:00.00'))
    let s = str.replace(/[\s\r\n]/g, "").split('[');
    let timeArr = [], lrcArr = [];
    for (let v of s) {
      let lrc = v.split(']')
      timeArr.push(lrc[0])
      lrcArr.push(lrc[1])
    }
    return { timeArr, lrcArr }
  },
  getAudioTime(num = 0) {
    let minute = Math.floor(num / 60).toString();
    let second = Math.floor(num % 60).toString();
    return `${minute.padStart(2, '0')} : ${second.padStart(2, '0')}`
  },
  getSecond(t) {
    let minute = Number(t.slice(0, 2))
    let second = Number(t.slice(3, 5))
    let minS = Number(t.slice(7))
    return minS > 100 ? (minute * 60 + second + minS / 1000) : (minute * 60 + second + minS / 100)
  },
}