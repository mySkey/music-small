// pages/music/list.js
const app = getApp()
const dayjs = require('../../utils/js/dayjs.js')
import ajax from '../../utils/js/ajax.js'
import props from '../../utils/js/props.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    player:{},
    musics:[
      { audios: [], page: {} },   // 推荐
      { audios: [], page: {} },   // 最热
      { audios: [], page: {} },   // 原创
      { audios: [], page: {} },   // 飙升
      { audios: [], page: {} },   // 最新
    ],
    types: ['推荐', '最热', '原创', '飙升', '最新'],
    currentType: 0,
    swiperHeight: 0,
    startX: 0,
    endX: 0,
    lineWidth: 0,
    lineLeft: 0,
    loadingArr: [0, 0, 0, 0, 0],
    p: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
    this.updatePlayer()
  },
  updatePlayer(){
    props.setPlayer.call(this, app.player)
  },
  getList(){
    const type = this.data.currentType;
    let loadingArr = this.data.loadingArr
    loadingArr[type] = 1
    this.setData({ loadingArr })
    ajax.get('audio', { type, p: this.data.p }).then(res => {
      loadingArr[type] = 0
      this.setData({ loadingArr })
      if (res.code === 0) {
        let { audios, i_resource, a_resource, page } = res.data
        this.saveMusics({ type, page, audios }, ()=>{
          this.getSwiperHeight((swiperHeight) => this.setData({ swiperHeight }))
        })
        props.setPlayer.call(this, { i_resource, a_resource })
        props.setPlayer.call(this, { list: this.data.musics[type].audios })
      }
    })
  },
  saveMusics(data, cb){
    let { type, page, audios } = data;
    let musics = this.data.musics
    musics[type].audios = musics[type].audios.concat(audios)
    musics[type].page = page
    this.setData({ musics }, ()=>{
      cb && cb()
    })
  },
  dateFormat(t){
    return dayjs(t * 1000).format('YYYY.MM.DD')
  },
  handleChangeIndex(e) {
    let currentType = e.detail.current
    let p = this.data.musics[currentType].page.p || 1
    props.setPlayer.call(this, { list: this.data.musics[currentType].audios })
    //console.log(app.player.list)
    this.setData({ p, currentType }, () => {
      if (this.data.musics[currentType].audios.length === 0) {
        this.getList()
      }
      this.getSwiperHeight((swiperHeight) => this.setData({ swiperHeight }))
    })
  },
  getSwiperHeight(cb) {
    var query = wx.createSelectorQuery().in(this)
    query.select('.swiperShow').boundingClientRect(function (res) {
      cb && cb(res.height)
    }).exec()
  },
  toDetail(event){
    let { e, i } = event.currentTarget.dataset
    props.setPlayer.call(this, { current_music: i })
    wx.navigateTo({
      url: `/pages/music/detail?id=${e.id}`
    })
  },
  handleTouchStart(e) {
    let startX = e.touches[0].clientX
    this.setData({ startX })
  },
  handleTouchMove(e) {
    let endX = e.touches[0].clientX
    if (endX - this.data.startX > 0) {
      this.setData({ lineLeft: (endX - this.data.startX) / 10, lineWidth: (endX - this.data.startX) / 10 })
    } else {
      this.setData({ lineWidth: (this.data.startX - endX) / 10 })
    }
  },
  handleTouchEnd(e) {
    this.setData({ lineWidth: 0, lineLeft: 0 })
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
    let currentType = this.data.currentType
    if (this.data.loadingArr[currentType] !== 0) return
    if (this.data.musics[currentType].page.p >= this.data.musics[currentType].page.total_page) {
      let loadingArr = this.data.loadingArr
      loadingArr[currentType] = 2
      this.setData({ loadingArr })
      return
    }
    let p = this.data.musics[currentType].page.p + 1
    this.setData({ p }, ()=>{
      this.getList()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})