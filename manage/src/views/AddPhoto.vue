<template>
  <div>
    <back />
    <div class="photo-box">
      <div class="photo-content">
        <el-form
          :model="photoDate"
          ref="photoDate"
          label-width="100px"
          class="demo-photoDate"
        >
          <el-form-item label="用户名" prop="nickName">
            <el-input :value="data.nickName"  disabled></el-input>
          </el-form-item>
          <el-form-item label="用户头像" prop="userImg">
            <div class="img-user">
              <img :src="data.userImg" class="img" />
            </div>
          </el-form-item>

          <el-form-item label="图片" prop="photo">
            <div class="img-box">
              <Uploader :img-url="photo" @upload="upload($event, 'photo')" />
            </div>
          </el-form-item>

          <el-form-item label="图片状态" prop="status">
            <el-radio-group v-model="photoDate.status">
              <el-radio :label="0">审核</el-radio>
              <el-radio :label="1" disabled>通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('photoDate')"
              >上传图片</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Uploader from "../components/Uploader.vue";
import Back from "../components/Back.vue";
import crypto from "../utils/crypto"

export default {
  name: "addPhoto",
  components: {
    Uploader,
    Back
  },
  data() {

    return {
      photoDate: {
        photo: "",
        status: 0,
      },
      photo: "",
      data: ""
    };
  },

  created() {
    this.getPerson()

  },
  computed: {
    email() {
      return this.$store.state.email
    },

  },

  methods: {
    submitForm(formName) {
      if(this.photoDate.photo){
          this.addphoto();
      }else{
              this.$message.error("请选择添加的图片");
        
      }
    },

    //添加图片
    addphoto() {
      //获取图片信息
      let {  status } = { ...this.photoDate };
      //如果表单验证通过, 发起发布图片请求
      this.axios({
        url: "/addPhoto",
        method: "post",
        data: {
          status,
          photo: this.photoDate.photo,
          photoType: this.photoDate.photoType,
          person: this.data
        },

      })
        .then(res => {
          if (res.status === 200) {
            if (res.data.status === 3001) {
              this.$message.success(res.data.msg);
              this.$router.push("/photoList")
            } else {
              this.$message.error(res.data.msg);
            }
          }
        })
        .catch(err => {

        });
    },

    // 获取图片地址
    upload(data, key) {
      this[key] = '';
      this.photoDate[key] = data.base64;
      this.photoDate[key + "Type"] = data.type;

    },
    // 获取个人信息
    getPerson() {
      this.axios({
        url: "/getPerson",
        method: "post",
        data: {
          email: this.email || crypto.decrypt(sessionStorage.getItem("email"), "hiusahdu823bisadncdi")
        }
      }).then(res => {

        if (res.status === 200) {
          if (res.data.status === 1501) {
            this.data = res.data.data[0]
          }

        }
      }).catch(err => {

      })
    },


  }
};
</script>

<style lang="less" scoped>
/deep/ .text-box textarea {
  height: 100px;
}
.photo-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}

.photo-content {
  width: 480px;
}

.img-box {
  width: 198px;
  height: 128px;
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  align-content: center;
}
.img-user {
  width: 198px;
  height: 196px;
  border: 1px dashed #ccc;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  .img {
    width: 100%;
    height: 100%;
  }
}
</style>