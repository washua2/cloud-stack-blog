<template>
  <div>
    <back />
    <div class="article-box">
      <div class="article-content">
        <el-form
          :model="articleDate"
          ref="articleDate"
          label-width="100px"
          class="demo-articleDate"
        >
          <el-form-item label="用户名" prop="nickName">
            <el-input :value="data.nickName" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户头像" prop="userImg">
            <div class="img-user">
              <img :src="data.userImg" class="img" />
            </div>
          </el-form-item>
          <el-form-item label=" 文章类型">
            <el-select
              v-model="articleDate.pid"
              placeholder="选择文章类型"
              clearable
            >
              <el-option
                :label="item.articlename"
                :value="item.article_type_id"
                :value-key="item.article_type_id"
                v-for="(item, index) in typeList"
                :key="index"
              >
                <div @click="change(item)">
                  {{ item.articlename }}
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="文章状态" prop="status">
            <el-radio-group v-model="articleDate.status">
              <el-radio :label="0">审核</el-radio>
              <el-radio :label="1" disabled>通过</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="描述" class="content">
            <div id="content"></div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('articleDate')">{{
              pid ? "修改文章" : "上传文章"
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
      articleDate: {
        status: 0,
        item: "",
        pid: ""
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
      this.searchArticle(this.pid)
    }

    this.getPerson()
    this.getAllArticleType()

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
    change(e) {
      this.articleDate.item = e
    },
    submitForm(formName) {
      let html = this.editor.txt.html()
      if (!this.pid) {
        if (!this.articleDate.item) {
          this.$message.error("请选择需要文章类型")
          return
        }
      }

      if (html) {
        //添加文章
        this.text = html
        if (this.pid) {
          //编辑文章
          this.eidtArticle();
        } else {
          // 添加文章
          this.addArticle();
        }

      } else {
        this.$message.error("请输入需要添加的文章")
      }

    },

    //添加文章
    addArticle() {
      //获取文章信息
      let { status, item } = { ...this.articleDate };
      //如果表单验证通过, 发起发布文章请求
      this.axios({
        url: "/addArticle",
        method: "post",
        data: {
          status,
          pid: item.article_type_id,
          articleName: item.articlename,
          text: this.text,
          person: this.data,
        },

      })
        .then(res => {
          if (res.status === 200) {
            if (res.data.status === 6001) {
              this.$message.success(res.data.msg);
               this.$router.push("/Article");

            } else {
              this.$message.error(res.data.msg);
            }
          }

        })
        .catch(err => {

        });
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
    // 获取文章类型数据
    getAllArticleType() {
      this.axios({
        url: "/getAllArticleType",

      }).then(res => {

        if (res.status === 200) {
          if (res.data.status === 5066) {
            this.typeList = res.data.result;
          }
        }
      })
    },
    // 获取指定文章数据
    searchArticle(pid) {
      this.axios({
        url: "/searchArticle",
        params: {
          pid
        }
      }).then(res => {
        if (res.status === 200) {
          if (res.data.status === 7101) {
            this.editResult = res.data.result[0]
            this.articleDate.pid = this.editResult.pid
            // 将数据渲染到wangEdit
            this.editor.txt.html(`${this.editResult.text}`)
          }
        }


      }).catch(err => {

      })
    },
    //编辑文章
    eidtArticle() {
      //获取文章信息
      let { status, item } = { ...this.articleDate };
      this.axios({
        url: "/eidtArticle",
        method: "POST",
        data: {
          status,
          pid: item.article_type_id || this.editResult.pid,
          articleName: item.articlename || this.editResult.articlename,
          text: this.text,
          person: this.data,
          articleId: this.editResult.article_id
        }
      }).then(res => {
        if(res.status===200){
          if(res.data.status===1701){
            this.$message.success(res.data.msg);
            // this.$router.push("/article")
              this.$router.go(-1);
          }else{
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
.article-box {
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