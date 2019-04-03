const app = getApp()
export default class Props{
  static setPlayer(player, cb=null){
    app.player = Object.assign({}, app.player, player)
    this.setData({ player: app.player }, ()=>{
      cb && cb()
    })
  }
  static setPlaying(playing, cb=null){
    app.player.playing = Object.assign({}, app.player.playing, playing)
    this.setData({ player: app.player }, ()=>{
      cb && cb()
    })
  }
}