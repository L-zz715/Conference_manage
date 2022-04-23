<template>
  <div>
      <h3>Login</h3>
      <el-button type="primary" round @click="loginToHome">login</el-button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{

    }
  },
  methods:{
    loginToHome(){
      this.$router.push('home')
    }
  }
};
</script>

<style>
</style>