<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 绑定自定义事件 -->
        <Search v-on:searchMany="searchManyFunc" />
        <AddButton caption="添加文章" v-on:addDialog="transSubmitRoute" />
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="paperList" style="width: 100%" border stripe>
        <!-- 下面这一个column添加的是索引链 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="authorName" label="作者姓名"> </el-table-column>
        <el-table-column prop="topic" label="领域"> </el-table-column>
        <el-table-column label="领域">
          <template slot-scope="scope">
            {{ scope.row.conferences[0].confername }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <!-- 修改按钮   @click="showEditDialog(scope.row.id)"-->
          <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button>
          <!-- 删除按钮 -->
          <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removePaperById(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Search from "@/components/Search.vue";
import AddButton from "@/components/AddButton.vue";
import Pagination from "@/components/Pagination.vue";
import { getAllPaper, getPapers } from "@/api";
import { mapState } from "vuex";
export default {
  name: "Papers-list",
  components: { Breadcrumb, Search, AddButton, Pagination },
  data() {
    return {
      paperList: [],
      queryInfo: {
        query: "",
        pagenum: 1, // 当前的页数
        pagesize: 10, // 当前每页显示多少条数据
      },
      total: 0,
      addDialogVisible: false,
    };
  },
  created() {
    this.getPapersFunc();
  },
  mounted() {},
  methods: {
    async getPapersFunc() {
      const res = await getPapers({
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        this.$message.error(res.meta.message);
      }
      this.$message.success(res.meta.message);
      this.paperList = res.data;
    },
    searchManyFunc(queryP) {
      this.queryInfo.query = queryP;

      this.getPapersFunc();
    },
    transSubmitRoute() {
      this.$store.commit("permission/SET_CURRENTMENU","paper-submit") ;
      this.$router.push("paperSubmit");
    },
    showEditDialog(paperId){

    },
    removePaperById(paperId){
        
    },
  },
};
</script>

<style>
</style>