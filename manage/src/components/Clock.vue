<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__lightSpeedInLeft  "
      leave-active-class="animate__animated animate__backOutDown animate__faster	500ms"
    >
      <div class="time" v-show="flag">{{ timestr }}</div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timestr: "",
      flag:false
    }
  },
  mounted() {
    this.start()
  },
  methods: {
    getTime() {
      //获取系统当前的年、月、日、小时、分钟、毫秒
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minutes = date.getMinutes();
      let second = date.getSeconds();
      this.timestr = year + "年" + month + "月" + day + "日" + this.check(hour) + " : " + minutes + " : " + second
      this.flag=true
    },
    check(val) {
      if (val < 10) {
        return ("0" + val);
      }
      else {
        return (val);
      }
    },
    start() {
      let that = this
      window.setInterval(that.getTime, 1000)//单位是毫秒
    }



  }
}
</script>

<style lang="less" scoped>
.time {
  width: 200px;
  height: 200px;
  color: #fff;
  font-size: 25px;
  line-height: 50px;
}
</style>