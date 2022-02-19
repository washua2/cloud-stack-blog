<template>
  <div class="uploader">
    <label class="uploader-lable">
      <input class="uploader-file" type="file" @change="upload" />
      <div class="uploader-img">
        <i v-show="!url" class="el-icon-plus uploader-icon"></i>
        <div class="uploader-img-box">
          <img class="auto-img" :src="imgUrl || url" alt="" v-show="flag" />
        </div>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: 'Uploader',
  props: {
    size: {
      type: [String, Number],
      //200KB, 单位为KB
      default: 3000
    },

    type: {
      type: Array,
      default() {
        return ['png', 'gif', 'webp', 'jpeg', 'jpg'];
      }
    },

    imgUrl: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      url: null,
      flag: false
    }
  },

  methods: {
    upload(e) {
      let self = this;
      let file = e.target.files[0];
      // 判断file是否有值
      if(!file){
        return
      }
      //判断上传图片的大小

      let size = file.size / 1024;
      if (size > this.size) {
        this.$message.error(`上传文件大小不能超过${this.size}KB`);
        return;
      }

      //判断上传文件的类型
      let type = file.type.split('/')[1];
      // 
      if (this.type.indexOf(type) === -1) {
        this.$message.error(`上传文件的类型支持${this.type.join('，')}`);
        return;
      }

      let reader = new FileReader();

      reader.onload = function () {
        // 

        self.url = this.result;

        self.$emit('upload', { base64: this.result.replace(/^data:image\/[A-Za-z]+;base64,/, ''), type });
        // 判断 是否存在url  隐藏多余的图片bug
        if (self.url !== null) {
          self.flag = true
        }
      }

      if (file) {
        reader.readAsDataURL(file);
      }

    }
  }
}
</script>

<style lang="less" scoped>
.uploader {
  width: 78px;
  height: 72px;
  overflow: hidden;
}

.uploader-lable {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}

.uploader-img {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.uploader-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: #ddd;
  z-index: 1;
}

.uploader-img-box {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auto-img {
  width: 78px;
  height: 78px;
}

.uploader-file {
  display: none;
}
</style>