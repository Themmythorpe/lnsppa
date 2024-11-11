<template>
  <div class="new-password">
    <el-row :gutter="20">
      <el-col>
        <el-form :model="resetPassword" :rules="registerRules" class="reset-password" autocomplete="on"
          label-position="left">

          <div class="title-container">
            <h3 class="title">Vue Admin Dashboard</h3>
          </div>
          <div class="bio-data mb-2">
            <el-form-item>
              <h4 class="bio-info">
                Forgot Password ? 🔒
              </h4>
              <span>Kindy check in your mail for token</span>
              <div class="mt-3">Your new password must be different from previously used passwords</div>
            </el-form-item>
            <el-form-item label="New Password">

              <!-- <label for="email" class="py-0">Input Token</label><br> -->
              <el-input ref="password" v-model="resetPassword.password" class="col-12 pt-0" name="newPassword"
                type="password" tabindex="1" />

            </el-form-item>
            <el-form-item label="Confirm Password">

              <!-- <label for="email" class="py-0">Input Token</label><br> -->
              <el-input ref="confirm_password" v-model="resetPassword.confirm_password" class="col-12 pt-0"
                name="confirm_Password" type="password" tabindex="1" />

            </el-form-item>
          </div>

          <el-button :loading="loading" type="primary" class="py-3 mt-3" style="width:100%;margin-bottom:30px;"
            @click="login()">Set New Password</el-button>
          <div style=" width: 100%;" class="pb-0">
            <div class="tips"
              style="display: flex;justify-content: center;align-items: center; width: 100%; text-align: center;">
              <a class="text-primary" @click="$router.push('login')">
                <span>Back to login</span></a>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import countryWithCode from '../main/mixin/country_with_code'
  import hearAboutUs from '../main/mixin/where_hear_about_us'
  import customerCategory from '../main/mixin/customer_category'
  import securityQuestion from '../main/mixin/security_question'
  import chooseCurrency from '../main/mixin/choose_currency'

  export default {
    name: 'Register',
    components: {},
    data() {
      return {
        countryWithCode,
        hearAboutUs,
        customerCategory,
        securityQuestion,
        chooseCurrency,
        resetPassword: {
          confirm_password: '',
          password: ''
        }
      }
    },
    methods: {
      login() {
        this.$router.push('/login')
      },
      submit() {
        this.$message({
          message: 'User information has been updated successfully',
          type: 'success',
          duration: 5 * 1000
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #283443;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .new-password .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .new-password {
    .el-input {
      //display: inline-block;
      height: 47px;
      //width: 98%;

      input {
        background: #fff !important;
        border: 1px solid light-gray;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: black !important;
        height: 47px;
        caret-color: $cursor;
        border-radius: 5px;
      }

      select {
        border: 1px solid light-gray;
      }
    }

    .el-form-item--medium .el-form-item__content {
      line-height: 22px !important;
    }

    .el-form-item {
      //border: 1px solid rgba(255, 255, 255, 0.1);
      //background: #fff;
      //border-radius: 15px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .new-password {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 320px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .sub-choose {
      font-size: 13px;
      color: #999;
    }

    .reset-password {
      position: relative;
      width: 450px;
      max-width: 100%;
      padding: 50px 35px 35px 25px;
      background-color: #fff;
      margin: 50px auto;
      overflow: hidden;
      border-radius: 10px;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .bio-info {
      font-size: 19px;
      font-weight: 100;
      color: #444;
      margin-bottom: 10px;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: #000;
        margin: 0px auto 20px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .checkbox-container {
      display: flex;
      align-items: center;
    }

    input[type="checkbox"] {
      margin-right: 8px;
      /* Adjust as needed */
    }

    label {
      display: flex;
      align-items: center;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    .social-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .social-btn {
      background-color: #35518B;
      color: #fff;
      border: #35518B;
      margin-top: 15px;
    }

    .fill-container {
      padding-top: 0%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .dash {
      width: 30%;
      height: 1px;
      color: #fff;
      background-color: #444;
    }

    .social-text {
      color: #444;
      font-size: 13px;
    }

    .phone-input {
      width: 300px;
      /* Adjust the width as needed */
    }

    .phone-code {
      width: 80px;
      border: 1px solid #aaa;
      border-radius: 3px 0 0 0;
      /* Adjust the width as needed */
    }

    label {
      font-weight: 100;
    }

    /* Add your existing styles here */

    .panel {
      border: 1px solid #ddd;
      /* Adjust border styles as needed */
      border-radius: 4px;
      margin: 10px;
      margin-top: 30px;
      padding: 20px 10px;
      background-color: #fff;
    }

    .panel-body {
      display: flex;
      align-items: center;
      justify-content: space-between;

    }

    .switch-label {
      margin-right: 10px;
      /* Adjust spacing as needed */
    }

    .switch {
      position: relative;
      display: inline-block;
      vertical-align: middle;
    }

    .switch__checkbox {
      position: absolute;
      opacity: 0;
    }

    .switch__container {
      position: relative;
      display: inline-block;
      width: 44px;
      /* Adjust width as needed */
      height: 24px;
      /* Adjust height as needed */
      background-color: #3616da;
      /* Adjust background color */
      border-radius: 12px;
      /* Half of the height for a circular appearance */
    }

    .switch__handle {
      position: absolute;
      left: 2px;
      top: 2px;
      width: 20px;
      /* Adjust width as needed */
      height: 20px;
      /* Adjust height as needed */
      background-color: #fff;
      /* Adjust handle color */
      border-radius: 50%;
      /* Make it circular */
      transition: transform 0.3s ease;
    }

    .switch__checkbox:checked+.switch__container .switch__handle {
      transform: translateX(20px);
      /* Move handle to the right when checked */
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>