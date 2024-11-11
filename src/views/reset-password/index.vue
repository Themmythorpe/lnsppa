<template>
  <div class="reset-password">
    <el-row :gutter="20">
      <el-col>
        <el-form :model="resetPasswordForm" :rules="resetPasswordFormRules" class="reset-password" autocomplete="on"
          label-position="left">
          <div class="title-container">
            <h3 class="title">Vue Admin Dashboard</h3>
          </div>
          <div class="bio-data mb-2">
            <el-form-item>
              <h4 class="bio-info">Reset Password ? 🔒</h4>
              <div class="mt-3">
                Your new password must be different from previously used
                passwords
              </div>
            </el-form-item>

            <!-- <el-form-item label="Current Password">

              <el-input
                ref="current_password"
                v-model="resetPassword.current_password"
                class="col-12 pt-0"
                name="current_Password"
                type="password"
                tabindex="1"
              />

            </el-form-item> -->
            <label for="email" class="font-weight-bold py-0">New Password</label><br>
            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item class="border rounded">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input ref="new_password" :key="newpasswordType" v-model="resetPasswordForm.new_password"
                  :type="newpasswordType" class="col-12 pt-0" placeholder="New Password" name="new-password"
                  tabindex="1" @keyup.native="checkCapslock01" @blur="capsTooltip = false" />
                <span class="show-pwd px-3 py-2" @click="showPwd">
                  <svg-icon :icon-class="
                      newpasswordType === 'password' ? 'eye' : 'eye-open'
                    " />
                </span>
              </el-form-item>
            </el-tooltip>

            <label for="conf_email" class="font-weight-bold py-0">Confirm New Password</label><br>
            <el-tooltip v-model="capsTooltip02" content="Caps lock is On" placement="right" manual>
              <el-form-item class="border rounded">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input ref="conf_new_password" :key="confnewpasswordType"
                  v-model="resetPasswordForm.confirm_password" :type="confnewpasswordType" class="col-12 pt-0"
                  placeholder="Confirm New Password" name="new-password" tabindex="1" @keyup.native="checkCapslock02"
                  @blur="capsTooltip02 = false" />
                <span class="show-pwd px-3 py-2" @click="showConfPwd">
                  <svg-icon :icon-class="
                      confnewpasswordType === 'password' ? 'eye' : 'eye-open'
                    " />
                </span>
              </el-form-item>
            </el-tooltip>

            <!-- <el-form-item label="Confirm New Password">
              <el-input
                ref="confirm_password"
                v-model="resetPasswordForm.confirm_password"
                class="col-12 pt-0"
                name="confirm_Password"
                type="password"
                tabindex="1"
              />
            </el-form-item> -->
          </div>

          <el-button :loading="show" type="primary" class="py-3 mt-3" style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="validationForm">Reset New Password</el-button>
          <div style="width: 100%" class="pb-0">
            <div class="tips" style="
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                text-align: center;
              ">
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
  import axios from 'axios'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Register',
    components: {},
    data() {
      return {
        show: false,
        resetPasswordForm: {
          new_password: '',
          confirm_password: '',
          reset_email: '',
          reset_code: ''
        },
        resetPasswordFormRules: {
          new_password: [
            {
              required: true,
              message: 'Please fill in your new password',
              trigger: 'blur'
            }
          ],
          confirm_password: [
            {
              required: true,
              message: 'Please fill in your new password to confirm',
              trigger: 'blur'
            }
          ]
        },
        capsTooltip: false,
        capsTooltip02: false,
        newpasswordType: 'password',
        confnewpasswordType: 'password'
      }
    },
    mounted() {
      const userEmail = localStorage.getItem('resetEmail')
      const userToken = localStorage.getItem('resetCode')
      this.resetPasswordForm.reset_email = userEmail
      this.resetPasswordForm.reset_code = userToken
    },
    methods: {
      checkCapslock01(e) {
        const { key } = e
        this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
      },
      checkCapslock02(e) {
        const { key } = e
        this.capsTooltip02 = key && key.length === 1 && key >= 'A' && key <= 'Z'
      },
      showPwd() {
        if (this.newpasswordType === 'password') {
          this.newpasswordType = ''
        } else {
          this.newpasswordType = 'password'
        }

        this.$nextTick(() => {
          this.$refs.new_password.focus()
        })
      },
      showConfPwd() {
        if (this.confnewpasswordType === 'password') {
          this.confnewpasswordType = ''
        } else {
          this.confnewpasswordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.conf_new_password.focus()
        })
      },
      validationForm() {
        if (
          this.resetPasswordForm.new_password !== '' &&
          this.resetPasswordForm.confirm_password !== '' &&
          this.resetPasswordForm.reset_code !== '' &&
          this.resetPasswordForm.reset_email !== ''
        ) {
          if (
            this.resetPasswordForm.new_password ===
            this.resetPasswordForm.confirm_password
          ) {
            this.show = true
            axios
              .post(
                this.dynamic_base_url('reset-password'),
                {
                  code: this.resetPasswordForm.reset_code,
                  email: this.resetPasswordForm.reset_email,
                  password: this.resetPasswordForm.new_password,
                  password_confirmation: this.resetPasswordForm.confirm_password
                },
                {
                  headers: { Authorization: 'Bearer ' + getToken() }
                }
              )
              .then((response) => {
                if (
                  response.data.status === true ||
                  response.data.code === 200 ||
                  response.data.success === true
                ) {
                  this.$message.success(response.data.message)
                  if (window.localStorage) {
                    window.localStorage.removeItem('resetCode')
                    window.localStorage.removeItem('resetEmail')
                  }
                  this.resetPasswordForm.new_password = ''
                  this.resetPasswordForm.confirm_password = ''

                  this.$router.push('/login')
                } else {
                  this.$message.error(response.data.message)
                }
                this.show = false
              })
              .catch((error) => {
                const errorRes = error.response.data
                if (errorRes.status >= 400 || errorRes.status === false) {
                  this.$message.error(errorRes.message)
                  if (errorRes.message === 'The selected code is invalid.') {
                    this.$router.push({ name: 'forgot-password' }).then(() => {
                      location.reload()
                    })
                  }
                } else {
                  this.$message.error(
                    'Error occurred while changing your password. Please try again later.'
                  )
                }
                this.show = false
              })
          } else {
            this.$message.error('Passwords do not match!')
          }
        } else {
          this.$message.error('The password fields are required.')
        }
      }
      // submit() {
      //   this.$message({
      //     message: "User information has been updated successfully",
      //     type: "success",
      //     duration: 5 * 1000,
      //   });
      // },
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
    .reset-password .el-input input {
      color: $cursor;
      text-indent: 25px;
    }
  }

  /* reset element-ui css */
  .reset-password {
    .el-input {
      //display: inline-block;
      height: 47px;
      //width: 98%;

      input {
        background: #fff !important;
        border: 1px solid $light-gray !important;
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

  .reset-password {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .font-weight-bold {
      font-weight: 500;
    }

    label.font-weight-bold {
      color: #606266;
    }

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
      font-weight: 300;
      color: #444;
      margin-top: 20px;
      margin-bottom: 15px;
    }

    .svg-container {
      position: absolute;
      top: 7px;
      left: 0px;
      z-index: 10;
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
      right: 0px;
      top: 4px;
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
      background-color: #35518b;
      color: #fff;
      border: #35518b;
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