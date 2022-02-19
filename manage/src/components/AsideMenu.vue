<template>
  <div>
    <el-row class="tac">
      <el-col :span="24">
        <el-menu :default-active="defaultActive" :router="true">
          <el-submenu
            :index="item.subMenuIndex"
            v-for="(item, index) in menuData"
            :key="index"
          >
            <template slot="title">
              <i :class="[item.icon]"></i>
              <span class="text">{{ item.title }}</span>
            </template>
            <el-menu-item
              :index="v.menuItemIndex"
              v-for="(v, i) in item.menuItems"
              :key="i"
              >{{ v.title }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AsideMenu",
  data() {
    return {
      //默认激活的菜单
      defaultActive: '',
      menuData: [
         {
          subMenuIndex: 'article',
          icon: 'el-icon-s-order',
          title: '文章',
          menuItems: [
             {
              title: '首页',
              //路由路径
              menuItemIndex: 'Article'
            },
             {
              title: '文章类型列表',
              //路由路径
              menuItemIndex: 'ArticleAlassification'
            },
          ]
        },
        {
          subMenuIndex: 'photo',
          icon: 'el-icon-s-order',
          title: '相册',
          menuItems: [
             {
              title: '云相册列表',
              //路由路径
              menuItemIndex: 'photoList'
            }
          ]
        },
        {
          subMenuIndex: 'message',
          icon: 'el-icon-menu',
          title: '留言板',
          menuItems: [
            {
              title: '信息列表',
              menuItemIndex: 'information'
            },
            {
              title: '回复列表',
              //路由路径
              menuItemIndex: 'replyList'
            },
          ]
        },
        {
          subMenuIndex: 'text',
          icon: 'el-icon-s-order',
          title: '日志',
          menuItems: [
           
            {
              title: '更新日志情况',
              //路由路径
              menuItemIndex: 'demo'
            }

           
          ]
        },{
          subMenuIndex: 'user',
          icon: 'el-icon-s-order',
          title: '用户',
          menuItems: [
             {
              title: '用户列表',
              //路由路径
              menuItemIndex: 'userList'
            },
          ]
        },
        {
          subMenuIndex: 'visualization',
          icon: 'el-icon-s-order',
          title: '可视化数据',
          menuItems: [
             {
              title: '图表',
              //路由路径
              menuItemIndex: '/visualization'
            },
          ]
        }
       
      ]
    };
  },


  created() {

    let path = this.$route.path.slice(1);

    this.defaultActive = path;
  }


};
</script>

<style lang="less" scoped>
.tac {
  .text {
    color: #999;
  }
  /deep/ .el-menu {
    border-right: 0;
    background-color: rgba(0, 0, 0, 0.685);
  }

  /deep/ .el-submenu .el-menu-item {
    min-width: 180px;
    color: #999;
  }
}
</style>