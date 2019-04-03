// components/controls.js
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
        props.setPlaying.call(this, { currentTime: newVal, duration: app.audioDom.duration })
        //props.setPlayer.call(this, { status: app.player.status })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    player:{},
  },
  attached(){
    props.setPlayer.call(this, app.player)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    pauseAudio() {
      app.audioDom.pause()
      props.setPlayer.call(this, { status: 2 })
    },
    palyAudio() {
      app.audioDom.play()
      props.setPlayer.call(this, { status: 1 })
    },
    playLast() {
      if (this.data.player.list.length > 0) {
        this.triggerEvent('playLast')
      }
    },
    playNext() {
      if (this.data.player.list.length > 0) {
        this.triggerEvent('playNext')
      }
    },
    changeMode() {
      let mode = this.data.player.mode + 1
      if (mode > 2) {
        mode = 0
      }
      props.setPlayer.call(this, { mode })
    },
    changeRate() {
      common.toast('小程序不支持倍速功能！')
      return
      let playbackRate = this.data.player.playbackRate + 0.25
      if (playbackRate > 2) playbackRate = 0.5
      props.setPlayer(this, { playbackRate })
      global.audioDom.playbackRate = playbackRate;
    },
    progressTouch() {
      this.setState({ userChange: true })
    },
    changeProgress(radio) {
      let currentTime = Math.floor(radio * this.props.audio.duration)
      global.audioDom.currentTime = currentTime
      this.props.setCurrentTime(currentTime)
      this.setState({ userChange: false })
    }
  }
})
