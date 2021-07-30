<template>
  <div class="login_container">
    <!--标题-->
    <div class="container">
      <div class="title" style="margin-left:0px;">激</div>
      <div class="title">光</div>
      <div class="title">模</div>
      <div class="title">拟</div>
      <div class="title">对</div>
      <div class="title">抗</div>
      <div class="title">系</div>
      <div class="title">统</div>
    </div>
    <div class="login_box">
      <!--登录表单-->
      <el-form ref="loginFormRef"
               :model="loginForm"
               label-width="0px"
               class="login_form"
               :rules="loginFormRules">

        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
                    prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password"
                    prefix-icon="el-icon-lock"
                    type="password"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    console.log('登录界面')
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // this.$refs.loginFormRef.validate(async (valid) => {
      //   console.log(valid)
      //   if (!valid) return
      //   const { data: res } = await this.$http.post('login', this.loginForm)
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('登录失败')
      //   } else {
      //     this.$message({
      //       message: '恭喜你，登录成功',
      //       type: 'success'
      //     })
      //     // 将token保存在sessionstorage中，以便之后功能确定登录状态
      //     window.sessionStorage.setItem('token', res.data.token)
      //     this.$router.push('/home')
      //   }
      // })
      window.sessionStorage.setItem('token', 'admin')
      this.$router.push('/home')
    }
  }
}

</script>
<style lang="less" scoped>
.login_container {
  margin: 0;
  padding: 0;
  background: -webkit-linear-gradient(to top, #43c6ac, #191654);
  background: linear-gradient(to top, #43c6ac, #191654);
  height: 100%;
  width: 100%;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 250px;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
//标题
.container{
  width: 60%;
  height:10%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%,-20%);
}
.title{
  width: 68.031px;
  font-family: fira code;
  font-size: 1.8cm;
  margin-left: 25px;
  filter: blur(1px);
  -webkit-animation: annimate 3.5s linear infinite;
  animation: annimate 3.5s linear infinite;
}
/*span:nth-child(1){
  animation-delay: 0s;
}
span:nth-child(2){
  animation-delay: 0.5s;
}
span:nth-child(3){
  animation-delay: 1s;
}
span:nth-child(4){
  animation-delay: 1.5s;
}
span:nth-child(5){
  animation-delay: 2s;
}
span:nth-child(6){
  animation-delay: 2.5s;
}
span:nth-child(7){
  animation-delay: 3s;
}
span:nth-child(8){
  animation-delay: 3.5s;
}*/
@keyframes annimate {
  0%,100%{
    width: 68.031px;
    color: #fff;
    filter: blur(1px);
    text-shadow: 0 0 10px #1e90ff,
    0 0 20px #1e90ff,
    0 0 30px #1e90ff,
    0 0 40px #1e90ff,
    0 0 100px #1e90ff,
    0 0 200px #1e90ff,
    0 0 300px #1e90ff,
    0 0 400px #1e90ff;
  }
  25%,75%{
    width: 68.031px;
    color: #111;
    filter: blur(0px);
    text-shadow: none;
  }
}
</style>
