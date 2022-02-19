<template>
  <div class="firstPage">
    <div class="title">日志列表</div>
    <div class="btn" v-show="!informationData.length>0">
       <el-button type="primary" @click="goPage('Journal')"
        >新增日志</el-button
      >
    </div>
    <div class="table-box">
      <el-table
        :data="informationData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="日志内容" width="900">
          <template slot-scope="scope">
            <div class="cells">{{ scope.row.text }}</div>
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
            <el-button size="mini" @click="editProduct(scope.row.journal_id)"
              >查看/编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
        statusType: -1
      },
      informationData: [],

      multipleSelection: [],

    };
  },

  created() {
    this.getJournale();
  },


  methods: {

    //跳转页面
    goPage(name) {
      this.$router.push(name)

    },
    // 获取日志数据
    getJournale() {

      this.axios({
        url: "/getJournal",

      }).then(res => {
        if (res.status === 200) {
          if (res.data.status === 5066) {
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
    editProduct(pid) {
      this.$router.push({ name: 'Journal', params: { pid } });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="less" scoped>
.title{
  width: 100%;
  font-size: 50px;
  font-weight: bold;
  text-align: center;
}
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