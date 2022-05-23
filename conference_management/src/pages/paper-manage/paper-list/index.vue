<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 绑定自定义事件 -->
        <Search v-on:searchMany="searchManyFunc" />
        <el-button
          type="primary"
          @click="transSubmitRoute"
          :disabled="currentRole !== 'author'"
          >添加文章
        </el-button>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="paperList" style="width: 100%" border stripe>
        <!-- 下面这一个column添加的是索引链 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="标题:">
                <span>{{ props.row.title }}</span>
              </el-form-item>
              <el-form-item label="作者姓名:">
                <span>{{ props.row.authorName }}</span>
              </el-form-item>
              <el-form-item label="领域:">
                <span>{{ props.row.topic }}</span>
              </el-form-item>
              <el-form-item label="会议名称:">
                <span>{{ props.row.conferences[0].confername }}</span>
              </el-form-item>
              <el-form-item label="文章内容:">
                <span>{{ props.row.content }}</span>
              </el-form-item>
              <el-form-item label="审核：">
                <span v-for="(obj, index) in props.row.reviewInfo" :key="index"
                  >审核人员姓名：{{ obj.reviewerName }}<br/>评论标题：{{ obj.reviewTitle }}<br/>评论内容：{{ obj.content }}
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="authorName" label="作者姓名"> </el-table-column>
        <el-table-column prop="topic" label="领域"> </el-table-column>
        <el-table-column label="会议名称">
          <template slot-scope="scope">
            {{ scope.row.conferences[0].confername }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮   @click="showEditDialog(scope.row.id)"-->
            <el-button
              :disabled="currentRole !== 'admin' && currentRole !== 'author'"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              :disabled="currentRole !== 'admin' && currentRole !== 'author'"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removePaperById(scope.row._id)"
            ></el-button>

            <!-- 分配审核按钮 -->
            <el-button
              :disabled="currentRole !== 'admin' && currentRole !== 'chair'"
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showAssignDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改文章的对话框 -->
    <el-dialog
      title="修改文章信息"
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
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="editForm.title"></el-input>
        </el-form-item>

        <el-form-item label="作者姓名" prop="authorName">
          <el-input
            v-model.trim="editForm.authorName"
            :disabled="!userProfile.username.includes('admin')"
          ></el-input>
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
      </el-form>
      <!-- 底部区域 -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPaperInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配审核人员的对话框 -->
    <el-dialog
      title="分配文章审核人员"
      :visible.sync="assignDialogVisible"
      width="50%"
      @close="assignDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="assignForm"
        :rules="assignFormRules"
        ref="assignFormRef"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="assignForm.title" disabled></el-input>
        </el-form-item>

        <el-form-item label="审核人员" prop="reviewerName">
          <el-select
            v-model="assignForm.reviewerName"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in reviewers"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assiginReviewer">确 定</el-button>
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
  getAllUsers,
  getPapers,
  getPapersByAuthor,
  deletePaper,
  editPaper,
  searchPaper,
  reviewPapers,
  assignReviewer,
  searchReview,
} from "@/api";
import { mapState } from "vuex";
export default {
  name: "Papers-list",
  components: { Breadcrumb, Search, AddButton, Pagination },
  data() {
    return {
      paperList: [],
      reviewInfo: [],
      queryInfo: {
        query: "",
        pagenum: 1, // 当前的页数
        pagesize: 10, // 当前每页显示多少条数据
      },
      total: 0,
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        title: [
          {
            required: true,
            message: "请输入标题",
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
      },
      assignDialogVisible: false,
      reviewers: [],
      assignForm: {},
      assignFormRules: {
        reviewerName: [
          {
            required: true,
            message: "请选择审核人员",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getPapersFunc();
  },
  computed: {
    ...mapState(["interestOptions", "currentRole"]),
    ...mapState("permission", ["userProfile"]),
  },
  mounted() {},
  methods: {
    async getPapersFunc() {
      // 根据不同的角色显示不同的文章列表
      if (this.currentRole === "admin") {
        const res = await getPapers({
          params: this.queryInfo,
        });

        if (res.meta.status !== 200) {
          this.$message.error(res.meta.message);
        }
        this.paperList = res.data;
      } else if (this.currentRole === "chair") {
        let papers = [];
        const res = await getPapers({
          params: this.queryInfo,
        });

        // 判断此用户创建的会议，只显示属于此用户创建的会议的文章列表
        res.data.forEach((item) => {
          if (item.conferences[0].chairname === this.userProfile.username) {
            papers.push(item);
          }
        });
        this.paperList = papers;
      } else if (this.currentRole === "reviewer") {
        const res = await reviewPapers(this.userProfile.username, {
          params: this.queryInfo,
        });
        // console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.message);
        }
        this.paperList = res.data;
      } else {
        // 根据作者名（用户名）获得文章列表
        const res = await getPapersByAuthor(this.userProfile.username, {
          params: this.queryInfo,
        });

        if (res.meta.status !== 200) {
          this.$message.error(res.meta.message);
        }
        this.paperList = res.data;
      }

      // 增加保存review的array
      this.paperList.forEach((i) => {
        // console.log("££", i.reviewList);
        i.reviewInfo = [];
      });

      // 获取每个review信息并保存
      this.paperList.forEach((i) => {
        i.reviewList.forEach(async (r) => {
          let res = await searchReview(r);
          i.reviewInfo.push(res.data);
        });
      });
    },

    searchManyFunc(queryP) {
      this.queryInfo.query = queryP;

      this.getPapersFunc();
    },

    // 跳转到提交文章界面
    transSubmitRoute() {
      this.$store.commit("permission/SET_CURRENTMENU", "paper-submit");
      this.$router.push("paperSubmit");
    },

    async showEditDialog(paperId) {
      const res = await searchPaper(paperId);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message);
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    editPaperInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await editPaper(this.editForm._id, {
          title: this.editForm.title,
          authorName: this.editForm.authorName,
          topic: this.editForm.topic,
        });
        console.log(res);

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }

        this.editDialogVisible = false;
        this.$message.success(res.meta.message);

        this.getPapersFunc();
      });
    },

    // 删除paper
    removePaperById(paperId) {
      this.$confirm("此操作将永久删除该" + "文章" + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deletePaper(paperId);
          if (res.meta.status !== 200) {
            this.$message.error("删除" + "文章" + "失败");
          }
          this.$message.success("删除" + "文章" + "成功");

          this.getPapersFunc();
        })
        .catch(() => {
          return this.$message.info("已取消删除");
        });
    },

    // 分配审核人员
    async showAssignDialog(paper) {
      let usersRes = await getAllUsers();
      // const paperRes = await searchPaper(paper._id);

      let reviewers = [];
      usersRes.data.forEach((item) => {
        if (item.rolelist.includes("reviewer")) {
          reviewers.push(item.username);
        }
      });
      this.reviewers = reviewers;
      this.assignForm.paperId = paper._id;
      this.assignForm.title = paper.title;
      this.assignDialogVisible = true;
    },

    assignDialogClosed() {
      this.$refs.assignFormRef.resetFields();
    },

    // 分配审核人员
    assiginReviewer() {
      this.$refs.assignFormRef.validate(async (valid) => {
        if (!valid) return;

        let res = await assignReviewer(
          this.assignForm.reviewerName,
          this.assignForm.paperId
        );

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.message);
        }

        this.assignDialogVisible = false;
        this.$message.success(res.meta.message);
        this.getPapersFunc();
      });
    },
  },
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  color: #99a9bf;
}

.demo-table-expand span {
  font-size: 12px;
  display: block;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
  word-break: break-all;
}
</style>