<template>
  <div class="text-box">
    <transition
      enter-active-class="animate__animated animate__zoomInLeft"
      leave-active-class="animate__animated animate__backOutDown animate__faster	2000ms"
    >
      <div class="text" v-show="flag">欢迎来到后台管理系统</div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: false
    }
  },
  mounted() {
    this.flag = true
  }
}
</script>

<style lang="less" scoped>
.text-box {
  position: relative;
  width: 100%;
  height: 100%;
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 60px;
    font-weight: bold;
  }
}
</style>