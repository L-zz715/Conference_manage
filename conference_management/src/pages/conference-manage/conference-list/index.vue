<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 绑定自定义事件 -->
        <Search v-on:searchMany="searchManyFunc" />
        <AddButton
          caption="创建会议"
          v-on:addDialog="transAddDialogVisible"
          :curRole="currentRole"
        />
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
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮  -->
            <el-button
              :disabled="
                (scope.row.chairname !== userProfile.username &&
                  !userProfile.username.includes('admin')) ||
                (currentRole !== 'chair' && currentRole !== 'admin')
              "
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              :disabled="
                (scope.row.chairname !== userProfile.username &&
                  !userProfile.username.includes('admin')) ||
                (currentRole !== 'chair' && currentRole !== 'admin')
              "
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeConferById(scope.row._id)"
            ></el-button>
          </template>
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
              <el-input v-model.trim="addForm.confername"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主题" prop="title">
              <el-input v-model.trim="addForm.title"></el-input>
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
              <el-input v-model="addForm.chairname" :disabled="true"></el-input>
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
                  v-for="(item, i) in usernameList"
                  :key="i"
                  :label="item"
                  :value="item"
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

    <!-- 修改会议的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="会议名称" prop="confername">
          <el-input v-model.trim="editForm.confername"></el-input>
        </el-form-item>

        <el-form-item label="主题" prop="title">
          <el-input v-model.trim="editForm.title"></el-input>
        </el-form-item>

        <el-form-item label="领域" prop="topic">
          <el-select
            v-model="editForm.topic"
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

        <el-form-item label="会议日期" prop="date">
          <el-date-picker
            v-model="editForm.date"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="与会人员" prop="attendPpl">
          <el-select
            v-model="editForm.attendPpl"
            multiple
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, i) in usernameList"
              :key="i"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConferInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Search from "@/components/Search.vue";
import AddButton from "@/components/AddButton.vue";
import Pagination from "@/components/Pagination.vue";
import {
  getAllConfers,
  getAttendConfers,
  getAllUsers,
  addConference,
  editConference,
  searchConference,
  deleteConference,
} from "@/api";
import { mapState } from "vuex";

export default {
  name: "conferences-list",
  components: { Breadcrumb, Search, AddButton, Pagination },
  computed: {
    ...mapState("permission", ["userProfile"]),
    ...mapState(["currentRole", "interestOptions"]),
  },
  mounted() {},
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
      editDialogVisible: false,
      editForm: {
        // 创建会议的表单数据
        confername: "",
        title: "",
        topic: "",
        chairname: "",
        date: "",
        attendPpl: [],
      },
      editFormRules: {
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
      let res = await getAllUsers();
      console.log("@@@", res);
      if (res.meta.status !== 200) {
        this.message.error(res.meta.message);
      }
      res.data.forEach((item) => {
        if (!item.username.includes("admin")) {
          console.log(item);
          this.usernameList.push(item.username);
        }
      });
      this.addForm.chairname = this.userProfile.username;
      this.addDialogVisible = !this.addDialogVisible;
    },
    selectPageUpdateList(newQueryInfo) {
      this.queryInfo = newQueryInfo;
      this.getConfersList();
    },
    addDialogClosed() {
      this.usernameList = [];
      this.$refs.addFormRef.resetFields();
    },
    async addConferFuc() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await addConference(this.addForm);

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }
        this.$message.success(res.meta.message);

        this.addDialogVisible = false;
        this.getConfersList();
      });
    },
    editDialogClosed() {
      this.usernameList = [];
      this.$refs.editFormRef.resetFields();
    },
    editConferInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;

        console.log(this.editForm.date);
        const dt = new Date(this.editForm.date);

        // 解决时差问题
        // dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + "").padStart(2, "0");
        const d = (dt.getDate() + "").padStart(2, "0");
        const hh = (dt.getHours() + "").padStart(2, "0");
        const mm = (dt.getMinutes() + "").padStart(2, "0");
        const ss = (dt.getSeconds() + "").padStart(2, "0");
        this.editForm.date = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
        console.log(this.editForm.date);

        const res = await editConference(this.editForm._id, {
          confername: this.editForm.confername,
          title: this.editForm.title,
          topic: this.editForm.topic,
          date: this.editForm.date,
          attendPpl: this.editForm.attendPpl,
        });
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }

        this.editDialogVisible = false;
        this.$message.success(res.meta.message);
        this.getConfersList();
      });
    },

    // 展示编辑会议对话框
    async showEditDialog(conferId) {
      let res = await getAllUsers();
      // console.log("@@@", res);
      if (res.meta.status !== 200) {
        this.message.error(res.meta.message);
      }
      res.data.forEach((item) => {
        if (!item.username.includes("admin")) {
          console.log(item);
          this.usernameList.push(item.username);
        }
      });
      console.log(conferId);
      let conferRes = await searchConference(conferId);
      console.log(conferRes);
      this.editForm = conferRes.data;

      const dt = new Date(this.editForm.date);
      // 解决时差问题
      dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");
      const hh = (dt.getHours() + "").padStart(2, "0");
      const mm = (dt.getMinutes() + "").padStart(2, "0");
      const ss = (dt.getSeconds() + "").padStart(2, "0");
      this.editForm.date = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

      this.editDialogVisible = true;
    },
    async removeConferById(conferId) {
      this.$confirm("此操作将永久删除该" + "会议" + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteConference(conferId);

          if (res.meta.status !== 200) {
            return this.$message.error("删除" + "会议" + "失败");
          }
          this.$message.success("删除" + "会议" + "成功");

          this.getConfersList();
        })
        .catch(() => {
          return this.$message.info("已取消删除");
        });
    },
  },
};
</script>

<style>
</style>