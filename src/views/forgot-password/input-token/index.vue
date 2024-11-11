<template>
  <div class="input-token-container">
    <el-row :gutter="20">
      <el-col>
        <el-form
          :model="resetPasswordForm"
          :rules="resetPasswordFormRules"
          class="reset-password"
          autocomplete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">Vue Admin Dashboard</h3>
          </div>
          <div class="bio-data mb-2">
            <el-form-item>
              <h4 class="bio-info">Forgot Password ? 🔒</h4>
              <span>Kindy check in your Mail for token</span>
            </el-form-item>
            <el-form-item label="Input Token" class="mb-2">
              <!-- <label for="email" class="py-0">Input Token</label><br> -->
              <el-input
                ref="token"
                v-model.trim="resetPasswordForm.token"
                class="col-12 pt-0"
                name=""
                type="text"
                maxlength="6"
                tabindex="1"
                @input="formatToken"
              />
            </el-form-item>
            <div style="width: fit-content; margin-left: auto; font-size: 12px">
              <a class="text-primary py-2" @click="ResendToken">
                <span v-if="!showloader">Resend Token ?</span>
                <span v-if="showloader">Please wait...</span>
              </a>
            </div>
          </div>

          <el-button
            :loading="show"
            type="primary"
            class="py-3 mt-3"
            style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="validationForm"
          >Verify Token</el-button>
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
  name: 'ResetPassword',
  components: {},
  data() {
    return {
      show: false,
      showloader: false,
      resetPasswordForm: {
        token: '',
        email: ''
      },
      resetPasswordFormRules: {
        token: [
          {
            required: true,
            message: 'Please enter the token sent to your email',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    const userEmail = localStorage.getItem('resetEmail')
    this.resetPasswordForm.email = userEmail
    this.$nextTick(() => {
      this.$refs.token.focus()
    })
  },
  methods: {
    formatToken() {
      // Remove any non-numeric characters from the token
      this.resetPasswordForm.token = this.resetPasswordForm.token.replace(
        /\D/g,
        ''
      )

      // Truncate the token to 6 digits if it exceeds the limit
      if (this.resetPasswordForm.token.length > 6) {
        this.resetPasswordForm.token = this.resetPasswordForm.token.substring(
          0,
          6
        )
      } else if (this.resetPasswordForm.token.length === 6) {
        this.validationForm()
      }
    },
    validationForm() {
      if (
        this.resetPasswordForm.token !== '' &&
        this.resetPasswordForm.email !== ''
      ) {
        if (this.resetPasswordForm.token.length === 6) {
          this.show = true
          axios
            .post(
              this.dynamic_base_url('password/code/check'),
              {
                code: this.resetPasswordForm.token,
                email: this.resetPasswordForm.email
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
                  window.localStorage.setItem(
                    'resetCode',
                    this.resetPasswordForm.token
                  )
                }
                this.$router.push({ name: 'reset-password' })

                this.resetPasswordForm.token = ''
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
                  'Error occurred while verifying token. Please try again later.'
                )
              }
              this.show = false
            })
        }
      } else {
        this.$message.error('The token field is required.')
      }
    },

    ResendToken() {
      if (this.resetPasswordForm.email !== '') {
        this.showloader = true
        axios
          .post(
            this.dynamic_base_url('change-password'),
            {
              email: this.resetPasswordForm.email
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
            } else {
              this.$message.error(response.data.message)
            }
            this.showloader = false
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
            this.showloader = false
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

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #283443;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .input-token-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.input-token-container {
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
      font-size: 2em;
      letter-spacing: 10px;
      text-align: center;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
      appearance: none;
      display: none;
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

.input-token-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .input-token-form {
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

  .switch__checkbox:checked + .switch__container .switch__handle {
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
