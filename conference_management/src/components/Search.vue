<template>
  <el-col :span="8">
    <el-input
      placeholder="请输入内容"
      class="input-with-select"
      @clear="searchContent"
      clearable
      v-model.trim="searchQuery"
    >  
      <el-button slot="append" icon="el-icon-search" @click="searchContent">
      </el-button>
    </el-input>
  </el-col>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
        searchQuery:''
    };
  },
  methods: {
    searchContent() {
      // 自定义事件触发进行搜索
      this.$emit("searchMany", this.searchQuery);
    },
   
  },
};
</script>

<style>
</style>