// pages/music/detail.js
import props from '../../utils/js/props.js'
import common from '../../utils/js/common.js'
import ajax from '../../utils/js/ajax.js'
const app = getApp()
let audioDom = app.audioDom;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    player:{},
    id: '',
    audioDom:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || 1
    if (id == app.player.playing.id){
      this.setData({ id }, ()=>{
        this.updateLrc()
      })
    }else{
      wx.stopBackgroundAudio()
      this.setData({ id: options.id || 1 }, () => {
        this.getDetail()
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    props.setPlayer.call(this, app.player)
    this.audioWatch()
  },

  getDetail() {
    ajax.get('audio/detail', { id: this.data.id }).then(res => {
      if (res.code === 0) {
        let { a_resource, i_resource } = res.data;
        let { lrc, id, url, cover, singer, name } = res.data.audio
        let { timeArr, lrcArr } = common.analysis(lrc)
        props.setPlaying.call(this, { id, timeArr, lrcArr, url, singer, name, cover })
        props.setPlayer.call(this, { i_resource, a_resource, global_show: 1 })

        this.playAudio()
      }
    })
  },
  updateLrc() {
    ajax.get('lrc', { id: this.data.id }).then(res => {
      if (res.code === 0) {
        let lrc = res.data.lrc
        let { timeArr, lrcArr } = common.analysis(lrc)
        props.setPlaying.call(this, { timeArr, lrcArr })
      }
    })
  },
  audioWatch(){
    let audioDom = app.audioDom
    audioDom.onPlay(() => {
      props.setPlayer.call(this, { status: 1 })
      props.setPlaying.call(this, { duration: audioDom })
    })
    audioDom.onTimeUpdate(() => {
      props.setPlayer.call(this, { status: 1 })
      props.setPlaying.call(this, { currentTime: audioDom.currentTime })
    })
    audioDom.onEnded(()=>{
      let player = app.player, playing = app.player.playing;
      let mode = app.player.mode;
      switch (mode) {  // 0 单曲    1 顺序   2 随机
        case 0:
          wx.playBackgroundAudio({
            dataUrl: player.a_resource + playing.url,
            title: playing.name,
            coverImgUrl: player.i_resource + playing.cover
          })
          break;
        case 1:
          if (player.list.length > 0) {
            let current_music = player.current_music + 1
            if (current_music >= player.list.length) {
              current_music = 0;
            }
            wx.playBackgroundAudio({
              dataUrl: player.a_resource + player.list[current_music].url,
              title: player.list[current_music].name,
              coverImgUrl: player.i_resource + player.list[current_music].cover
            })
            props.setPlayer.call(this, { current_music })
            return
          }
          app.audioDom.pause()
          break;
        case 2:
          if (player.list.length > 0) {
            let current_music = Math.floor(Math.random() * player.list.length)
            wx.playBackgroundAudio({
              dataUrl: player.a_resource + player.list[current_music].url,
              title: player.list[current_music].name,
              coverImgUrl: player.i_resource + player.list[current_music].cover
            })
            props.setPlayer.call(this, { current_music })
            return
          }
          app.audioDom.pause()
          break;
        default:
          app.audioDom.pause()
      }
    })
  },
  playAudio(){
    let audioDom = app.audioDom
    wx.playBackgroundAudio({
      title: app.player.playing.name,
      coverImgUrl: app.player.i_resource + app.player.playing.cover + '-cover',
      dataUrl: app.player.a_resource + app.player.playing.url // wepy 全局存储音频链接变量
    })
    this.audioWatch()
  },
  playLast() {
    let current_music = app.player.current_music - 1
    if (current_music < 0) {
      current_music = app.player.list.length - 1
    }
    props.setPlayer.call(this, { current_music })
    this.setData({ current_music }, () => {
      let id = app.player.list[current_music].id
      this.setData({ id }, () => this.getDetail())
    })
  },
  playNext() {
    let current_music = app.player.current_music + 1
    if (current_music >= app.player.list.length) {
      current_music = 0
    }
    props.setPlayer.call(this, { current_music })
    this.setData({ current_music }, () => {
      let id = app.player.list[current_music].id
      this.setData({ id }, () => this.getDetail())
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})