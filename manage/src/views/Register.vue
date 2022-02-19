<template>
  <div class="register">
    <Animation/>
    <transition
      enter-active-class="animate__animated animate__swing  "
      leave-active-class="animate__animated animate__backOutDown animate__faster	500ms"
    >
      <div class="register-box" v-show="isShow">
        <div class="r-title">
          <span class="welcome">欢迎注册</span>
          <span class="sub-title">后台管理系统</span>
        </div>

        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户头像" prop="userImg">
            <div class="img-box">
              <Upload
                :img-url="userImg"
                @upload="upload($event, 'userImg')"
                class="img-auto"
              />
            </div>
          </el-form-item>
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
          <el-form-item label="密码" prop="pass" :required="true">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              placeholder="输入6-16位密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" :required="true">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              placeholder="输入确认密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" :required="true">
            <div class="code">
              <el-input
                placeholder="输入6位数字"
                v-model="ruleForm.code"
              ></el-input>
              <el-button @click="sendCode" :disabled="isSend" class="v-code">{{
                codeText
              }}</el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="register('ruleForm')"
              >提交</el-button
            >
            <el-button @click="goLogin">已有账号</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
import Upload from "../components/Upload.vue";
import crypto from "../utils/crypto"
import Animation from '../components/Animation.vue';
export default {
  name: 'Home',
  components: {
    Upload,
    Animation
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        //定义验证密码的正则
        let passwordReg = /^[A-Za-z]\w{5,15}$/;
        if (passwordReg.test(value)) {
          callback();
        } else {
          callback(new Error("密码支持数字字母_组合且以字母开头"));
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var code = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else {
        let codeReg = /^\d{6}$/;
        if (codeReg.test(value)) {
          callback();
        } else {
          callback(new Error("验证格式不正确"));
        }
      }
    };
    return {
      ruleForm: {
        nickName: "",
        pass: '',
        checkPass: '',
        email: '',
        code: ""
      },
      rules: {
        nickName: [
          { validator: validatenickName, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        code: [
          {
            validator: code, trigger: 'blur'
          }
        ]
      },
      codeText: "发送验证码",
      isSend: false,
      isShow: false,
      codeId: "",
      userImg: "",
      messageDate: {
        nickName: "",
        userImg: "",
        status: 0,
        desc: "",
      },
    };
  },
  methods: {
    // 提交输入框内容
    register(formName) {
      this.$refs[formName].validate((valid) => {
        //如果表单验证通过
        if (valid) {

          if (!this.messageDate.userImg) {
            this.$message({
              message: '请选择头像',
              type: 'error'
            });
            return
          }

          //发起注册请求
          this.axios({
            method: 'post',
            url: '/register',
            data: {
              password: this.ruleForm.pass,
              email: this.ruleForm.email,
              codeId: this.codeId,
              code: this.ruleForm.code,
              nickName: this.ruleForm.nickName,
              photo: this.messageDate.userImg,
              photoType: this.messageDate.userImgType
            }
          }).then(res => {
            if (res.status === 200) {
              if (res.data.status === 1000) {
                // 存储当前用户邮箱
                let email = crypto.encrypt(this.ruleForm.email, "hiusahdu823bisadncdi")
                this.$store.commit("addEmail", email)
                // 跳转登录页面
                this.$router.push("/login")

                this.$message({
                  message: `恭喜你，${res.data.msg}`,
                  type: 'success'
                });

              } else {
                this.$message({
                  message: `很抱歉，${res.data.msg}`,
                  type: 'error'
                });
              }
            }
          }).catch(err => {
          })
        }
      });
    },
    // 重置输入框内容
    goLogin() {
      this.$router.push("/login")
    },
    sendCode() {
      let emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (this.ruleForm.email === "") {
        this.$message({
          message: "请输入正确邮箱后进行注册",
          type: 'error'
        });

      } else if (!emailReg.test(this.ruleForm.email)) {
        this.$message({
          message: "请修改正确邮箱后进行注册",
          type: 'error'
        });

      } else {
        // 发送验证码倒计时
        let num = 60
        // 发送验证码按钮点击状态
        this.isSend = true
        let timer = setInterval(() => {
          if (num === 0) {
            clearInterval(timer)
            this.isSend = false
            this.codeText = "发送验证码"
          } else {
            num--
            this.codeText = `${num}s发送验证码`
          }
        }, 1000)

        //发起验证码请求
        this.axios({
          method: 'post',
          url: '/sendCode',
          data: {
            email: this.ruleForm.email,
          }
        }).then(res => {
          if (res.status === 200) {
            if (res.data.status === 666) {
              this.codeId = res.data.codeId
              this.$message({
                message: `恭喜你，${res.data.msg}`,
                type: 'success'
              });
            } else {
              this.$message({
                message: `很抱歉，${res.data.msg}`,
                type: 'error'
              });
            }
          }
        }).catch(err => {
        })
      }


    },
    // 
    upload(data, key) {
      this[key] = '';
      this.messageDate[key] = data.base64;
      this.messageDate[key + "Type"] = data.type;

    },
  },
  mounted() {
    this.isShow = true
  }
}
</script>
<style lang="less" scoped>
.register {
   min-height: 100vh;
  .register-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 600px;
    height: 550px;
    padding: 0 30px;
    box-sizing: border-box;
    margin: auto;
     background-color: rgba(255, 255, 255, .7);
    .r-title {
      margin: 20px 0 40px;
      text-align: center;
      .sub-title {
        color: #999;
        margin-left: 20px;
      }

      .welcome {
        color: #2a66ae;
        font-size: 28px;
      }
    }
    /deep/ .el-input__inner {
      padding-right: 25px;
    }

    /deep/ .el-form-item__label {
      text-align: start;
    }
    /deep/ .el-form-item:first-child {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    /deep/ .el-form-item:first-child .el-form-item__error {
      position: relative;
      top: -40px;
      left: 20px;
    }
    .img-box {
      position: relative;
      left: -80px;
      width: 74px;
      height: 74px;
      border-radius: 50%;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .code {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .v-code {
      box-sizing: content-box;
      margin-left: 10px;
    }
    /deep/.el-button {
      width: 225px;
    }
  }
}
</style>
