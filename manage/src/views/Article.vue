<template>
  <div class="firstPage">
    <div class="search-box">
      <el-form :inline="true" :model="condition">
        <el-form-item label="相关文章">
          <el-input
            v-model="condition.nickName"
            placeholder="输入文章关键字"
            clearable
          ></el-input>
        </el-form-item>
         
        <el-form-item label="文章状态">
          <el-select
            v-model="condition.status"
            clearable
            placeholder="选择文章状态"
          >
            <el-option label="选择文章状态" :value="-1"></el-option>
            <el-option label="审核" :value="0"></el-option>
            <el-option label="通过" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章类型状态">
          <el-select
            v-model="condition.statusType"
            clearable
            placeholder="选择文章类型状态"
          >
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
      <el-button type="primary" @click="goPage('AddArticle')"
        >新增文章</el-button
      >
      <el-button
        type="danger"
        :disabled="multipleSelection.length === 0"
        @click="removeArticle()"
        >删选选择</el-button
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
        <el-table-column label="用户名称" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户头像" width="100" align="center">
          <template slot-scope="scope">
            <div class="img-box">
              <div>
                <img class="auto-img" :src="scope.row.user_img" alt="" />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文章类型" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.articlename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章类型状态" width="100">
          <template slot-scope="scope">
            <span :style="scope.row.status_type === 0?'color:#F56C6C':'color:#67C23A'">{{ scope.row.status_type === 0 ? "审核" : "通过" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章内容" width="180">
          <template slot-scope="scope">
            <div class="cells">{{ scope.row.text }}</div>
          </template>
        </el-table-column>
        <el-table-column label="文章状态" width="100">
          <template slot-scope="scope">
             <span :style="scope.row.status === 0?'color:#F56C6C':'color:#67C23A'">{{ scope.row.status === 0 ? "审核" : "通过" }}</span>
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
            <el-button size="mini" @click="editProduct(scope.row.article_id)"
              >查看编辑</el-button
            >

            <el-button
              v-show="scope.row.status === 0"
              type="success"
              size="mini"
              @click="toggleArticle(scope.row, 1)"
              >通过</el-button
            >

            <el-button
              v-show="scope.row.status === 1"
              type="warning"
              size="mini"
              @click="toggleArticle(scope.row, 0)"
              >审核</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="removeArticle(scope.row.article_id)"
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
  name: "Article",
  data() {
    return {
      condition: {
        nickName: "",
        status: -1,
        statusType:-1
      },
      informationData: [],

      multipleSelection: [],

      //商品类型
      typeData: [],

      //分页处理

      //偏移量
      offset: 0,

      //每页显示的数据
      limit: 6,

      //总数量
      total: 0,

      //当前页面
      currentPage: 1,

    };
  },

  created() {
    this.getAllArticle();

    this.getTotal();
  },


  methods: {

    //跳转页面
    goPage(name) {
      this.$router.push(name)

    },
    // 获取首页数据
    getAllArticle() {
      this.axios({
        url: "/getAllArticle",
        params: {
          ...this.condition,
          offset:this.offset,
          limit:this.limit
        }

      }).then(res => {
        if (res.status === 200) {
          if (res.data.status === 6081) {
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
      this.getAllArticle()
      this.getTotal()

    },

    //切换页码
    currentChange(currentPage) {
      // 
      this.offset = (currentPage - 1) * this.limit;
      //初始化首页列表数据
      this.getAllArticle();
    },

    //查询首页列表总数量
    getTotal() {
      this.axios({
        method: "get",
        url: "/getAllArticleTotal",
        params: {
          ...this.condition
        },
      })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 8081) {
              this.total = res.data.result[0].count;
            }
          }

        })
        .catch((err) => {

        });
    },

    //切换文章状态
    toggleArticle(item, status) {
      this.axios({
        method: "post",
        url: "/toggleArticle",
        data: {
          articleId: item.article_id,
          status
        
        },
      })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 4031) {
              item.status = status;
              this.$message({
                message: res.data.msg,
                type: "success"
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              })
            }
          }

        })
        .catch((err) => {

        });
    },

    //删除一个或者多个商品
    removeArticle(pid) {
     
      let pids = [];
      if (pid) {
        pids.push(pid);
      } else {
        this.multipleSelection.forEach(v => {
          pids.push(v.article_id);
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
            url: "/removeArticle",
            data: {
              pids
            },
          }).then(res => {
            if (res.data.status === 4101) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });

              //更新页面文章列表数据
              this.search();
            } else {
              this.$message.error(res.data.msg);
            }
          })
            .catch((err) => {

              this.$message.error("删除文章失败");
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

    editProduct(pid) {
      this.$router.push({ name: 'AddArticle', params: { pid } });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="less" scoped>
.firstPage {
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
  /deep/ .el-button {
    margin-left: 10px;
  }
  .search-box {
    padding: 10px;
    background-color: #fff;
  }
  /deep/ .cells {
    height: 30px;
    overflow-y: auto;
  }
}
</style>