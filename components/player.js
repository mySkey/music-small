// components/player.js
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
        if (newVal>0) {
          props.setPlayer.call(this, app.player)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    player:{}
  },
  attached(){

  },
  /**
   * 组件的方法列表
   */
  methods: {
    pauseAudio() {
      app.audioDom.pause()
      props.setPlayer.call(this, { status: 2 })
      this.triggerEvent('updatePlayer')
    },
    playAudio() {
      app.audioDom.play()
      props.setPlayer.call(this, { status: 1 })
      this.triggerEvent('updatePlayer')
    },
    playLast() {
      let current_music = app.player.current_music - 1
      if (current_music < 0) {
        current_music = app.player.list.length - 1
      }
      this.playCurrent(current_music)
    },
    playNext() {
      let current_music = app.player.current_music + 1
      if (current_music >= app.player.list.length) {
        current_music = 0
      }
      this.playCurrent(current_music)
    },
    playCurrent(current_music) {
      props.setPlayer.call(this, { current_music, status: 1 })
      props.setPlaying.call(this, app.player.list[current_music], ()=>{
        let audioDom = app.audioDom
        audioDom.title = app.player.playing.name
        audioDom.src = app.player.a_resource + app.player.playing.url
        audioDom.coverImgUrl = app.player.i_resource + app.player.playing.cover + '-ph'
        audioDom.play()
      }) 
      this.triggerEvent('updatePlayer')
    },
    closePlayer() {
      props.setPlayer.call(this, { global_show: 0 })
    },
    toDtail() {
      let { id } = app.player.playing
      let url = `/pages/music/detail?id=${id}`
      wx.navigateTo({
        url
      })
    }
  }
})
