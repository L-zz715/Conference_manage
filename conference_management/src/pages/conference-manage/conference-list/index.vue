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

      <!-- 会议列表区 -->
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

      <!-- 分页控制 -->
      <Pagination
        :getQueryInfo="queryInfo"
        :totalNum="total"
        v-on:updateList="selectPageUpdateList"
      />
    </el-card>

    <!-- 创建会议的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会议名称" prop="confername">
              <el-input v-model="addForm.confername"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主题" prop="title">
              <el-input v-model="addForm.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="领域" prop="topic">
              <el-select
                v-model="addForm.topic"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in interestOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主席姓名" prop="chairname">
              <el-input v-model="addForm.chairname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会议日期" prop="date">
              <el-date-picker
                v-model="addForm.date"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="与会人员" prop="attendPpl">
              <el-select
                v-model="addForm.attendPpl"
                multiple
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in usernameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConferFuc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Search from "@/components/Search.vue";
import AddButton from "@/components/AddButton.vue";
import Pagination from "@/components/Pagination.vue";
import { getAllConfers, getAttendConfers, getAllUsers } from "@/api";
import { mapState } from "vuex";

export default {
  name: "conferences-list",
  components: { Breadcrumb, Search, AddButton, Pagination },
  computed: {
    ...mapState("permission", ["userProfile"]),
    ...mapState(["currentRole","interestOptions"]),
  },
  mounted(){
  },
  data() {
    return {
      conferList: [],
      queryInfo: {
        query: "",
        pagenum: 1, // 当前的页数
        pagesize: 10, // 当前每页显示多少条数据
      },
      total: 0,
      addDialogVisible: false,
      addForm: {
        // 创建会议的表单数据
        confername: "",
        title: "",
        topic: "",
        chairname: "",
        date: "",
        attendPpl: [],
      },
      addFormRules: {
        // 添加表单的验证规则对象
        confername: [
          {
            required: true,
            message: "请输入会议名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 15,
            message: "用户名的长度在2~15",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入会议主题",
            trigger: "blur",
          },
          {
            min: 2,
            max: 15,
            message: "用户名的长度在2~15",
            trigger: "blur",
          },
        ],
        topic: [
          {
            required: true,
            message: "请选择领域",
            trigger: "blur",
          },
        ],
        chairname: [
          {
            required: true,
            message: "请输入会议名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 15,
            message: "用户名的长度在2~15",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "请选择会议日期",
            trigger: "blur",
          },
        ],
        attendPPl: [
          {
            required: true,
            message: "请选择与会人员",
            trigger: "blur",
          },
        ],
      },
      usernameList: [],
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
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }
        this.conferList = res.data;
        this.total = res.total;
      } else {
        let res = await getAttendConfers(this.userProfile.username, {
          params: this.queryInfo,
        });
        // console.log("@@",res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }
        this.conferList = res.data;
        this.total = res.total;
      }
    },
    searchManyFunc(queryP) {
      this.queryInfo.query = queryP;
      this.getConfersList();
    },
    async transAddDialogVisible() {
      let res = await getAllUsers()
      console.log("@@@",res)
      if(res.meta.status !== 200){
        this.message.error(res.meta.message)
      }
      res.data.forEach(item => {
        if(!item.username.include('admin')){
        this.usernameList.push(item.username)
        }
      });
      this.addDialogVisible = !this.addDialogVisible;
    },
    selectPageUpdateList(newQueryInfo) {
      this.queryInfo = newQueryInfo;
      this.getConfersList();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addConferFuc(){}
  },
};
</script>

<style>
</style>