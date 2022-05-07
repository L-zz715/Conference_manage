<template>
  <el-col :span="4">
    <el-button type="primary"
    :disabled="curRole !== 'chair'"
    @click="openDialog()"
      >
      {{caption}}</el-button
    >
  </el-col>
</template>

<script>
export default {
  name: "AddButton",
  props:['caption','curRole'],
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