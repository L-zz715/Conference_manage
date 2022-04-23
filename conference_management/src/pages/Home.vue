<template>
  <div>
    <h3>Home</h3>
    <el-button type="info" round @click="logout">log out</el-button>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
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
</style>