<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <!-- 用户列表区 -->
    <el-table :data="roleList" style="width: 100%" border stripe>
      <!-- 下面这一个column添加的是索引链 -->
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="rolename" label="角色名称"> </el-table-column>
      <el-table-column prop="description" label="角色描述"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Pagination from "@/components/Pagination.vue";
export default {
  name: "Roles-list",
  components: { Breadcrumb, Pagination },
  data() {
    return {
      roleList: [],
    };
  },
  mounted() {},
};
</script>

<style>
</style>