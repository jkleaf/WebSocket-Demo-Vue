<template>
  <el-tabs type="border-card">
    <el-tab-pane label="登录">
      <div class="block">
        <el-form :rules="rules" label-position="left" v-model="loginForm" ref="loginForm"
                 label-width="0px" v-loading="loading">
          <h3 class="login_title">棋客登录</h3>
          <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.username"
                      auto-complete="off" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="loginForm.password"
                      auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-checkbox class="login_remember" v-model="checked"
                       label-position="left">记住密码
          </el-checkbox>
          <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%" @click="submitClick">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label="注册">
      <div class="block">
        <el-form :model="regValidateForm" status-icon :rules="regRules" ref="regValidateForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="用户名" prop="account">
            <el-input type="text" v-model="regValidateForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email"
                        :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
            <el-input v-model="regValidateForm.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="regValidateForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="regValidateForm.checkPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('regValidateForm')">注册</el-button>
            <el-button @click="resetForm('regValidateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
  export default {
    data() {
      const validateAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          //todo
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.regValidateForm.checkPassword !== '') {
            this.$refs.regValidateForm.validateField('checkPassword');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.regValidateForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        rules: {
          account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          checkPass: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
        regRules: {
          account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          pass: [{required: true, validator: validatePass, trigger: 'blur'}],
          checkPass: [{required: true, validator: validatePass2, trigger: 'blur'}],
        },
        checked: true,
        loginForm: {
          username: 'tester',
          password: '666'
        },
        regValidateForm: {
          username: '',
          email: '',
          password: '',
          checkPassword: ''
        },
        regForm:{
          username: '',
          email: '',
          password: '',
        },
        loading: false
      }
    },
    methods: {
      submitClick: function () {
        const _this = this;
        this.loading = true;
        // this.$refs['loginForm'].validate(valid=>{ //todo
        //   if(valid){
        //
        //   }else {
        //
        //   }
        // });
        this.postRequest('/login', _this.loginForm, (res) => {
          // this.$message({
          //   message: '登录成功',
          //   type: 'success'
          // })
          sessionStorage['token'] = res.data.token;
          sessionStorage['username'] = _this.loginForm.username;
          this.requestWithToken('/test', 'get', {}, (res) => {
            this.$router.replace({path: '/home'})
          }, (res) => {
            this.$router.replace({path: '/home'})
          })
        }, (res) => {
          this.$message({
            message: '登录失败',
            type: 'error'
          })
          _this.loading = false
        })
        // this.postRequest('/login', {
        //   username: this.loginForm.username,
        //   password: this.loginForm.password
        // }).then(resp => {
        //   _this.loading = false;
        //   if (resp && resp.status == 200) {
        //     var data = resp.data;
        //     _this.$store.commit('login', data.obj);
        //     var path = _this.$route.query.redirect;
        //     _this.$router
        //       .replace({path: path == '/' || path == undefined ? '/home' : path});
        //   }
        // });
      },
      submitForm: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
              message: '注册成功!',
              type: 'success'
            })
          } else {
            this.$message({
              message: '注册失败!',
              type: 'error'
            })
            return false;
          }
        });
      },
      resetForm: function (formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  .el-tabs--border-card {
    font-size: 25px;
    border-radius: 15px;
    background: #FFF;
    border: 1px solid #eaeaea;
    -webkit-box-shadow: 0 0 25px #cac6c6;
    box-shadow: 0 0 25px #cac6c6;
    margin: 150px 500px 150px 500px;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }

</style>
