<template>
  <el-col :span="4">
    <el-button type="primary"
    @click="openDialog()"
      >
      {{caption}}</el-button
    >
  </el-col>
</template>

<script>
export default {
  name: "AddButton",
  props:['caption'],
  data() {
    return {
      openDialog(){
        this.$emit('addDialog')
      }
    };
  },
};
</script>

<style>
</style>