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
import {getProfile} from "@/api/index"
export default {
  data() {
    return {};
  },
  components: {
    SidebarNav,
    Top,
    Content,
  },
  created(){
    this.getUserPro()
  },
  methods:{
    async getUserPro(){
      let res = await getProfile(window.sessionStorage.getItem("token"))
    }
  }
 
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