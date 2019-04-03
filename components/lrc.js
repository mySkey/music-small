// components/lrc.js
const app = getApp()
import props from '../utils/js/props.js'
import common from '../utils/js/common.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTime: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal, changedPath) {
        if (app.player.playing.lrcArr.length > 0){
          props.setPlaying.call(this, { currentTime: newVal })
          this.getCurrentLrc()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    player:{},
    currentLrc: 0,
    currentWidth: 0,
    listTop: 0,
    useTime: 1,
    userChange: false,
    changeTo: 0
  },
  attached() {
    //console.log(app.player)
    this.setData({ player: app.player })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCurrentLrc() {
      let player = app.player, audio = app.player.playing;
      let { currentTime } = audio
      let currentLrc = 0;
      audio.timeArr.forEach((v, k) => {
        if (currentTime > this.getSecond(v)) {
          currentLrc = k
        }
      })

      // 更新当前歌词
      if (currentLrc !== this.data.currentLrc) {
        this.setData({ currentLrc, currentWidth: 0 }, () => {
          this.getCurrentWidth((currentWidth)=>{
            if (currentLrc < audio.timeArr.length - 1) {
              let useTime = this.getSecond(audio.timeArr[currentLrc + 1]) - this.getSecond(audio.timeArr[currentLrc])
              // 根据当前的倍速来决定时间
              useTime = useTime / player.playbackRate
              if (useTime > 10) {
                this.setData({ useTime: 10 })
                return
              }
              this.setData({ useTime, currentWidth })
            }
          })
        })
        if (!this.data.userChange) {
          this.scrollLrc(currentLrc)
        }
      } else {
        this.getCurrentWidth((currentWidth)=>{
          this.setData({ currentWidth })
        })
      }
    },
    getCurrentWidth(cb){
      let query = wx.createSelectorQuery().in(this)
      query.select('.lrcItemShow').boundingClientRect(function (res) {
        //console.log(res.width)
        if(res){
          cb && cb(res.width)
        }
      }).exec()
    },
    getSecond(t) {
      let minute = Number(t.slice(0, 2))
      let second = Number(t.slice(3, 5))
      let minS = Number(t.slice(7))
      return minS > 100 ? (minute * 60 + second + minS / 1000) : (minute * 60 + second + minS / 100)
    },
    // 歌词滚动
    scrollLrc(currentLrc) {
      if (currentLrc) {
        let listTop = currentLrc * 32
        this.setData({ listTop })
      }
    },
    // 滑动歌词调整进度
    handleMove() {
      if(this.data.userChange){
        let query = wx.createSelectorQuery().in(this)
        query.select('.lrcList').boundingClientRect((res)=>{
          //console.log(res.top / 32)
          let currentLrc = (-Math.round(res.top / 32)) + 3
          let time = app.player.playing.timeArr[currentLrc]
          let currentTime = Math.ceil(common.getSecond(time))
          this.setData({ changeTo: currentTime })
        }).exec()
      }
    },
    changeUserStatus(){
      clearTimeout(this.timer)
      this.setData({ userChange: true })
      this.timer = setTimeout(() => {
        this.setData({ userChange: false })
      }, 5000)
    },
    changeToLrc() {
      this.setData({ userChange: false }, () => {
        wx.seekBackgroundAudio({
          position: this.data.changeTo,
        })
      })
    }
  }
})
