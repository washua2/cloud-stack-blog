<template>
  <div class="passoword">
    <Animation/>
    <transition
      enter-active-class="animate__animated animate__swing  "
      leave-active-class="animate__animated animate__backOutDown animate__faster	500ms"
    >
      <div class="passoword-box" v-show="isShow">
        <div class="r-title">
          <span class="welcome">修改密码</span>
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
          <el-form-item label="原密码" prop="pass" :required="true">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              placeholder="输入6-16位原密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="checkPass" :required="true">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              placeholder="输入6-16位新密码"
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
            <el-button type="primary" @click="passoword('ruleForm')"
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
import Animation from '../components/Animation.vue';
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
     var validatePass2 = (rule, value, callback) => {
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
        pass: '',
        checkPass: '',
        email: '',
        code: ""
      },
      rules: {
       
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
      userId:""
    };
  },
  created(){
   this.userId=this.$route.query.userId
  },
  methods: {
    // 提交输入框内容
    passoword(formName) {
      this.$refs[formName].validate((valid) => {
        //如果表单验证通过
        if (valid) {

          //发起修改密码请求
          this.axios({
            method: 'post',
            url: '/modify',
            data: {
              oldPassowrd: this.ruleForm.pass,
              password: this.ruleForm.checkPass,
              email: this.ruleForm.email,
              code: this.ruleForm.code,
              userId:this.userId
            }
          }).then(res => {
            if (res.status === 200) {
              if (res.data.status === 808) {
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
          message: "请输入正确邮箱后进行修改",
          type: 'error'
        });

      } else if (!emailReg.test(this.ruleForm.email)) {
        this.$message({
          message: "请修改正确邮箱后进行修改",
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
            email: this.ruleForm.email
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
  },
  mounted() {
    this.isShow = true
  }
}
</script>
<style lang="less" scoped>
.passoword {
   min-height: 100vh;
  .passoword-box {
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
      margin-bottom: 20px;
    }
   
    .img-box {
      position: relative;
      left: -80px;
      width: 74px;
      height: 74px;
      border-radius: 50%;
      border: 1px solid #fff;
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
