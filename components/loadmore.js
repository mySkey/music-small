// components/loadmore.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal, changedPath) {
        this.setData({ _loading: newVal });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _loading: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})