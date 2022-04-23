<template>
  <el-container>
    <el-header>
      <span>会议管理系统</span>
      <el-button type="danger" size="mini" round @click="logout"
        >log out</el-button
      >
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$router.push("login");
    },
  },
};
</script>

<style>
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
}

.el-header .el-button {
  float: right;
}

.el-aside {
  background: #2441a3;
}
</style>