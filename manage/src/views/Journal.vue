<template>
  <div>
    <back />
    <div class="journal-box">
      <div class="journal-content">
        <el-form
          :model="journalDate"
          ref="journalDate"
          label-width="100px"
          class="demo-journalDate"
        >
          <el-form-item label="用户名" prop="nickName">
            <el-input :value="data.nickName" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户头像" prop="userImg">
            <div class="img-user">
              <img :src="data.userImg" class="img" />
            </div>
          </el-form-item>

          <el-form-item label="日志状态" prop="status">
            <el-radio-group v-model="journalDate.status">
              <el-radio :label="0" disabled>审核</el-radio>
              <el-radio :label="1">通过</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="描述" class="content">
            <div id="content"></div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('journalDate')">{{
              pid ? "修改日志" : "上传日志"
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Back from "../components/Back.vue";
import crypto from "../utils/crypto"
import E from "wangeditor"

export default {
  name: "TypeList",
  components: {
    Back
  },
  data() {

    return {
      journalDate: {
        status: 1,
        pid:""
      },

      data: "",
      editor: "",
      typeList: "",
      text: "",
      pid: "",
      editResult: ""
    };
  },

  created() {
    this.pid = this.$route.params.pid

    if (this.pid) {
      this.searchJournal(this.pid)
    }

    this.getPerson()

  },
  mounted() {
    this.editor = new E("#content");

    this.editor.create();

  },
  computed: {
    email() {
      return this.$store.state.email
    },

  },

  methods: {
    
    submitForm(formName) {
      let html = this.editor.txt.html()

      if (html) {
        //添加日志
        this.text = html
        if (this.pid) {
          //编辑日志
          this.editorJournal();
        } else {
          // 添加日志
          this.addjournal();
        }

      } else {
        this.$message.error("请输入需要添加的日志")
      }

    },

    //添加日志
    addjournal() {
      //如果表单验证通过, 发起发布日志请求
      this.axios({
        url: "/addJournal",
        method: "post",
        data: {
          text: this.text,
        },
      })
        .then(res => {
          if (res.status === 200) {
            if (res.data.status === 6001) {
              this.$message.success(res.data.msg);
              this.$router.push("/demo")
            } else {
              this.$message.error(res.data.msg);
            }
          }

        })
        .catch(err => {

        });
    },
    // 查询日志
    searchJournal() {
      this.axios({
        url: "/getJournal",
      }).then(res => {
        if (res.status === 200) {
          if (res.data.status === 5066) {
           this.editResult = res.data.result[0]
            this.journalDate.pid = this.editResult.journal_id
            // 将数据渲染到wangEdit
            this.editor.txt.html(`${this.editResult.text}`)
          }
        }
      })
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
    //编辑日志
    editorJournal() {
      //修改日志信息
      this.axios({
        url: "/editorJournal",
        method: "POST",
        data: {
          text: this.text,
          journalId: this.editResult.journal_id
        }
      }).then(res => {
        if (res.status === 200) {
          if (res.data.status === 1701) {
            
            this.$message.success(res.data.msg);
            this.$router.push("/demo")
          } else {
            this.$message.error(res.data.msg);
          }
        }
      }).catch(err => {

      })
    }


  }
};
</script>

<style lang="less" scoped>
/deep/ .text-box textarea {
  height: 100px;
}
.journal-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
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
/deep/ .content {
  width: 100% !important;
}
</style>