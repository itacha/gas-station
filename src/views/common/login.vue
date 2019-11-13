<template>
  <div class="site-wrapper site-page--login" id="loginTemplate">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <div class="brand"></div>
          <h1 class="brand-info__text">欢迎使用</h1>
          <div class="line"></div>
          <p class="brand-info_text2">弘和智能加油站管理后台</p>
          <div class="line_right"></div>
        </div>
        <div class="login-main">
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <div class="label_login">账号</div>
            <el-form-item prop="loginName" style="margin-bottom:50px;">
              <!-- <el-input v-model="dataForm.loginName" placeholder="请输入登录账号"></el-input> -->
              <input
                type="text"
                v-model="dataForm.loginName"
                placeholder="请输入登录账号"
                class="login_input"
              />
            </el-form-item>
            <div class="label_login">密码</div>
            <el-form-item prop="password">
              <!-- <el-input v-model="dataForm.password" type="password" placeholder="请输入登录密码"></el-input> -->
              <input
                v-model="dataForm.password"
                type="password"
                placeholder="请输入登录密码"
                class="login_input"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="login-footer">弘和集团 962666</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataForm: {
        loginName: "",
        password: ""
      },
      dataRule: {
        loginName: [
          { required: true, message: "帐号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      userId: ""
    };
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate(async valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl("/sys/login"),
            method: "post",
            data: this.$http.adornData(
              {
                loginName: this.dataForm.loginName,
                password: this.dataForm.password
              },
              false
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(data);
              this.$cookie.set("token", data.token);
              this.$router.replace({ name: "home" });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
<style>
#loginTemplate .el-input__inner {
  border: none;
  border-bottom: 2px solid #ebebed;
  border-radius: 0;
  text-indent: 50px;
}
#loginTemplate .el-form-item {
  position: relative;
}
#loginTemplate .el-form-item__label {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
}
#loginTemplate .el-button--primary {
  background: #5c6be8;
  border-color: #5c6be8;
}
</style>
<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.6);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
    padding: 0;
    display: flex;
    background-image: url(~@/assets/img/bg2.png);
    background-size: 100% 100%;
  }
  .brand-info {
    flex: 1;
    // background-image: url(~@/assets/img/login_bg.png);
    // background-size: 100% 100%;
    position: relative;
  }
  .brand {
    background-image: url(~@/assets/img/logo3.png);
    background-size: 100% 100%;
    width: 180px;
    height: 67px;
    margin: 27px;
  }
  .line{
    width:203px;
height:2px;
background:linear-gradient(to right, rgba(255, 255, 255, 0),#ccc);
position:absolute;
top: 49%;
left: 17%;
}
.line_right{
  width:203px;
height:2px;
background:linear-gradient(to right, #ccc,rgba(255, 255, 255, 0));
position:absolute;
top: 49%;
left:66%;
}
  .brand-info__text {
    // margin:  0 0 22px 0;
    font-size: 56px;
    font-weight: 400;
    color: #fff;
    text-transform: uppercase;
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translateX(-50%);
  }
  .brand-info_text2 {
    color: #fff;
    position: absolute;
    left: 36%;
    top: 45%;
    font-size: 24px;
    letter-spacing: 7px;
    // transform: translate(-50%,-50%)
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    padding: 290px 195px 180px;
    width: 738px;
    min-height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    .label_login {
      color: #ffffff;
    }
    .login_input {
      background-color: transparent !important;
      border: none;
      border-bottom: 1px solid #fff;
      color: #fff;
      outline: none;
      padding: 22px 0;
      width: 100%;
    }
  }
  .login-title {
    font-size: 36px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 100px;
  }
  .login-footer {
    width: 350px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    position: absolute;
    bottom: 80px;
    color: #fff;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
    letter-spacing: 10px;
    font-size: 20px;
  }
  input:-webkit-autofill {
    -webkit-text-fill-color: #fff !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent !important;
    transition: background-color 5000s ease-in-out 0s;
  }
}
</style>
