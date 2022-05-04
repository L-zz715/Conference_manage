<template>
  <!-- 分页控制 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="myQueryInfo.pagenum"
    :page-sizes="[2, 5, 10, 30]"
    :page-size="myQueryInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalNum"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "Pagination",
  props:['getQueryInfo','totalNum'],
  data() {
    return {
      myQueryInfo: this.getQueryInfo
    };
  },
  methods: {
     // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.myQueryInfo.pagesize = newSize;
      this.$emit('updateList',this.myQueryInfo);
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.myQueryInfo.pagenum = newPage;
      this.$emit('updateList',this.myQueryInfo);
    },
  },
};
</script>

<style>
</style>