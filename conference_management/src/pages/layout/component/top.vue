<template>
  <!-- <el-container> -->
  <el-header>
    <span class="title">会议管理系统</span>
    <span class="role_label">你好， </span>
    <span >用户角色：</span>
    <el-select
      v-model="value"
      placeholder="请选择"
      @change="changeCurrentRole(value)"
      size="medium"
    >
      <el-option v-for="item in currentUserRoleList" :key="item" :value="item">
      </el-option>
    </el-select>

    <el-button type="danger" size="mini" round @click="logout"
      >log out</el-button
    >
  </el-header>
  <!-- </el-container> -->
</template>

<script>
import { fetchPermission } from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      currentUserRoleList: [],
      value: '',
    };
  },
  created() {
    this.getRoleList();
    this.value = this.currentRole
  },
  computed: {
    ...mapState(["UserRoleList", "currentRole"]),
  },
  methods: {
    getRoleList() {
      this.currentUserRoleList = this.UserRoleList.split(",");
    },
    logout() {
      this.$store.commit("LOGIN_OUT");
      this.$store.commit("CLEAR_USERROLELIST");
      this.$store.commit("CLEAR_CURRENTROLE")
      window.location.reload();
    },
    changeCurrentRole(role) {
      window.sessionStorage.setItem("currentRole", role);
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.el-header {
  background: rgb(16, 16, 129);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0;
  /* width: 100%; */
}

.el-header .title,span {
  font-size: 18px;
  color: #fff;
  margin-left: 15px;
}

.el-header .role_label{
  font-size: 18px;
  color: #fff;
  margin-left: 60%;
}

.el-button{
  margin-left: 1%;

}

</style>