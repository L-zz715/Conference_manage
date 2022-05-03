<template>
  <!-- <el-container> -->
  <el-header>
    <span class="title">会议管理系统</span>
    <span class="role_label">你好，{{username}} </span>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      currentUserRoleList: [],
      value: '',
      username:''
    };
  },
  created() {
    this.getRoleList();
    this.value = this.currentRole
    this.username = this.userProfile.username
  },
  computed: {
    ...mapState(["UserRoleList", "currentRole"]),
    ...mapState("permission",["userProfile"])
  },
  methods: {
    getRoleList() {
      this.currentUserRoleList = this.UserRoleList.split(",");
    },
    getUserProfile(){

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
  margin-left: 55%;
}

.el-button{
  margin-left: 1%;

}

</style>