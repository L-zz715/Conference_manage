

<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />
    <div>用户列表</div>

    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 绑定自定义事件 -->
        <Search v-on:searchMany="searchManyFunc" />
        <AddButton caption="添加用户" v-on:addDialog="transAddDialogVisible" />
      </el-row>
    </el-card>

    <!-- 用户列表区 -->
    <!-- <el-table :data="userList" style="width: 100%" border stripe> -->
    <!-- 下面这一个column添加的是索引链 -->
    <!-- <el-table-column type="index"> </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_names" label="角色"> 
        <template slot-scope="scope"> 
            <el-tag v-for="(oneRole,index) in scope.row.role_names" :key="index">{{ oneRole }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="interest_area" label="兴趣领域"> </el-table-column> -->
    <!-- <el-table-column label="状态">
        <template slot-scope="scope"> -->
    <!-- {{ scope.row.mg_state }} -->
    <!-- <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column> slot-scope="scope"-->
    <!-- <el-table-column label="操作" width="180px"> -->
    <!-- <template> -->
    <!-- {{scope.row}} -->
    <!-- 修改按钮   @click="showEditDialog(scope.row.id)"-->
    <!-- <el-button type="primary" icon="el-icon-edit" size="mini"></el-button> -->
    <!-- 删除按钮 -->
    <!-- <DeleteButton
            :usePath="toPath"
            :rowId="scope.row.id"
            deleteObj="用户"
            deleteCaption=""
            v-on:updateList="getUserList"
          /> -->

    <!-- 分配角色按钮   @click="setRole(scope.row)"-->
    <!-- <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip> -->
    <!-- </template> -->
    <!-- </el-table-column> -->
    <!-- </el-table> -->
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Search from "@/components/Search.vue";
import AddButton from "@/components/AddButton.vue";
import {getAllUsers} from '@/api'
export default {
  name: "Users-list",
  components: { Breadcrumb,Search,AddButton },
    data() {
  //       const testUsers = {
  //           username:'addd',
  //           email:'addd123@gmail.com',
  //           password:'1234123',
  //           mobile:'1854235478',
  //           'role_names':['admin','chair','author'],
  //           'interest_area':'AI'
  //       }
      return {
  //       queryInfo: {
  //         query: "",
  //         pagenum: 1, // 当前的页数
  //         pagesize: 10, // 当前每页显示多少条数据
  //       },
        userList: [],
  //       total: 0,

      }
    },
  created(){
    this.getUserList()
  },
  methods: {
    async getUserList(){
      let res = await getAllUsers()
      this.userList = res.data
      console.log('@@@',res)
    },
    // 根据字段搜索更新显示数据
    searchManyFunc(queryP) {},
    // 改变添加用户对话框的可见
    transAddDialogVisible() {},
  },
};
</script>

<style scoped>
/* .el-tag{
    margin: 5px;
} */
</style>