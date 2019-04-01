const app = getApp()
export default class Props{
  static setPlayer(player){
    app.player = Object.assign({}, app.player, player)
    this.setData({ player: app.player })
  }
  static setPlaying(playing){
    app.player.playing = Object.assign({}, app.player.playing, playing)
    this.setData({ player: app.player })
  }
}