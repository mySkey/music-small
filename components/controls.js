// components/controls.js
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
        //props.setPlayer.call(this, { status: app.player.status })
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
    props.setPlayer.call(this, app.player)
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
