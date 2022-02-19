<template>
  <div>
    <back/>
    <div class="message-box">
      <div class="message-content">
        <el-form
          :model="messageDate"
          :rules="rules"
          ref="messageDate"
          label-width="100px"
          class="demo-messageDate"
        >
          <el-form-item label="用户名" prop="nickName">
            <el-input
              :value="data.nickName"
              disabled
            ></el-input>
          </el-form-item>
             <el-form-item label="用户头像"  prop="userImg">
            <div class="img-user">
             <img :src="data.userImg" class="img" />
            </div>
          </el-form-item>

          <el-form-item label="图片" prop="photo">
            <div class="img-box">
              <Uploader :img-url="photo" @upload="upload($event, 'photo')" />
            </div>
          </el-form-item>
        

          <el-form-item label="留言状态" prop="status">
            <el-radio-group v-model="messageDate.status">
              <el-radio :label="0">审核</el-radio>
              <el-radio :label="1" disabled>通过</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="描述" prop="desc">
            <el-input
              class="text-box"
              type="textarea"
              v-model="messageDate.desc"
              resize="none"
              :maxlength="50"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('messageDate')"
              >上传留言</el-button
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
    //验证留言描述
    var validateDesc = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入描述"));
      } else {
        let reg = /[<>]|(script)/;
        if (!reg.test(value)) {
          callback();
        } else {
          callback(new Error("描述不能含有<、>、script符号"));
        }
      }
    };

    return {
      messageDate: {
        photo: "",
        status: 0,
        desc: "",
      },
      rules: {
        desc: [{ validator: validateDesc, trigger: "blur" }],
       
      },
      photo:"",
      data:"",
      pid:""
    };
  },

  created() {
    this.pid=this.$route.query.pid
    // 获取个人信息
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
          if (!this.pid) {
            //编辑留言
            // this.eidtProduct();
          } else {
            //添加留言
            this.reply();
          }
        }
      });
    },

    //回复留言
    reply() {
      //获取留言信息
      let {desc,status} = { ...this.messageDate };
      desc=desc.toString()
      //如果表单验证通过, 发起发布留言请求
      this.axios({
          url: "/addReply",
        method: "post",
        data:{
          desc,
          status,
          photo:this.messageDate.photo,
          photoType:this.messageDate.photoType,
          person:this.data,
          pid:this.pid
        },
      
      })
        .then(res => {
          if(res.status===200){
            if(res.data.status===1521){
              this.$message.success(res.data.msg);
              this.$router.push("/replyList")
           
            }else{
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
      this.messageDate[key] = data.base64;
      this.messageDate[key + "Type"] = data.type;
      
    },
    // 获取个人信息
    getPerson(){
       this.axios({
        url: "/getPerson",
        method: "post",
        data: {
          email: this.email||crypto.decrypt(sessionStorage.getItem("email"), "hiusahdu823bisadncdi")
        }
      }).then(res => {
       
        if (res.status === 200) {
          if (res.data.status === 1501) {
            this.data=res.data.data[0]
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
.message-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}

.message-content {
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
.img-user{
  width: 198px;
  height: 196px;
  border: 1px dashed #ccc;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  .img{
    width: 100%;
    height: 100%;
  }
}
</style>