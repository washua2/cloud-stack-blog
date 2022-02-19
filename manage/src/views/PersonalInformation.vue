<template>
  <div>
    <back />
    <div class="personal-box">
      <div class="personal-content">
        <el-form
          :model="personalDate"
          :rules="rules"
          ref="personalDate"
          label-width="100px"
          class="demo-personalDate"
        >
          <el-form-item label="昵称" prop="nickName" :required="true">
            <el-input
              placeholder="输入正确的昵称"
              v-model="ruleForm.nickName"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="邮箱"
            :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              {
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              placeholder="输入正确的邮箱地址"
              v-model="ruleForm.email"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户头像" prop="photo">
            <div class="img-box">
              <img
                :src="personalDate.userImg"
                alt=""
                v-show="personalPhoto.photo === ''"
                class="auto-img"
              />
              <Uploader :img-url="photo" @upload="upload($event, 'photo')" />
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('personalDate')"
              >修改个人信息</el-button
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
  name: "TypeList",
  components: {
    Uploader,
    Back
  },
  data() {
    var validatenickName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('昵称不能为空'));
      }
      let nickNameReg = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,8}$/;
      if (nickNameReg.test(value)) {
        callback();
      } else {
        callback(new Error("昵称格式不正确"));
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'));
      }
      let emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (emailReg.test(value)) {
        callback();
      } else {
        callback(new Error("邮箱格式不正确"));
      }
    };

    return {
      ruleForm: {
        nickName: "",
        email: '',
      },
      rules: {
        nickName: [
          { validator: validatenickName, trigger: 'blur' }
        ],

        email: [
          { validator: validateEmail, trigger: 'blur' }
        ]

      },
      personalDate: {

      },
      personalPhoto: {
        photo: ""
      },
      photo: "",
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

      this.$refs[formName].validate((valid) => {
        if (valid) {

          //编辑个人信息
          this.eidtPersonal();
        }
      });
    },

    //编辑个人信息
    eidtPersonal() {
      //如果表单验证通过, 发起发布个人信息请求
      this.axios({
        url: "/modifyPersonal",
        method: "post",
        data: {
          photo: this.personalPhoto.photo,
          photoType: this.personalPhoto.photoType,
          person: this.personalDate,
          nickName:this.ruleForm.nickName,
          email:this.ruleForm.email
        },

      })
        .then(res => {
          if (res.status === 200) {
            if (res.data.status === 9996) {
              this.$message.success(res.data.msg);
                this.getPerson()
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
      this.personalPhoto[key] = data.base64;
      this.personalPhoto[key + "Type"] = data.type;

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
            this.personalDate = res.data.data[0]
            this.ruleForm.nickName = this.personalDate.nickName
            this.ruleForm.email = this.personalDate.email
            // 
            this.$store.commit("getPersonalData",this.personalDate)
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
.personal-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}

.personal-content {
  width: 480px;
}

.img-box {
  position: relative;
  width: 180px;
  height: 180px;
  margin-bottom: 30px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-content: center;
  .auto-img {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }
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