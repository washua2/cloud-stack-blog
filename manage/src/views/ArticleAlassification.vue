<template>
  <div class="information">
    <div class="search-box">
      <el-form :inline="true" :model="condition">
        <el-form-item label="类型名称">
          <el-input
            v-model="condition.articleName"
            placeholder="输入类型关键字"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label=" 类型状态">
          <el-select v-model="condition.status" clearable placeholder="选择类型状态">
            <el-option label="选择文章类型状态" :value="-1"></el-option>
            <el-option label="审核" :value="0"></el-option>
            <el-option label="通过" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btns">
      <el-button type="primary" @click="goPage('AddArticleType')"
        >新增文章类型</el-button
      >
      <el-button
        type="danger"
        :disabled="multipleSelection.length === 0"
        @click="removeData()"
        >批量删除</el-button
      >
    </div>
    <div class="table-box">
      <el-table
        :data="informationData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column label="类型名称" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.articlename }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型状态" width="100">
          <template slot-scope="scope">
             <span :style="scope.row.status_type === 0?'color:#F56C6C':'color:#67C23A'">{{ scope.row.status_type === 0 ? "审核" : "通过" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
             <el-button size="mini" @click="sendPid(scope.row.article_type_id)"   type="primary"
              >查看</el-button
            >
            <el-button
              v-show="scope.row.status_type === 0"
              type="success"
              size="mini"
              @click="toggleArticleType(scope.row, 1)"
              >通过</el-button
            >
            <el-button
              v-show="scope.row.status_type === 1"
              type="warning"
              size="mini"
              @click="toggleArticleType(scope.row, 0)"
              >审核</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="removeData(scope.row.article_type_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="p-box">
        <el-pagination
          :current-page.sync="currentPage"
          @current-change="currentChange"
          :page-size="limit"
          background
          layout="prev, pager, next"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { utils } from '../utils/utils'
export default {
  name: "information",
  data() {
    return {
      condition: {
        articleName: "",
        status: -1
      },
      informationData: [],

      multipleSelection: [],

      //商品类型
      typeData: [],

      //分页处理

      //偏移量
      offset: 0,

      //每页显示的数据
      limit: 3,

      //总数量
      total: 0,

      //当前页面
      currentPage: 1,

      count:""
    };
  },

  created() {
    // this.getTypeData();
    // 初始化数据
    this.getArticleType();

    this.getArticleTotal();
  },


  methods: {

    //跳转页面
    goPage(name) {
      this.$router.push(name)

    },
    // 获取文章列表 数据
    getArticleType() {
      this.axios({
        url: "/getArticleType",
        params: {
          ...this.condition,
          offset: this.offset,
          limit: this.limit
        }

      }).then(res => {
        if (res.status === 200) {
          if (res.data.status === 5001) {
            res.data.result.forEach((v) => {
              v.created_at = utils.formatDate(
                v.created_at,
                "yyyy-MM-dd hh:mm:ss"
              );
              v.updated_at = utils.formatDate(
                v.updated_at,
                "yyyy-MM-dd hh:mm:ss"

              );
            });
            this.informationData = res.data.result;
          }
        }
      })
    },


    //查询
    search() {
      this.offset = 0;
      this.currentPage = 1;
      this.getArticleType()
      this.getArticleTotal()

    },

    //切换页码
    currentChange(currentPage) {
      // 
      this.offset = (currentPage - 1) * this.limit;
      //初始化商品列表数据
      this.getArticleType();
    },

    //查询文章列表总数量
    getArticleTotal() {
      this.axios({
        method: "get",
        url: "/getArticleTotal",
        params: {
          ...this.condition,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 5101) {
              this.total = res.data.result[0].count;
            }
          }

        })
        .catch((err) => {

        });
    },
    // 查看对应的文章列表
    sendPid(articleId){
        // 跳转到文章页
            this.$router.push({path:"/findArticle",query:{
              articleId
            }})
    },

    //切换文章类型状态
    toggleArticleType(item, status) {
      this.axios({
        method: "post",
        url: "/toggleArticleType",
        data: {
          articleTypeId: item.article_type_id,
          status
        },
      })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 4031) {
              item.status = status;
              this.$message({
                message:res.data.msg,
                type:"success"
              })
              this.getArticleType()
            }
          }

        })
        .catch((err) => {

        });
    },

    //删除一个或者多个文章
    removeData(pid) {
      // 
      // 
      let pids = [];
      if (pid) {
        pids.push(pid);
      } else {
        this.multipleSelection.forEach(v => {
          pids.push(v.article_type_id);
        })
      }
      if (pids.length > 0) {
        this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
            //发起删除类型请求
            this.axios({
              method: "post",
              url: "/removeArticleType",
              data: {
                pids
              },
            }).then(res=> {
                if (res.data.status === 1170) {
                  this.$message({
                    message: res.data.msg,
                    type: "success",
                  });

                  //更新页面文章分类列表数据
                  this.search();
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch((err) => {

                this.$message.error("删除失败");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }

    },
   
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="less" scoped>
.information {
  .table-box {
    min-width: 1233px;
    overflow-x: auto;
  }
  .p-box {
    text-align: center;
    margin-top: 10px;
  }
  .img-box {
    width: 44px;
    height: 44px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .auto-img {
      width: 100%;
      height: 100%;
    }
  }
  .img-photo{
      width: 88px;
    height: 88px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .auto-img {
      width: 100%;
      height: 100%;
    }
  }

  /deep/ tbody .el-table__row td:nth-child(3) {
    padding: 0;
  }
  .table-box {
    padding: 10px;
    margin-top: 10px;
    background-color: #fff;
  }
  .btns {
    padding: 10px;
    margin-top: 10px;
    background-color: #fff;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-button{
    margin-left: 10px;
  }
  .search-box {
    padding: 10px;
    background-color: #fff;
  }
}
</style>