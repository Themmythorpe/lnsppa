<template>
  <div class="fp-container login-container">
    <el-row :gutter="20">
      <el-col>
        <el-form
          :model="forgotPasswordForm"
          :rules="forgotPasswordRules"
          class="reset-password login-form"
          autocomplete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">{{ siteName }}</h3>
          </div>
          <div class="bio-data mb-4">
              <h4 class="bio-info text-white">Forgot Password ? 🔒</h4>
              <span class="text-white">Enter your email and we'll send you token to reset your
                password.</span>
          </div>

            <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="email" v-model="forgotPasswordForm.userEmail" placeholder="Email" name="email" type="text" tabindex="1"
          autocomplete="on" class="input_el login_input" />
      </el-form-item>

            <!-- <el-form-item prop="email">
              <label for="email" class="py-0">Email</label><br>
              <el-input
                ref="email"
                v-model="forgotPasswordForm.userEmail"
                class="col-12 pt-0 input_el login_input"
                placeholder="john@example.com"
                name="email"
                type="email"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item> -->

          <el-button
            :loading="show"
            type="primary"
            class="py-3 mt-3"
            style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="validationForm"
          >Send Email</el-button>
          <div style="width: 100%" class="pb-0">
            <div
              class="tips"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
              "
            >
              <a class="text-white" @click="$router.push('login')">
                <span><i class="el-icon-d-arrow-left" /> Back to login</span>
              </a>
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
  name: 'ForgotPassword',
  components: {},
  data() {
    return {
      siteName: this.dynamic_site_name(),
      show: false,
      forgotPasswordForm: {
        userEmail: ''
      },
      forgotPasswordRules: {
        email: [
          {
            required: true,
            message: 'Please enter your email',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    localStorage.removeItem('resetEmail')
  },
  methods: {
    inputToken() {
      this.$router.push({ name: 'input-token' })
    },

    validationForm() {
      if (this.forgotPasswordForm.userEmail !== '') {
        this.show = true
        axios
          .post(
            this.dynamic_base_url('change-password'),
            {
              email: this.forgotPasswordForm.userEmail
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
                window.localStorage.setItem('resetEmail', this.forgotPasswordForm.userEmail)
              }
              this.$router.push({ name: 'input-token' })

              this.forgotPasswordForm.userEmail = ''
            } else {
              this.$message.error(response.data.message)
            }
            this.show = false
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error(
                'Error occurred while verifying email. Please try again later.'
              )
            }
            this.show = false
          })
      } else {
        this.$message.error('The email field is required.')
      }
    }
    // submit() {
    //   this.$message({
    //     message: 'User information has been updated successfully',
    //     type: 'success',
    //     duration: 5 * 1000
    //   })
    // }
  }
}
</script>


<style lang="scss" scoped>
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #283443;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $light_gray;
      background: transparent !important;

    }

    .login-container {
      .el-input {

        input {
          caret-color: $light_gray !important;
        }
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        // color: $light_gray !important;
        height: 33px;
        margin-left: 10px;
        caret-color: #ffffff;
        background: transparent !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 8px;
        }
      }
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
        color: $light_gray !important;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
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

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
</style>

<style>
.reset-password .el-input input {
  background: transparent !important;
  border: none !important;
  caret-color: white;
  text-indent: 0 !important;
  color: #ffffff !important;
  margin-top: 0 !important;
}
  .login_input>.el-input__inner {
    margin-top: 7px;
    background: transparent !important;
    border: transparent !important;
    color: white;
  }

  .login_input>.el-input__inner:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #293444 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    border-radius: 0px !important;
    caret-color: #ffffff !important;
  }
</style>
