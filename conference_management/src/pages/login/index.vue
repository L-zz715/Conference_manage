<template>
  <div class="login_container">
    <div class="login_box">
      <h3>Login</h3>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="25%"
        class="login_form"
      >
        <el-form-item label="邮箱：" prop="email">
          <el-input
            v-model="loginForm.email"
            prefix-icon="el-icon-user-solid"
          >
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
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" round @click="loginToHome">login</el-button>
    </div>
  </div>
</template>

<script>
import {login} from '@/api'

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
    async login() {
      let data = await login(this.loginForm)
      console.log(data)
      // this.$refs.loginFormRef.validate(async (valid) => {
      //   if (!valid) return;
      //   // console.log(this)

      //   const { data: res } = await this.$http.post("login", this.loginForm);
      //   console.log("sf", res);
      //   if (res.meta.status !== 200) {
      //     return this.$message.error("登录失败");
      //   }

      //   this.$message.success("登录成功");

      //   //保存token
      //   window.sessionStorage.setItem("token", res.data.token);

        // this.$router.push("/home");
      // });
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    loginToHome(){
      this.$router.push('/home')
    }
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    //less  的语法嵌套
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;

    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  // float: right;
  display: flex;
  justify-content: flex-end;
}

.login_form {
  width: 90%;
  position: absolute;
  bottom: 0;
}
</style>