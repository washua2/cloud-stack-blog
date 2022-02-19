<template>
  <div>
    <div class="back">
      <div class="back-text" @click="back">
        <i class="el-icon-arrow-left text"></i>
        返回
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      back() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="less" scoped>
.back {
  height: 50px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0 10px;
  display: flex;
  align-items: center;
}
.back:hover{
  
 background-color: rgba(0, 0, 0, 0.7);
}
.back:hover .text{
  color: #fff;
}
.back:hover .back-text{
  color: #fff;
}



.back-text {
  cursor: pointer;
  color: #999;
}
</style>