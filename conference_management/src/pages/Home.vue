<template>
  <div>
    <h3>Home</h3>
      <el-button type="info" round @click="logout">log out</el-button>
  </div>
</template>

<script>
export default {
    name:'Home',
    data(){
      return{

      }
    },
    methods:{
      logout(){
        this.$router.push('login')
      }
    }
}
</script>

<style>

</style>