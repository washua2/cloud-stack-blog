<template>
  <div class="login">
    <Animation/>
    <transition
      enter-active-class="animate__animated animate__swing  "
      leave-active-class="animate__animated animate__backOutDown animate__faster	500ms"
    >
      <div class="login-box" v-show="isShow">
        <div class="r-title">
          <span class="welcome">欢迎登录</span>
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

          <el-form-item>
            <el-button type="primary" @click="login('ruleForm')"
              >登录</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="footer">
          <div class="left" @click="goRegister">没有账号?去注册</div>
          <div class="right" @click="ChangePassowrd">忘记密码?</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Animation from '../components/Animation.vue';
import crypto from "../utils/crypto"
export default {
  components: { Animation },
  name: 'Home',
  data() {
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
    return {
      ruleForm: {
        pass: '',
        email: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],

      },
      codeText: "发送验证码",
      isSend: false,
      isShow: false,
    };
  },
  methods: {
    // 提交输入框内容
    login(formName) {
      this.$refs[formName].validate((valid) => {
        //如果表单验证通过
        if (valid) {
          this.axios({
            url: "/getUserList",
            params: {
              status: 0,
              email: this.ruleForm.email,
              offset: 0,
              limit: 6
            }
          }).then(res => {
            if (res.status === 200) {
              if (res.data.status === 1411) {
                if (res.data.result.length > 0) {
                  this.$message({
                    message: `很抱歉，您已被该网站拉黑，需要登录请联系管理员`,
                    type: 'error'
                  });
                } else {
                  this.selectLogin()
                }

              } else {
              }
            }
          }).catch(err => {

          })

        }
      });
    },
    // 重置输入框内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goRegister() {
      this.$router.push("/register")
    },
    // 判断用户是否 为黑名单
    selectLogin() {
      //发起登录请求
      this.axios({
        method: 'post',
        url: '/login',
        data: {
          password: this.ruleForm.pass,
          email: this.ruleForm.email,
        }
      }).then(res => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            // 获取token 存储到本地缓存
            for (let key in res.data.token) {
              localStorage.setItem(key, res.data.token[key])
            }
            // 存储邮箱
            let email = crypto.encrypt(this.ruleForm.email, "hiusahdu823bisadncdi")
            sessionStorage.setItem("email", email)

            this.$message({
              message: `恭喜你，${res.data.msg}`,
              type: 'success'
            });
            // 跳转到后台
            this.$router.push("/main")
          } else {
            this.$message({
              message: `很抱歉，${res.data.msg}`,
              type: 'error'
            });
          }
        }
      }).catch(err => {

      })
    },
    ChangePassowrd(){
      this.$router.push("/forget")
    }

  },
  mounted() {
    this.isShow = true
  }
}
</script>
<style lang="less" scoped>
.login {
  min-height: 100vh;
  .login-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 600px;
    height: 400px;
    padding: 0 30px;
    box-sizing: border-box;
    margin: auto;
    background-color: rgba(255, 255, 255, .7);
    .r-title {
      margin: 20px 0 50px;
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
    /deep/ .el-form-item {
      margin-top: 20px;
    }
    /deep/ .el-form-item__content {
      margin-left: 55px !important;
    }
    /deep/ .el-form-item__label {
      width: 52px !important;
    }
    /deep/ .el-form-item__label {
      text-align: start;
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
      width: 237px;
    }
  }
  .footer {
    font-size: 14px;
    margin-left: 55px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
}
</style>

