<template>
  <div class="register-container">
    <el-row :gutter="20">
      <el-col>
        <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="on"
          label-position="left">

          <div class="title-container">
            <h3 class="title">Register Form</h3>
          </div>
          <!-- <div class="social-container pb-0">
            <span class="social-text">Use social account (optional)</span>
            <el-button type="" class="social-btn" style="margin-bottom:15px;padding:13px;">Sign up with
              facebook</el-button>
          </div> -->
          <div class="fill-container py-0">
            <div class="dash" />
            <span class="social-text">Or fill the form</span>
            <div class="dash" />
          </div>
          <div class="bio-data mb-2">
            <div class="px-2 bio-info">Personal Information</div>
            <el-form-item>
              <el-col :span="12">
                <label for="first_name">First Name*</label>
                <el-input ref="firstname" v-model="registerForm.first_name" class="col-12" placeholder="Enter Firstname"
                  name="firstname" type="text" tabindex="1" autocomplete="on" :rules="registerRules.firstname" />

              </el-col>
              <el-col :span="12">
                <label for="last_name">Last Name*</label>
                <el-input ref="lastname" v-model="registerForm.last_name" class="col-12" placeholder="Enter Lastname"
                  name="lastname" type="text" tabindex="1" autocomplete="on" :rules="registerRules.lastname" />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="12">

                <label for="email">Email*</label><br>
                <el-input ref="email" v-model="registerForm.email" class="col-12" placeholder="Enter Email" name="email"
                  type="email" tabindex="1" autocomplete="on" :rules="registerRules.email" />

              </el-col>
              <el-col :span="12">
                <label for="phone_number">Phone Number*</label><br>
                <el-input v-model="registerForm.phone_number" :rules="registerRules.phone_number" :sm="12" :md="8"
                  :lg="8" class="phone" type="number" placeholder="Enter phone number">
                  <template slot="prepend">
                    <el-select v-model="registerForm.phone_code" :rules="registerRules.phone_code" placeholder="Code"
                      class="phone-code">
                      <el-option v-for="(code, key) in countryWithCode" :key="key"
                        :label="`${code.dial_code} ${code.name}`" :value="code.dial_code">
                        <!-- Add more options as needed -->
                      </el-option>
                    </el-select>
                  </template>
                </el-input>
              </el-col>
            </el-form-item>
          </div>

          <div class="bio-data mb-2 mt-5">
            <div class="px-2 bio-info">Billing Address</div>
            <el-form-item>
              <el-col :span="12">
                <label for="comapany_name">Company Name (Optional)</label>
                <el-input ref="company_name" v-model="registerForm.company_name" class="col-12" name="company_name"
                  type="text" tabindex="1" autocomplete="on" :rules="registerRules.company_name" />
              </el-col>
              <el-col :span="12">
                <label for="last_name">Street Address*</label>
                <el-input ref="street" v-model="registerForm.street_address" class="col-12" name="street" type="text"
                  tabindex="1" autocomplete="on" :rules="registerRules.street_address" />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="12">
                <label for="street2">Street Address 2 (Optional)*</label>
                <el-input ref="street2" v-model="registerForm.street_address2" class="col-12" name="street2" type="text"
                  tabindex="1" autocomplete="on" :rules="registerRules.street_address2" />
              </el-col>
              <el-col :span="12">
                <label for="city">City*</label>
                <el-input ref="city" v-model="registerForm.city" class="col-12" name="city" type="text" tabindex="1"
                  autocomplete="on" :rules="registerRules.city" />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="8">
                <label for="country">Country*</label>
                <el-input ref="country" v-model="registerForm.country" class="col-12" name="country" type="text"
                  tabindex="1" autocomplete="on" :rules="registerRules.country" />
              </el-col>
              <el-col :span="8">
                <label for="state">State*</label>
                <el-input ref="state" v-model="registerForm.state" class="col-12" name="state" type="text" tabindex="1"
                  autocomplete="on" :rules="registerRules.state" />
              </el-col>
              <el-col :span="8">
                <label for="postcode">Postcode*</label>
                <el-input ref="postcode" v-model="registerForm.postcode" class="col-12" name="postcode" type="number"
                  tabindex="1" autocomplete="on" :rules="registerRules.postcode" />
              </el-col>
            </el-form-item>
          </div>

          <div class="bio-data mb-2 mt-5">
            <div class="px-2 bio-info">Additional Information</div>
            <el-form-item>
              <el-col :span="12">
                <label for="comapany_name">Where did you hear about us? (Optional)</label>
                <el-select v-model="registerForm.where_did_you_hear_about_us"
                  :rules="registerRules.where_did_you_hear_about_us" placeholder="" class="phone-cod col-12">
                  <el-option v-for="(aboutus, key) in hearAboutUs" :key="key" :label="aboutus.place"
                    :value="aboutus.place" />
                  <!-- Add more options as needed -->
                </el-select>
                <div class="mt-3">
                  <span class="sub-choose">Choose where you heard about {{ SITE_NAME }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <label for="customer_cate">Customer category *</label>
                <el-select v-model="registerForm.customer_cat" :rules="registerRules.customer_cat" placeholder=""
                  class="col-12">
                  <el-option v-for="(customerCate, key) in customerCategory" :key="key" :label="customerCate.customer"
                    :value="customerCate.customer" />
                  <!-- Add more options as needed -->
                </el-select>
                <div class="mt-3">
                  <span class="sub-choose">Choose the category that best describes you to enable us serve you
                    better</span>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="12">
                <div class="checkbox-container">
                  <input id="myCheckbox" v-model="registerForm.share_personal_data" type="checkbox">
                  <label for="myCheckbox">Consent to share personal data *</label>
                </div>
                <div style="padding-left: 21px;" class="mt-2">
                  <span class="sub-choose">I consent to the processing of my personal data within or outside my
                    jurisdiction</span>
                </div>
              </el-col>
              <el-col :span="12">
                <label for="customer_cate">Security Question *</label>
                <el-select v-model="registerForm.security_questions" placeholder="" class="col-12">
                  <el-option v-for="(secQuestion, key) in securityQuestion" :key="key" :label="secQuestion.question"
                    :value="secQuestion.question" />
                  <!-- Add more options as needed -->
                </el-select>
                <div class="mt-2">
                  <span class="sub-choose">Choose your security question to enable us verify you when you contact
                    us</span>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="12">
                <label for="sec_question">Security Question Answer *</label>
                <el-input ref="sec_question" v-model="registerForm.security_answer" class="col-12" name="sec_question"
                  type="text" tabindex="1" autocomplete="on" />
                <div class="mt-2">
                  <span class="sub-choose">Enter the answer to the security question you chose. We would ask for this to
                    verify your identity when you contact us</span>
                </div>
              </el-col>
              <el-col :span="12">
                <label for="currency">Choose Currency *</label>
                <el-select v-model="registerForm.currency" placeholder="" class="col-12">
                  <el-option v-for="(currency, key) in chooseCurrency" :key="key" :label="currency.currency"
                    :value="currency.currency" />
                  <!-- Add more options as needed -->
                </el-select>
              </el-col>
            </el-form-item>
          </div>

          <div class="bio-data mb-2">
            <div class="px-2 bio-info">Account Security</div>
            <el-form-item>
              <el-col :span="12">
                <div style="display: flex; justify-content: space-between;">
                  <label for="password">Password *</label>
                  <span>at least 5 characters</span>
                </div>
                <el-input ref="password" v-model="registerForm.password" class="col-12" placeholder="" name="password"
                  type="password" tabindex="1" />
              </el-col>
              <el-col :span="12">

                <label for="confirm_password">Confirm Password *</label>
                <el-input ref="confirm_password" v-model="registerForm.password_confirmation" class="col-12"
                  placeholder="" name="confirm_password" type="password" tabindex="1" />
              </el-col>
            </el-form-item>
          </div>

          <div class="bio-data mb-2">
            <div class="px-2 bio-info">Join our mailing list</div>
            <el-form-item>
              <el-col>
                <div class="mt-2">
                  <span class="sub-choose">We would like to send you occasional news, information and special offers by
                    email. To join our mailing list, simply tick the box below. You can unsubscribe at any time.</span>
                </div>
              </el-col>
              <el-col class="">
                <div class="panel panel-switch col-8 mx-0">
                  <div class="panel-body">
                    <span class="switch-label">Receive Emails:</span>
                    <label class="switch switch--lg switch--text">
                      <input class="switch__checkbox" type="checkbox" name="marketingoptin" value="1" checked="">
                      <span class="switch__container">
                        <span class="switch__handle" />
                      </span>
                    </label>
                  </div>
                </div>

              </el-col>
              <el-col class="mt-2">
                <div class="checkbox-container">
                  <input id="myCheckbox" type="checkbox">
                  <label for="myCheckbox">I have read and agree to the <span class="px-2 text-primary">Terms of
                      Service</span> *</label>
                </div>
              </el-col>
            </el-form-item>
          </div>

          <el-button :loading="loading" type="primary" class="py-3 mt-3" style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleRegister">Register</el-button>
          <div style=" width: 100%;" class="pb-0">
            <div class="tips" style="display: flex;justify-content: center;align-items: center; width: 100%;">
              <span class="text-secondary">Already have an account with us?</span>
              <a class="text-primary" href="#" @click="$router.push('login')"><span>Login</span></a>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'
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
        loading: false,
        countryWithCode,
        hearAboutUs,
        customerCategory,
        securityQuestion,
        chooseCurrency,
        siteName: process.env.VUE_APP_SITE_NAME,
        registerForm: {
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          phone_code: '',
          security_questions: '',
          security_answer: '',
          where_did_you_hear_about_us: '',
          company_name: '',
          share_personal_data: null,
          street_address: '',
          street_address2: '',
          country: '',
          state: '',
          postcode: '',
          password: '',
          password_confirmation: ''
        },
        registerRules: {
          first_name: [{ required: true, message: 'Please enter your first name', trigger: 'blur' }],
          lastname: [{ required: true, message: 'Please enter your last name', trigger: 'blur' }],
          email: [{ required: true, message: 'Please enter your email', trigger: 'blur' }],
          phone_code: [{ required: true, message: 'Please enter your phone code', trigger: 'blur' }],
          phone_number: [{ required: true, message: 'Please enter your phone number', trigger: 'blur' }],
          company_name: [{ required: true, message: 'Please enter your company name', trigger: 'blur' }],
          street_address: [{ required: true, message: 'Please enter your street address', trigger: 'blur' }],
          street_address2: [{ required: true, message: 'Please enter your street address2', trigger: 'blur' }],
          city: [{ required: true, message: 'Please enter your city', trigger: 'blur' }],
          country: [{ required: true, message: 'Please enter your country', trigger: 'blur' }],
          state: [{ required: true, message: 'Please enter your state', trigger: 'blur' }],
          postcode: [{ required: true, message: 'Please enter your postcode', trigger: 'blur' }],
          where_did_you_hear_about_us: [{ required: true, message: 'Please enter your where_did_you_hear_about_us', trigger: 'blur' }],
          customer_cat: [{ required: true, message: 'Please enter your customer cat', trigger: 'blur' }]
          // Add rules for other fields
        }
      }
    },
    methods: {
      submit() {
        this.$message({
          message: 'User information has been updated successfully',
          type: 'success',
          duration: 5 * 1000
        })
      },
      handleRegister() {
        this.loading = true
        if (this.registerForm.share_personal_data === true) {
          this.registerForm.share_personal_data = 'YES'
        } else {
          this.registerForm.share_personal_data = 'NO'
        }
        axios.post(
          this.dynamic_base_url('register'),
          this.registerForm
        ).then(response => {
          this.$message({
            type: 'success',
            message: 'Registration successful!'
          })
          this.$router.push('login')
          this.loading = false
        }).catch(error => {
          const errorRes = error.response.data
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message)
          } else {
            this.$message.error('Error registering. Please try again later.')
          }

          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss">
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #283443;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .register-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .register-container {
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

  .register-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .register-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .sub-choose {
      font-size: 13px;
      color: #999;
    }

    .register-form {
      position: relative;
      width: 770px;
      max-width: 100%;
      padding: 50px 35px 35px 25px;
      background-color: #fff;
      margin: 30px auto;
      overflow: hidden;
      border-radius: 10px;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 5px;
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
      font-weight: 500;
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