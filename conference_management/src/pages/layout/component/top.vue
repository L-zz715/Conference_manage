<template>
<!-- <el-container> -->
  <el-header>
    <span>会议管理系统</span>
     <el-button @click="testP">test</el-button>
    <el-button type="danger" size="mini" round @click="logout"
      >log out</el-button
    >
  </el-header>
<!-- </el-container> -->
</template>

<script>
import {fetchPermission} from "@/api"
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$router.push("login");
    },
     async testP(){
      let res = await fetchPermission()
      console.log('@',this.$store.state.currentRole)
      // let res = await axios.get('/api/permission?role=' + this.$store.state.currentRole)
      console.log('@@@',res)
    }
  },
};
</script>

<style scoped>
.el-header {
  background: rgb(16, 16, 129);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  /* width: 100%; */
}

.el-header span {
  font-size: 18px;
  color: #fff;
  margin-left: 15px;
}

.el-header .el-button {
  float: right;
}
</style>