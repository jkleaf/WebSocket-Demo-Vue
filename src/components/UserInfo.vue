<template>
<!--  <el-tabs type="border-card">-->
<!--    <el-tab-pane label="登录">-->
      <div class="block">
        <el-form ref="loginForm" :rules="rules" :model="loginForm" label-width="0px" auto-complete="off">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
        </el-form>
<!--        <el-form ref="loginForm" :rules="rules" v-model="loginForm" label-position="left"-->
<!--                 label-width="0px" v-loading="loading">-->
<!--          <h3 class="login_title">棋客登录</h3>-->
<!--          <el-form-item prop="username">-->
<!--            <el-input v-model="loginForm.username" auto-complete="off"-->
<!--                      placeholder="用户名"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
      </div>
<!--    </el-tab-pane>-->
<!--    <el-tab-pane label="注册">-->

<!--    </el-tab-pane>-->
<!--  </el-tabs>-->

</template>

<script>
  export default {
    data() {
      return {
        loginForm: {
          username: 'tester',
          password: '666'
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
        loading: false,
      }
    },
  }
</script>

<style scoped>

</style>
