<template>
  <el-tabs type="border-card">
    <el-tab-pane label="登录">
      <div class="block">
        <el-form ref="loginForm" :rules="rules" :model="loginForm" label-width="0px" auto-complete="off"
                 v-loading="loading">
          <h3 class="login_title">棋客登录</h3>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <!--        <el-form ref="loginForm" :rules="rules" v-model="loginForm" label-position="left"-->
          <!--                 label-width="0px">&lt;!&ndash;v-loading="loading"&ndash;&gt;-->
          <!--          <h3 class="login_title">棋客登录</h3>-->
          <!--          <el-form-item prop="username">-->
          <!--            <el-input v-model="loginForm.username" auto-complete="off"-->
          <!--                      placeholder="用户名"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="密码" show-password></el-input>
          </el-form-item>
          <el-form-item prop="captcha" style="text-align: left">
            <el-input v-model="verCode" placeholder="验证码" style="width: 250px; height:48px; margin-right: 50px">
            </el-input>
            <img id="verImg" :src="verifyImg" @click="switchCaptcha" width="130px" height="48px" style=""
                 :alt="loaded?'验证码加载中':'验证码加载失败'"/>
          </el-form-item>
          <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码
          </el-checkbox>
          <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%" @click="loginSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label="注册">
      <div class="block">
        <el-form ref="regValidateForm" :model="regValidateForm" status-icon :rules="regRules" label-width="100px"
                 auto-complete="off" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="regValidateForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
            <el-input v-model="regValidateForm.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="regValidateForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" v-model="regValidateForm.checkPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="regSubmit('regValidateForm')">注册</el-button>
            <el-button @click="resetForm('regValidateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  // import {requestWithToken} from '../utils/api.js';
  import api from '../utils';

  export default {
    data() {
      const validateAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (value.length < 6 || value.length > 16) {
          callback(new Error('用户名字符数应在6~16位之间'));
        } else { //todo
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6 || value.length > 16) {
          callback(new Error('密码字符数应在6~16位之间'));
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
        } else if (value.length < 6 || value.length > 16) {
          callback(new Error('密码字符数应在6~16位之间'));
        } else if (this.regValidateForm.checkPassword !== '' && value !== this.regValidateForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const validateCaptcha = (rule, value, callback) => { //todo 动态检验
        if (value === '') {
          callback(new Error('验证码不能为空!'));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          username: 'tester',
          password: '666666'
        },
        rules: {
          username: [{
            required: true,
            validator: validateAccount,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          captcha: [{
            required: true,
            validator: validateCaptcha,
            trigger: 'blur'
          }]
        },
        regRules: {
          username: [{
            required: true,
            validator: validateAccount,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPassword: [{
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }],
        },
        checked: true,
        regValidateForm: {
          username: '',
          email: '',
          password: '',
          checkPassword: ''
        },
        loading: false,
        verKey: '',
        verCode: '',
        verifyImg: '',
        loaded: true,
        // verImgIsCorrect: false,
        timer: '',
      }
    },
    methods: {
      getCaptcha: function () {
        api.requestWithoutToken('/login/captcha', 'get', '', res => {
          this.loaded = true;
          let captcha = JSON.parse(res.data.data);
          this.verKey = captcha.verKey;
          this.verifyImg = captcha.image;
        }, res => {
          this.loaded = false;
        });
      },
      switchCaptcha: function (event) {
        this.getCaptcha()
        // let id = event.currentTarget.id;
      },
      // checkCaptcha: function () {
      //   let isCorrect = false;
      //   let captchaParams = {
      //     verKey: this.verKey,
      //     verCode: this.verCode
      //   };
      //   this.requestWithoutToken('/login/captcha', 'post', captchaParams, res => {
      //     let msg = res.data.message;
      //     if (msg === '验证码错误!') {
      //       this.$message({
      //         message: msg,
      //         type: 'error'
      //       })
      //       isCorrect = false;
      //       // this.verImgIsCorrect=false;
      //     } else {
      //       isCorrect = true; // because of async
      //       // this.verImgIsCorrect=true;
      //     }
      //   }, res => {
      //     console.log("error")
      //     isCorrect = false;
      //   })
      //   console.log("isCorrect=" + isCorrect)
      //   return isCorrect;
      // },
      loginSubmit: function () {
        const _this = this;
        this.$refs['loginForm'].validate(valid => { //todo
          if (valid) {
            this.loading = true;
            let captchaParams = {
              verKey: this.verKey,
              verCode: this.verCode
            };
            api.requestWithoutToken('/login/captcha', 'post', captchaParams, res => {
              let msg = res.data.message;
              if (msg === '验证码错误!') {
                this.$message({
                  message: msg,
                  type: 'error'
                })
                _this.loading = false;
              } else {
                api.postJSONRequest('/login', _this.loginForm, (res) => {
                  console.log(res.data);
                  if (res.data.code === '200') {
                    console.log(res.data);
                    this.$message({
                      message: res.data.msg,
                      type: 'success'
                    });
                    console.log('token before: ' + sessionStorage['token']);
                    sessionStorage['token'] = res.data.token;
                    sessionStorage['username'] = _this.loginForm.username; //sessionStorage
                    this.$store.state.user = {username: sessionStorage['username'], password: _this.loginForm.password};
                    console.log('token after: ' + sessionStorage['token']);
                    api.requestWithToken('/test', 'get', {}, (res) => {
                      this.$router.replace({
                        path: '/home'
                      });
                    }, (res) => {
                      console.log(res);
                    })
                    // TODO remember password
                    // if (_this.checked) {
                    //   localStorage.setItem('wsd_password', _this.loginForm.password);
                    // } else {
                    //   if (localStorage.getItem('wsd_password') != null) {
                    //     localStorage.removeItem('wsd_password');
                    //   }
                    // }
                  } else if (res.data.code === '401') {
                    this.$message({
                      message: res.data.msg,
                      type: 'error'
                    })
                    _this.loading = false;
                  }
                }, (res) => {
                  this.$message({
                    message: '服务器出问题了',
                    type: 'error'
                  })
                  _this.loading = false
                })
              }
            }, res => {
              console.log(res)
            })
          } else {
            console.log("invalid submit");
            return false;
          }
        });
      },
      regSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let regParams = {
              username: this.regValidateForm.username,
              password: this.regValidateForm.password,
              email: this.regValidateForm.email
            };
            api.postJSONRequest("/user/reg", regParams, res => {
              console.log(res.data)
              if (res.data.code === 200) {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                })
              } else if (res.data.code === 201) {
                this.$message({
                  message: res.data.message,
                  type: 'error'
                })
              }
            }, res => {
              console.log(res.data)
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            })
          } else {
            this.$message({
              message: '注册内容不合法!',
              type: 'error'
            })
            return false;
          }
        });
      },
      resetForm: function (formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.getCaptcha();
      this.timer = setInterval(this.getCaptcha, 1800000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
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
