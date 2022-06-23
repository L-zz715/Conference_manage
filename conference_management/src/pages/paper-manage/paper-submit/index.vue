<template>
  <div>
    <el-card class="box-card">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        style="width: 95%"
      >
        <el-form-item label="标题: " prop="title">
          <el-input v-model.trim="addForm.title"></el-input>
        </el-form-item>

        <el-form-item label="作者姓名: " prop="authorName">
          <el-input v-model="addForm.authorName" disabled></el-input>
        </el-form-item>

        <el-form-item label="领域: " prop="topic">
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

        <el-form-item label="会议: " prop="conferId">
          <el-select
            v-model="addForm.conferId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in conferNameList"
              :key="item.conferId"
              :label="item.confername"
              :value="item.conferId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容: " prop="content">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-form-item>
      </el-form>

      <div class="submit-footer">
        <el-button @click="cacelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitPaper">确 定</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAttConferList, addPaper } from "@/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      addForm: {
        title: "",
        authorName: "",
        topic: "",
        conferId: "",
        content: "",
      },
      addFormRules: {
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
        conferId: [
          {
            required: true,
            message: "请选择会议",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      conferNameList: [],
    };
  },
  mounted() {},
  computed: {
    ...mapState(["interestOptions", "currentRole"]),
    ...mapState("permission", ["userProfile"]),
  },
  created() {
    this.getConferlists();
  },
  methods: {
    // 获得可选择的会议列表（文章属于哪个会议）
    async getConferlists() {
      const res = await getAttConferList(this.userProfile.username);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message);
      }
      res.data.forEach((item) => {
        this.conferNameList.push({
          conferId: item._id,
          confername: item.confername,
        });
      });
      this.addForm.authorName = this.userProfile.username;
    },

    // 取消提交文章
    cacelSubmit() {
      this.$refs.addFormRef.resetFields();
      this.$store.commit("permission/SET_CURRENTMENU", "paper-list");
      this.$router.push("list");
    },

    // 提交文章
    submitPaper() {
      this.$confirm("你确定要提交这篇文章吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs.addFormRef.validate(async (valid) => {
            if (!valid) return;
            const res = await addPaper(this.addForm.conferId, {
              title: this.addForm.title,
              authorName: this.addForm.authorName,
              topic: this.addForm.topic,
              content: this.addForm.content,
            });
            
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.message);
            }
            this.$message.success(res.meta.message);
            this.$store.commit("permission/SET_CURRENTMENU", "paper-list");
            this.$router.push("list");
          });
        })
        .catch(() => {
          return this.$message.info("已取消提交");
        });
    },
  },
};
</script>

<style scoped>
.el-form {
  margin-top: 15px;
  font-size: 12px;
}

.submit-footer {
  display: flex;
  justify-content: center;
}

.submit-footer .el-button {
  margin-right: 30px;
}
</style>