<template>
  <!--   :collapse="isCollapse"
      :collapse-transition="false" -->
  <el-aside width="200px">
    <el-menu
      background-color="#2441a3"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :router="true"
      :default-active="activePath"
    >
      <!-- <el-submenu index="1">
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
      </el-submenu> -->
      <DynamicMenu :menuList="sidebarMenu"></DynamicMenu>
    </el-menu>
  </el-aside>
</template>

<script>
import DynamicMenu from "@/components/dynamic-menu";

export default {
  data() {
    return {
      isCollapse: false,
      activePath: "",
    };
  },
  components: {
    DynamicMenu,
  },
};
</script>

<style>
.el-aside {
  background: #2441a3;
  height: 100%;
}

.el-menu {
  width: 200px;
}
</style>