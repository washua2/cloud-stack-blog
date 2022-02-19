<template>
  <div>
    <back />
    <div class="article-type-box">
      <div class="article-type-content">
        <el-form
          :model="articleTypeDate"
          :rules="rules"
          ref="articleTypeDate"
          label-width="100px"
        >
        <el-form-item label="分类名称" prop="articleName">
          <el-input
            v-model="articleTypeDate.articleName"
            placeholder="输入分类名称"
            :required="true"
          ></el-input>
        </el-form-item>

          <el-form-item label="分类状态" prop="status">
            <el-radio-group v-model="articleTypeDate.status">
              <el-radio :label="0">审核</el-radio>
              <el-radio :label="1" disabled>通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('articleTypeDate')"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Back from "../components/Back.vue";

export default {
  name: "addarticleType",
  components: {
    Back
  },
  data() {
    //验证分类描述
    var validateName= (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入分类描述"));
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
      articleTypeDate: {
        articleName:"",
        status: 0,
      },
      rules: {
        articleName: [{ validator: validateName, trigger: "blur" }],

      },
      
      data: ""
    };
  },

  created() {

  },

  methods: {
    submitForm(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addArticleType();
        }
      });
    },

    //添加文章类型
    addArticleType() {
      //获取文章类型信息
      let { articleName, status } = { ...this.articleTypeDate };
      articleName = articleName.toString()
      //如果表单验证通过, 发起发布留言请求
      this.axios({
        url: "/addArticleType",
        method: "post",
        data: {
          status,
          articleName
        },
      })
        .then(res => {
          if (res.status === 200) {
            if (res.data.status === 5021) {
              this.$message.success(res.data.msg);
              this.$router.push("/articleAlassification")
            } else {
              this.$message.error(res.data.msg);
            }
          }
        })
        .catch(err => {

        });
    },
   


  }
};
</script>

<style lang="less" scoped>
/deep/ .text-box textarea {
  height: 100px;
}
.article-type-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
}

.article-type-content {
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