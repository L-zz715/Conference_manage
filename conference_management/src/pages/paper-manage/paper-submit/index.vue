<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <el-card class="box-card">
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        style="width: 95%"
      >
        <el-form-item label="标题: " prop="title">
          <el-input v-model.trim="addForm.title"></el-input>
        </el-form-item>

        <!-- :disabled="!userProfile.username.includes('admin')" -->
        <el-form-item label="作者姓名: " prop="authorName">
          <el-input v-model.trim="addForm.authorName"></el-input>
        </el-form-item>

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

         <el-form-item label="会议" prop="conferId">
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

      </el-form>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getAttConferList } from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      addForm: {
        title: "",
        authorName: "",
        topic: "",
        conferId:""
      },
      conferNameList:[],
    };
  },
  components: { Breadcrumb },
  mounted() {},
  computed: {
    ...mapState(["interestOptions", "currentRole"]),
    ...mapState("permission", ["userProfile"]),
  },
  created() {
    this.getConferlists();
  },
  methods: {
    async getConferlists() {
      let res = await getAttConferList(this.userProfile.username);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message);
      }
      res.data.forEach(item => {
          this.conferNameList.push({
              conferId:item._id,
              confername:item.confername
              })
      });
      console.log(this.conferNameList)
    },
  },
};
</script>

<style scoped>
.el-form {
  margin-top: 15px;
  font-size: 12px;
}
</style>