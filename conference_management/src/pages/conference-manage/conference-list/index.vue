<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 绑定自定义事件 -->
        <Search v-on:searchMany="searchManyFunc" />
        <AddButton caption="创建会议" v-on:addDialog="transAddDialogVisible" />
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="conferList" style="width: 100%" border stripe>
        <!-- 下面这一个column添加的是索引链 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="confername" label="会议名称"> </el-table-column>
        <el-table-column prop="title" label="主题"> </el-table-column>
        <el-table-column prop="topic" label="领域"> </el-table-column>
        <el-table-column prop="chairname" label="主席姓名"> </el-table-column>
        <el-table-column prop="date" label="会议日期">
          <template slot-scope="scope">
            {{ scope.row.date | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- <template slot-scope="scope"> -->
          <!-- {{scope.row}} -->
          <!-- 修改按钮   @click="showEditDialog(scope.row.id)"-->
          <!-- <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button> -->
          <!-- 删除按钮 -->
          <!-- <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row._id)"
            ></el-button> -->
          <!-- </template> -->
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
import { getAllConfers, getAttendConfers } from "@/api";
import { mapState } from "vuex";

export default {
  name: "conferences-list",
  components: { Breadcrumb, Search, AddButton, Pagination },
  computed: {
    ...mapState("permission", ["userProfile"]),
    ...mapState(["currentRole"]),
  },
  data() {
    return {
      conferList: [],
      queryInfo: {
        query: "",
        pagenum: 1, // 当前的页数
        pagesize: 10, // 当前每页显示多少条数据
      },
    };
  },
  created() {
    this.getConfersList();
  },
  mounted() {},
  methods: {
    async getConfersList() {
      if (this.currentRole === "admin") {
        let res = await getAllConfers({
          params: this.queryInfo,
        });
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }
        this.conferList = res.data;
      } else {
        let res = await getAttendConfers(this.userProfile.username);
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }
        this.conferList = res.data;
      }
    },
    searchManyFunc() {},
    transAddDialogVisible() {},
  },
};
</script>

<style>
</style>