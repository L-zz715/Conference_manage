<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click.native="changeCurrentMenu">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ selectedMenuName[0] }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ selectedMenuName[1] }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "Breadcrumb",
  data() {
    return {
    };
  },
  methods:{
    changeCurrentMenu(){
      this.$store.commit("permission/SET_CURRENTMENU","home")
    }
  },
  computed:{
      ...mapState("permission",["selectedMenuName"])
  },
};
</script>

<style>
</style>