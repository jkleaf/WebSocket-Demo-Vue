<template>
  <h1>
    User Info
  </h1>
<!--  &lt;!&ndash;  <el-tabs type="border-card">&ndash;&gt;-->
<!--  &lt;!&ndash;    <el-tab-pane label="登录">&ndash;&gt;-->
<!--  <div class="block">-->
<!--    <el-form ref="loginForm" :rules="rules" :model="loginForm" label-width="0px" auto-complete="off">-->
<!--      <el-form-item prop="username">-->
<!--        <el-input v-model="loginForm.username" placeholder="用户名"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-button type="primary" style="width: 100%" @click="loginSubmit">登录</el-button><br><br>-->
<!--      <el-button type="primary" style="width: 100%" @click="regSubmit">注册</el-button>-->
<!--    </el-form>-->
<!--    &lt;!&ndash;        <el-form ref="loginForm" :rules="rules" v-model="loginForm" label-position="left"&ndash;&gt;-->
<!--    &lt;!&ndash;                 label-width="0px" v-loading="loading">&ndash;&gt;-->
<!--    &lt;!&ndash;          <h3 class="login_title">棋客登录</h3>&ndash;&gt;-->
<!--    &lt;!&ndash;          <el-form-item prop="username">&ndash;&gt;-->
<!--    &lt;!&ndash;            <el-input v-model="loginForm.username" auto-complete="off"&ndash;&gt;-->
<!--    &lt;!&ndash;                      placeholder="用户名"></el-input>&ndash;&gt;-->
<!--    &lt;!&ndash;          </el-form-item>&ndash;&gt;-->
<!--    &lt;!&ndash;        </el-form>&ndash;&gt;-->
<!--  </div>-->
<!--  &lt;!&ndash;    </el-tab-pane>&ndash;&gt;-->
<!--  &lt;!&ndash;    <el-tab-pane label="注册">&ndash;&gt;-->

<!--  &lt;!&ndash;    </el-tab-pane>&ndash;&gt;-->
<!--  &lt;!&ndash;  </el-tabs>&ndash;&gt;-->

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
    methods: {
      loginSubmit: function () {
        sessionStorage['token'] = 'eyJhbGciOiJIUzI1NiJ9.eyJhdXRob3JpdGllcyI6IiIsInN1YiI6InRlc3RlciIsImV4cCI6MTU3NTcxNDg5MX0.PppoQnJao9o9GPyK6f4zzecYNWqZxSwTtQFziUohnUQ';
        console.log('Bearer ' + sessionStorage['token'])
        this.requestWithToken('/test', 'get', {}, (res) => {
          // this.requestWithToken('/test', 'get', {}, (res) => {
          //   this.$router.replace({path: '/home'})
          // }, (res) => {
          // })
        }, (res) => {
        })
      },
      regSubmit: function () {
        this.requestWithoutToken('/login/captcha', 'get', '', res => {

        }, res => {
        });
      }
    }
  }
</script>

<style scoped>

</style>
