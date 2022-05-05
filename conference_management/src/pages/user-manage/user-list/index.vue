

<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 绑定自定义事件 -->
        <Search v-on:searchMany="searchManyFunc" />
        <AddButton caption="添加用户" v-on:addDialog="transAddDialogVisible" />
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <!-- 下面这一个column添加的是索引链 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="rolelist" label="角色">
          <template slot-scope="scope">
            <el-tag
              v-for="(oneRole, index) in scope.row.rolelist"
              :key="index"
              >{{ oneRole }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="interest" label="兴趣领域"> </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <!-- {{scope.row}} -->
            <!-- 修改按钮   @click="showEditDialog(scope.row.id)"-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
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

    <!-- 添加用户的对话框 -->
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
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="rolelist">
              <el-checkbox-group v-model="addForm.rolelist">
                <el-checkbox
                  v-for="(item, i) in allRoleList"
                  :key="i"
                  :label="item"
                ></el-checkbox>
                <!-- <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox> -->
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="兴趣领域" prop="interest">
              <el-select v-model="addForm.interest" placeholder="请选择">
                <el-option
                  v-for="item in options"
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
        <el-button type="primary" @click="addUserFuc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Search from "@/components/Search.vue";
import AddButton from "@/components/AddButton.vue";
import Pagination from "@/components/Pagination.vue";
import { getUsers, addUser } from "@/api";
import { mapState } from "vuex";
export default {
  name: "Users-list",
  components: { Breadcrumb, Search, AddButton, Pagination },
  computed: {
    ...mapState("permission", ["allRoleList"]),
  },
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return callback();
      }

      callback(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }

      callback(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1, // 当前的页数
        pagesize: 10, // 当前每页显示多少条数据
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        // 添加用户的表单数据
        username: "",
        password: "",
        email: "",
        mobile: "",
        rolelist: [],
        interest: "",
      },
      addFormRules: {
        // 添加表单的验证规则对象
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10",
            trigger: "blur",
          },
        ],

        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 10,
            message: "密码的长度在6~10",
            trigger: "blur",
          },
        ],

        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],

        mobile: [
          {
            required: true,
            message: "请输入手机",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],

        rolelist: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur",
          },
        ],
        interest: [
          {
            required: true,
            message: "请选择兴趣领域",
            trigger: "blur",
          },
        ],
      },
       options: [{
          value: '人工智能',
          label: '人工智能'
        }, {
          value: '物联网',
          label: '物联网'
        }, {
          value: '大数据',
          label: '大数据'
        }, {
          value: '信息安全',
          label: '信息安全'
        }, {
          value: '云计算',
          label: '云计算'
        }],
        value: ''
      
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let res = await getUsers({
        params: this.queryInfo,
      });
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.message);
      }
      this.userList = res.data;
      this.total = res.total;
      this.$message.success(res.meta.message);
    },
    // 根据字段搜索更新显示数据
    searchManyFunc(queryP) {
      this.queryInfo.query = queryP;
      this.getUserList();
    },
    // 改变添加用户对话框的可见
    transAddDialogVisible() {
      this.addDialogVisible = !this.addDialogVisible;
    },

    selectPageUpdateList(newQueryInfo) {
      this.queryInfo = newQueryInfo;
      this.getUserList();
    },
    addUserFuc() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await addUser(this.addForm)
        console.log(res)
      })
    },
    // 监听添加用户对话框的关闭事件，通过ref引用拿到表单form的dom然后进行重置操作
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 5px;
}

.el-form,
.dialog-footer {
  margin-right: 30px;
}
</style>