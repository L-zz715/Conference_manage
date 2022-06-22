<template>
  <div>
    <el-card class="box-card">
      <h1>文章标题：{{ PaperTitle }}</h1>
      <h3>文章内容：</h3>
      <p>{{ PaperContent }}</p>
      <h2>文章审核：</h2>
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        style="width: 95%"
      >
        <el-form-item label="审核标题: " prop="reviewTitle">
          <el-input v-model.trim="addForm.reviewTitle" :disabled="addForm.reviewTitle !== ''"></el-input>
        </el-form-item>

        <!-- :disabled="!userProfile.username.includes('admin')" -->
        <el-form-item label="审核人: " prop="reviewerName">
          <el-input v-model.trim="addForm.reviewerName" disabled></el-input>
        </el-form-item>

        <el-form-item label="评论内容:" prop="content">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="addForm.content" :disabled="addForm.content !== ''"></quill-editor>
        </el-form-item>
      </el-form>

      <div class="submit-footer">
        <el-button @click="cacelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitReview">确 定</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { searchPaper, editReview } from "@/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      paperId: "",
      PaperTitle: "",
      PaperContent: "",
      addForm: {
        reviewTitle: "",
        reviewerName: "",
        content: "",
      },
      addFormRules: {
        reviewTitle: [
          {
            required: true,
            message: "请输入标题",
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
    };
  },
  created() {
    // console.log(this.$route.params.paperId);
    this.paperId = this.$route.params.paperId || "";
    this.addForm.reviewerName = this.userProfile.username;

    this.getPaper();
  },
  computed: {
    ...mapState("permission", ["userProfile"]),
  },
  methods: {
    async getPaper() {
      if (this.paperId === "") {
        this.$message.warning("请先选择要审核的文章！");
      } else {
        const res = await searchPaper(this.paperId);
        if (res.meta.status === 200) {
          this.PaperTitle = res.data.title;
          const reg = /<\/?.+?\/?>/g;
          this.PaperContent = res.data.content.replace(reg, " ").trim();
        }
      }
    },

    cacelSubmit() {
      this.$refs.addFormRef.resetFields();
      this.$store.commit("permission/SET_CURRENTMENU", "paper-list");
      this.$router.push("list");
    },

    submitReview() {
      console.log(this.addForm);
      this.$confirm("你确定要提交审核吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs.addFormRef.validate(async (valid) => {
             if (!valid) return;
            let res = await editReview(this.paperId,this.addForm.reviewerName, {
              reviewTitle: this.addForm.reviewTitle,
              content: this.addForm.content,
            });
             if (res.meta.status !== 200) {
              return this.$message.error(res.meta.message);
            }
            console.log(res)
          });
        })
        .catch(() => {
          return this.$message.info("已取消提交");
        });

      // this.$refs.addFormRef.resetFields();
      // this.$store.commit("permission/SET_CURRENTMENU", "paper-list");
      // this.$router.push("list");
    },
  },
};
</script>

<style>
</style>