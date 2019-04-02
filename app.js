//app.js
App({
  onLaunch: function () {
   
  },
  player: {
    list: [],
    current_music: 0,
    mode: 0,            // 0 单曲    1 顺序   2 随机
    status: 0,          // 0 未播放  1 播放   2 暂停中  3 已结束
    playbackRate: 1,    // 倍速
    a_resource: '',
    i_resource: '',
    global_show: 0,     // 全局显示  0 不显示 1 显示
    playing: {
      id: '',
      name: '',
      cover: '',
      url: '',
      singer: {
        avatar: '',
        name: ''
      },
      currentTime: 0,
      duration: 0,
      timeArr: [],
      lrcArr: []
    }
  },
  audioDom: wx.createInnerAudioContext()
})