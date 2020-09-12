<!-- 登录组件 -->
<template>
<div class='login_container'>
  <div class="login_box">
    <!-- 头像区域 -->
    <div class="avatar_box">
      <img src="@/assets/img/sun.png" alt="">
    </div>
    <!-- 登录表单区域 -->
    <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginRules" ref="loginForm">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input placeholder="username" v-model="loginForm.username"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          placeholder="password"
          v-model="loginForm.password"
          :type="pwdType"></el-input>
        <span class="show_pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item class="btns">
        <el-button @click="handleLogin()" :loading="loading" type="primary" round>登录</el-button>
        <el-button @click="resetForm()" type="info" round>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
// 导入封装的axios网络模块
import request from '@/network/request'
export default {
  name: 'Login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        // 通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名
        // blur表示鼠标失去焦点
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 自定义校验规则
        password: { required: true, trigger: 'blur', validator: validatePass }
      },
      pwdType: 'password',
      loading: false // 是否加载中
    }
  },
  methods: {
    // 切换隐藏和显示密码的图标
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 重置表单，引用element的组件实现
    resetForm() {
      // $refs是组件中的属性，通过this.$refs.子组件中的ref名称.子组件中的方法或属性,本质上就是父组件访问子组件
      // 调用element form里面的 resetFields方法
      this.$refs.loginForm.resetFields()
    },
    // 登录的预验证，调用element form里面的validate方法
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // this.$store.dispatch('Login', this.loginForm).then(() => {
          //   this.loading = false
          //   this.$router.push({ path: this.redirect || '/' })
          // }).catch(() => {
          //   this.loading = false
          // })
          request({
            url: 'login',
            method: 'post',
            data: this.loginForm
          }).then(resolve => {
            if (resolve.meta.status !== 200) {
              return this.$message({
                message: '登录失败',
                type: 'error'
              })
            }
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            // 之后的步骤：
            // 1、将登录成功后的token保存到客户端的sessionStorge中
            // 1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            // 1.2 token只能在单曲网站打开期间生效，故保存到session
            window.sessionStorage.setItem('token', resolve.data.token)
            // 2、跳转到主页面home
            this.$router.push('/home')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>

<style scoped>
  .login_container {
    background-color: #2d3a4b;
    height: 100%;
  }

  .login_box {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    width: 500px;
    height: 300px;
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px, solid, #eee;
    border-radius: 50%;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
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

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .el-input {
    display: inline-block;
    width: 85%;
  }
  .show_pwd {
    position: absolute;
    right: 30px;
    top: 7px;
    font-size: 15px;
    cursor: pointer;    /*光标样式*/
    user-select: none; /*控制用户能否选中文本*/
  }
</style>
