<template>
  <div>
    <Top />
    <el-container>
      <SidebarNav class="sidebar" />
      <Content />
     
    </el-container>
  </div>
</template>

<script>
import SidebarNav from "./component/sidebar-nav";
import Top from "./component/top";
import Content from "./component/content";
export default {
  data() {
    return {};
  },
  components: {
    SidebarNav,
    Top,
    Content,
  },
 
};
</script>

<style scoped>
.el-container {
  height: 100%;
}

div{
  height: 100%;
}
</style>