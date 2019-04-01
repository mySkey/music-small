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
    musics:[
      { audios: [], page: {} },   // 推荐
      { audios: [], page: {} },   // 最热
      { audios: [], page: {} },   // 原创
      { audios: [], page: {} },   // 飙升
      { audios: [], page: {} },   // 最新
    ],
    types: ['推荐', '最热', '原创', '飙升', '最新'],
    currentType: 0,
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
        this.saveMusics({ type, page, audios })
        props.setPlayer.call(this, { i_resource, a_resource })
        props.setPlayer.call(this, { list: this.data.musics[type].audios })
      }
    })
  },
  saveMusics(data){
    let { type, page, audios } = data;
    let musics = this.data.musics
    musics[type].audios = musics[type].audios.concat(audios)
    musics[type].page = page
    this.setData({ musics })
  },
  dateFormat(t){
    return dayjs(t * 1000).format('YYYY.MM.DD')
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