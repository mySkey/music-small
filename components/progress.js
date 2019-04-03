// components/progress.js
const app = getApp()
import props from '../utils/js/props.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTime: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal, changedPath) {
        props.setPlaying.call(this, { currentTime: newVal, duration: app.audioDom.duration })
        if(!this.data.userChange){
          this.updateProgress()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    player:{},
    left: 0,
    sliderW: 14,
    userChange: false,

    swiperWidth: 0,
    swiperLeft: 0,
  }, 
  ready() {
    this.getSwiperInfo()
  },  

  /**
   * 组件的方法列表
   */
  methods: {
    getSwiperInfo(){
      const that = this;
      let query = wx.createSelectorQuery().in(this)
      query.select('.swiper').boundingClientRect(function (res) {
        //console.log(res)
        that.setData({ swiperWidth: res.width, swiperLeft: res.left })
      }).exec()
    },
    updateProgress(){
      let { currentTime, duration } = app.player.playing;
      let left = Math.floor(this.data.swiperWidth * (currentTime / duration))
      this.setData({ left })
    },
    swiperTouch(e) {
      let swiperWidth = this.data.swiperWidth
      let startX = this.data.swiperLeft
      let endX = e.touches[0].clientX
      this.setData({ left: endX - startX })
      let position = ((endX - startX) / swiperWidth) * app.audioDom.duration
      wx.seekBackgroundAudio({
        position: Math.round(position),
      })
    },
    touchStart(e) {
      this.setData({ sliderW: 18, userChange: true })
    },
    touchMove(e) {
      let swiperWidth = this.data.swiperWidth
      let sliderWidth = this.data.sliderW
      let startX = this.data.swiperLeft
      let endX = e.touches[0].clientX
      if (endX - startX <= 0) {
        this.setData({ left: 0 })
        return
      }
      if (endX - startX >= (swiperWidth - sliderWidth)) {
        this.setData({ left: swiperWidth - sliderWidth })
        return
      }
      this.setData({ left: endX - startX })
    },
    touchEnd() {
      let swiperWidth = this.data.swiperWidth
      this.setData({ sliderW: 12, userChange: false })
      //this.props.changeProgress(this.data.left / swiperWidth)
      let position = (this.data.left / swiperWidth) * app.audioDom.duration
      wx.seekBackgroundAudio({
        position: Math.round(position),
      })
    }
  }
})
