<template>
  <!--   :collapse="isCollapse"
      :collapse-transition="false" -->
  <el-aside width="200px">
    <el-menu
      background-color="#2441a3"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :default-active="currentMenu"
    >  
      <DynamicMenu :menuList="sidebarMenu"></DynamicMenu>
    </el-menu>
  </el-aside>
</template>

<script>
import DynamicMenu from "@/components/dynamic-menu";
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isCollapse: false,
      activePath: "",
    };
  },
  computed: {
    ...mapState("permission", ["sidebarMenu", "currentMenu"]),
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