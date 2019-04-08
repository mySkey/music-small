### 扫码预览

<div align=center><img src="http://img.22family.com/mySKey/small.jpg" /></div>

### 一、需求分析

* 基本功能

上一曲、下一曲、播放、暂停、列表播放

* 切换到别的页面播放继续

* 歌词同步

1、歌词随音乐进度更新
2、拖动歌词后出现可调节位置的控件，此时歌词滚动暂停
3、点击控件播放，关闭控件，改变进度
4、不点击，5s后关闭控件

* 进度条播放

可点击或者拖动进度条来改变歌曲进度

* 播放模式

单曲、列表、随机三种播放模式

* 倍速

可在不同倍速下播放，并且不同倍速下歌词同步


### 其中的经验：

* 1、wxs支持es4的语法
* 2、在app.json中设置"requiredBackgroundModes": ["audio"]，将开启后台播放
* 3、wx.getBackgroundAudioManager()的onEnded监听在安卓机上面不生效
* 4、不支持倍速