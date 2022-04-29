<template>
  <el-container>
    <el-header>
      <span>会议管理系统</span>
      <el-button type="danger" size="mini" round @click="logout"
        >log out</el-button
      >
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#2441a3"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>
              用户管理
            </template>
            <el-menu-item index="users">用户列表</el-menu-item>
          </el-submenu>
           <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              权限管理
            </template>
            <el-menu-item index="roles">角色列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              会议管理
            </template>
            <el-menu-item index="confers">会议列表</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              文章管理
            </template>
            <el-menu-item index="papers">文章列表</el-menu-item>
            <el-menu-item index="review">审核</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
      activePath: "",
    };
  },
  methods: {
    logout() {
      this.$router.push("login");
    },
  },
};
</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-header {
  background: rgb(16, 16, 129);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
}

.el-header span {
  font-size: 18px;
  color: #fff;
  margin-left: 15px;
}

.el-header .el-button {
  float: right;
}

.el-aside {
  background: #2441a3;
  height: 100%;
}

.el-menu {
  /* 解决侧边没有对齐问题 */
  border-right: none;
}
</style>