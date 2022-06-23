<template>
  <div class="login_container">
    <div class="head">
      <div class="title">
        <img src="@/assets/newIcon1.png" alt="会议图标" />
        <h1>会议管理系统CMS</h1>
      </div>
    </div>
    <div class="login_box">
      <h2>Login</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="25%"
        class="login_form"
      >
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="loginForm.email" prefix-icon="el-icon-user-solid">
          </el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginFuc">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, getProfile } from "@/api";

export default {
  name: "Login",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return callback();
      }

      callback(new Error("请输入合法的邮箱"));
    };
    return {
      loginForm: {
        email: "admin12@adm.com",
        password: "123456",
      },
      loginFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录
    loginFuc() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;

        //调用封装的login
        const res = await login(this.loginForm);
        if (res.meta.status !== 200) {
          return this.$message.error("登录失败");
        }
        this.$message.success("登录成功");

        //保存token
        let token = res.token;
        let roleList = res.user.rolelist;
        this.$store.commit("LOGIN_IN", token);

        //保存角色信息
        this.$store.commit("SET_USERROLELIST", roleList);
        this.$store.commit("SET_CURRENTROLE", roleList[0]);
        window.sessionStorage.setItem("currentRole", roleList[0]);
        //跳转首页
        this.$router.replace("/").catch(() => {});
      });
    },
    
    // 重置登录信息
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.head {
  height: 15%;
  background-color: #fff;
}
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  border-radius: 3%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 16px 20px 0 rgba(0, 0, 0, 0.4);
}

.login_form {
  width: 90%;
  position: absolute;
  bottom: 0;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.title {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}

img {
  position: relative;
  float: left;
  top: 20px;
}

h1,h2{
  font-family: "Comic Sans MS", "Comic Sans", cursive;
}

h1 {
  float: left;
}

h2 {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}


</style>