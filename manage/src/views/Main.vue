<template>
  <div>
    <div class="navbar-box">
      <Navbar  />
    </div>
    <div class="content-box">
      <div class="aside-box">
        <AsideMenu />
      </div>
      <div class="content">
        <!-- <Texts/> -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import AsideMenu from '../components/AsideMenu.vue'
import Texts from '../components/Texts.vue'
export default {
  name: 'Main',
  components: {
    Navbar,
    AsideMenu,
    Texts
  }

  }
</script>

<style lang="less" scoped>
.navbar-box {
  position: sticky;
  top: 0;
}

.content-box {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  min-width: 1280px;
}

.aside-box {
  width: 180px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
}

.content {
  height: calc(100% - 20px);
  padding: 10px;
  flex: 1;
  overflow-y: auto;
}
</style>