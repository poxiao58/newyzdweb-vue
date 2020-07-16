<template>
  <div class="app-wrapper">
    <!-- <section class="fog">
      <figure class="absolute-bg"></figure>
      <div class="fog__container">
          <div class="fog__img fog__img--first"></div>
          <div class="fog__img fog__img--second"></div>
      </div>
    </section> -->
    <div class="ntt_loginPage">
      <!--<div class="ntt-avtar float-l">-->
        <!--<div class="ntt-avtar1">-->
          <!--<div class="code"></div>-->
          <!--<p>扫描下载APP <br>一键控制全局信息</p>-->
        <!--</div>-->
        <!--<div class="ntt-avtar2">-->
          <!--<div class="code"></div>-->
          <!--<p>更多信息扫描关注<br>农行微信公众平台</p>-->
        <!--</div>-->
      <!--</div>-->
      <div class="ntt_loginForm float-l">
        <el-form class="login-form" auto-complete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
          <h3>用户登录</h3>
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="username" type="text" v-model="loginForm.username" auto-complete="on" placeholder="请输入您的账号" maxlength="11" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"/>
            </span>
            <el-input name="password" type="password" v-model="loginForm.password" auto-complete="on"
              placeholder="请输入您的登录密码" maxlength="24" @keyup.enter.native="handleLogin"></el-input>
          </el-form-item>
          <el-form-item class="log-box" align="right">
            <el-button class="log-btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入您的账号',  trigger: 'blur' }],
        password: [ { required: true, message: '请输入您的登录密码', trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      var that = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          that.loading = true
          that.$store.dispatch('Login', that.loginForm).then(() => {
            that.$router.replace({ path: '/' })
          })
          setTimeout(() => {
            that.loading = false
          }, 3000);
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import './login.scss';
</style>
