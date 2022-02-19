<template>
  <div class="navbar">
    <div class="navbar-title">个人博客后台管理系统</div>
    <div class="navbar-menu">
      <div class="navbar-img">
        <img class="auto-img" :src="personalData.userImg||userInfo.userImg" alt="" />
      </div>
      <div class="navbar-email">{{ personalData.email||userInfo.email }}</div>
      <div class="settings">
        <el-dropdown trigger="click" @command="goPage">
          <span class="el-dropdown-link">
            设置<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="ChangePassowrd"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item command="PersonalInformation"
              >修改个人信息</el-dropdown-item
            >
            <el-dropdown-item command="Cancellation">注销账号</el-dropdown-item>

            <el-dropdown-item command="Forget"
              >忘记密码</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="logout" @click="logout">退出</div>
    </div>
  </div>
</template>

<script>
import crypto from "../utils/crypto"
export default {
  name: "Navbar",
  data() {

    return {
      userInfo: {
        email: "",
        userImg: "",
      },
      userId: ""
    };
  },
  computed: {
    email() {
      return this.$store.state.email
    },
    personalData() {
      return this.$store.state.personalData
    }

  },
  created() {

    this.getPerson();
  },

  methods: {
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
          if (res.data.status === 1030) {
            this.$message.error("请先登录")
            this.$router.push("/login")
          }

          if (res.data.status === 1501) {
            let { data } = res.data

            if (this.personalData) {
              this.userInfo.email = this.personalData.email
              this.userInfo.userImg = this.personalData.userImg
            } else {
              this.userInfo.email = data[0].email
              this.userInfo.userImg = data[0].userImg
              this.userId = data[0].userId
            }
          }

        }
      }).catch(err => {

      })
    },
    // 跳转页面
    goPage(name) {
      this.$router.push({
        path:"/"+name, query: {
          userId: this.userId
        }
      })
    },
    //退出
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    }
  },
};
</script>

<style lang="less" scoped>
.logout {
  margin-left: 20px;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}
.navbar-title {
  font-size: 18px;
  color: #fff;
}

.navbar {
  height: 70px;
  background-color: rgba(0, 0, 0, .8);
  padding: 0 20px;
  display: flex;
  align-items: center;
  /deep/ .el-dropdown-link {
    color: #fff;
  }
}

.navbar-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.navbar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ccc;
  overflow: hidden;
  .auto-img {
    width: 110%;
    height: 110%;
  }
}

.navbar-email {
  margin: 0 20px;
  color: #fff;
}

.settings {
  cursor: pointer;
}
</style>