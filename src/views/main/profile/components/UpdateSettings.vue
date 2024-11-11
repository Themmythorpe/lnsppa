<template>
  <el-form ref="settingsForm" :model="settings">
    <el-row v-loading="listLoading" :gutter="20">
      <!-- <el-form-item>
        Site Logo
        <el-col>

        </el-col>
      </el-form-item> -->

      <el-form-item>
        <!-- Site Name -->
        <el-col>
          <label for="site_name">Site Name</label>
          <el-input id="site_name" v-model.trim="settings.site_name" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <!-- Site Email -->
        <el-col :span="12" sm="12" md="6">
          <label for="site_email">Site Email</label>
          <el-input id="site_email" v-model.trim="settings.site_email" />
        </el-col>

        <!-- Site Phone -->
        <el-col :span="12" sm="12" md="6">
          <label for="site_phone">Site Phone</label><br>
          <el-input id="site_phone" v-model.trim="settings.site_phone" placeholder="Site phone number">
            <template slot="prepend">
              <el-select v-model="settings.site_phone_code" placeholder="Code" class="phone-code">
                <el-option v-for="(code, key) in countryWithCode" :key="key" :label="`${code.dial_code} ${code.name}`"
                  :value="code.dial_code" />
              </el-select>
            </template>
          </el-input>
        </el-col>
      </el-form-item>

      <el-form-item>
        <!-- Site Address -->
        <el-col :span="12" sm="12" md="6">
          <label for="site_address">Site Address</label>
          <el-input id="site_address" v-model.trim="settings.site_address" />
        </el-col>

        <!-- Site Url -->
        <el-col :span="12" sm="12" md="6">
          <label for="site_url">Site URL</label><br>
          <el-input id="site_url" v-model.trim="settings.site_url" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <!-- Site Country -->
        <el-col :span="12" sm="12" md="6">
          <label for="site_country">Site Country</label>
          <el-input id="site_country" v-model.trim="settings.site_country" />
        </el-col>

        <!-- Enom Username -->
        <el-col :span="12" sm="12" md="6">
          <label for="enom_username">Enom Username</label><br>
          <el-input id="enom_username" v-model.trim="settings.enom_username" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <!-- Enom Password -->
        <el-col :span="12" sm="12" md="6">
          <label for="enom_password">Enom Password</label><br>
          <el-input id="enom_password" v-model.trim="settings.enom_password" />
        </el-col>

        <!-- Enom Base URL -->
        <el-col :span="12" sm="12" md="6">
          <label for="enom_base_url">Enom Base URL</label><br>
          <el-input id="enom_base_url" v-model.trim="settings.enom_base_url" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <!-- Card Number -->
        <el-col :span="12" sm="12" md="6">
          <label for="card_no">Card Number</label><br>
          <el-input id="card_no" v-model.trim="settings.card_number" />
        </el-col>

        <!-- Card Month/Year -->
        <el-col :span="12" sm="12" md="6">
          <label for="card_m_y">Card Month/Year</label><br>
          <el-date-picker id="card_m_y" v-model="settings.card_month_year" type="month" class="w-100" format="MM/yy"
            :picker-options="pickerOptions" />
        </el-col>
      </el-form-item>

      <el-form-item>
        <!-- Card CVV -->
        <el-col :span="12" sm="12" md="6">
          <label for="card_no">Card CVV</label><br>
          <el-input id="card_no" v-model.trim="settings.card_cvv" max="3" maxlength="3" />
        </el-col>

        <!-- Payment Gateway -->
        <el-col :span="12" sm="12" md="6">
          <label for="payment_gateway">Payment Gateway</label><br>
          <el-select v-model="settings.payment_gateway" placeholder="Select Payment Gateway" class="w-100">
            <el-option v-for="gateway in gateways" :key="gateway.pg_id" :label="gateway.name" :value="gateway.pg_id" />
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item>
        <!-- Support Email -->
        <el-col :span="8" sm="8" md="4">
          <label for="support_email">Support Email</label><br>
          <el-input id="support_email" v-model.trim="settings.support_email" />
        </el-col>

        <!-- Support Phone -->
        <el-col :span="8" sm="8" md="4">
          <label for="support_phone">Support Phone</label><br>
          <el-input id="support_phone" v-model.trim="settings.support_phone" />
        </el-col>

        <!-- Currency -->
        <el-col :span="8" sm="8" md="4">
          <label for="currency">Currency</label><br>
          <!-- <el-input id="currency" v-model.trim="settings.currency" /> -->
          <el-select id="currency" v-model="settings.currency" placeholder="Select Currency" class="w-100">
            <el-option v-for="currency in currencies" :key="currency.name" :label="currency.name"
              :value="currency.name" />
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col class="border">
          <div class="d-md-flex justify-content-between align-items-end mt-2 mb-4">
            <!-- Site Logo -->
            <div>
              <label for="site_logo">Site Logo</label>
              <div class="upload_wrap" @dragover.prevent @drop.prevent="handleDrop(1, $event)">
                <div v-if="imagePreview1 != null" class="change_text px-3" @click="handleUploadClick(1)">
                  <span class="text-center" style="line-height: 1.2">Click or drag image here to change</span>
                </div>
                <div v-if="imagePreview1 != null" class="upload_img">
                  <div style="width: fit-content; margin: auto">
                    <img rounded size="100" class="mx-auto badge-light" :src="imagePreview1"
                      style="background-color: transparent !important">
                  </div>
                </div>

                <form class="d-flex flex-column justify-center align-center gap-3">
                  <div class="d-flex flex-wrap gap-2">
                    <input ref="fileInput1" type="file" name="file" accept=".jpeg,.png,.jpg,.gif" hidden
                      @change="handleFileChange(1)">

                    <!-- <el-button
                    v-if="imagePreview1 != null"
                    type="button"
                    variant="secondary"
                    class="mx-auto reset_btn"
                    @click="resetImage(1)"
                  >
                    <span class="reset">Reset</span>
                  </el-button>
            <div class="no_clickable"></div> -->
                  </div>
                  <p v-if="imagePreview1 == null" class="mb-0 select_text mt-5">
                    Select image or drag <br>
                    image here
                  </p>
                </form>
              </div>
            </div>

            <!-- Update Button -->
            <div class="mx-3 mt-md-4">
              <el-button :loading="loading" type="primary" style="background-color: #42b983 !important; border: none"
                @click.native.prevent="handleSubmit">Update Settings</el-button>
            </div>
          </div>
        </el-col>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
  import axios from 'axios'
  import { getToken } from '@/utils/auth'
  import countryWithCode from '../../mixin/country_with_code'

  export default {
    data() {
      return {
        countryWithCode,
        settings: {
          site_name: '',
          site_email: '',
          site_phone_code: '',
          site_phone: '',
          site_address: '',
          site_url: '',
          site_logo: '',
          site_country: '',
          enom_username: '',
          enom_password: '',
          enom_base_url: '',
          card_number: '',
          card_month_year: '',
          card_cvv: '',
          payment_gateway: '',
          support_email: '',
          support_phone: '',
          currency: ''
        },
        imagePreview1: null,
        loading: false,
        listLoading: true,
        gateways: [],
        currencies: [
          {
            name: 'USD'
          },
          {
            name: 'NGN'
          },
          {
            name: 'EUR'
          },
          {
            name: 'CED'
          }
        ]
      }
    },
    computed: {
      pickerOptions() {
        const currentYear = new Date().getFullYear()
        const validFromYear = currentYear
        const validToYear = currentYear + 3 // Change this value to adjust the range

        return {
          disabledDate(time) {
            const year = new Date(time).getFullYear()
            return year < validFromYear || year > validToYear
          }
        }
      }
    },
    mounted() {
      this.fetchSettings()
      this.fetchPaymentGateways()
    },
    methods: {
      fetchPaymentGateways() {
        axios
          .get(this.dynamic_base_url('admin/payment/gateway'), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            this.gateways = response.data.data
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error(
                'Error occurred while fetching settings. Please try again later.'
              )
            }
          })
      },
      fetchSettings() {
        this.listLoading = true
        axios
          .get(this.dynamic_base_url('admin/settings'), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            this.settings = response.data.data
            this.imagePreview1 =
              this.settings.site_url + '/' + this.settings.site_logo
            // console.log("settings :", this.settings);
            this.listLoading = false
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error(
                'Error occurred while fetching settings. Please try again later.'
              )
            }
            this.listLoading = false
          })
      },
      handleSubmit() {
        // const truncatedLogoURL = this.imagePreview1.substring(0, 255);

        const payload = {
          site_name: this.settings.site_name,
          site_email: this.settings.site_email,
          // site_phone: `${this.settings.phone_code} ${this.settings.site_phone}`,
          site_phone_code: this.settings.site_phone_code,
          site_phone: this.settings.site_phone,
          site_address: this.settings.site_address,
          site_url: this.settings.site_url,
          site_logo: this.imagePreview1,
          site_country: this.settings.site_country,
          enom_username: this.settings.enom_username,
          enom_password: this.settings.enom_password,
          enom_base_url: this.settings.enom_base_url,
          card_number: this.settings.card_number,
          card_month_year: this.settings.card_month_year,
          card_cvv: this.settings.card_cvv,
          payment_gateway: this.settings.payment_gateway,
          support_email: this.settings.support_email,
          support_phone: this.settings.support_phone,
          currency: this.settings.currency
        }

        // console.log('Payload :', payload)
        this.$refs.settingsForm.validate((valid) => {
          if (valid) {
            this.loading = true
            axios
              .put(
                this.dynamic_base_url(
                  `admin/settings/update/${this.settings.settings_id}`
                ),
                payload,
                {
                  headers: { Authorization: 'Bearer ' + getToken() }
                }
              )
              .then((response) => {
                this.$message.success(response.data.message)
                this.loading = false
                this.fetchSettings()
              })
              .catch((error) => {
                const errorRes = error.response.data
                if (errorRes.status >= 400 || errorRes.status === false) {
                  this.$message.error(errorRes.message)
                } else {
                  console.error('Error during settings update:', error)
                  this.$message.error(
                    'An error occurred during settings update.'
                  )
                }
                this.loading = false
              })
          } else {
            return false
          }
        })
      },

      handleUploadClick(index) {
        const fileInputRef = this.$refs[`fileInput${index}`]
        fileInputRef.click()
      },
      handleFileChange(index) {
        const fileInputRef = this.$refs[`fileInput${index}`]
        const file = fileInputRef.files[0]
        if (file) {
          this.readAndDisplayImage(file, index)
          this.convertToBase64(file, index) // Add this line to convert the file to Base64
        }
      },
      readAndDisplayImage(file, index) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this[`imagePreview${index}`] = e.target.result
        }
        reader.readAsDataURL(file)
      },

      convertToBase64(file, index) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this[`imagePreview${index}`] = e.target.result
        }
        reader.readAsDataURL(file)
      },

      resetImage(index) {
        this[`imagePreview${index}`] = null
        const fileInputRef = this.$refs[`fileInput${index}`]
        fileInputRef.value = ''
      },
      handleDrop(index, event) {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) {
          this.readAndDisplayImage(file, index)
        }
      }
    }
  }
</script>

<style scoped>
  .phone-input {
    width: 300px;
    /* Adjust the width as needed */
  }

  .phone-code {
    width: 80px;
    /* Adjust the width as needed */
  }

  .upload_wrap {
    width: fit-content;
    position: relative;
    border: 2px dashed #bbb;
    border-radius: 5px;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    height: 9em;
    width: 13em;
    max-width: 100%;
    cursor: pointer;
    background: rgba(97, 94, 107, 0.1) !important;
  }

  .upload_img {
    position: absolute;
    /* left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
    /* inset: 0; */
    margin: auto;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    overflow: hidden;
    z-index: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .upload_img img {
    object-fit: contain;
    aspect-ratio: 1;
    width: 100%;
    height: 100%;
  }

  .select_text {
    font-size: 12px;
    font-weight: 600;
    position: relative;
    z-index: 99;
    text-align: center;
    line-height: 1.2;
  }

  .reset_btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 8px 12px !important;
    z-index: 99;
  }

  .change_text {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    inset: 0;
    display: flex !important;
    flex-direction: column;
    justify-content: center !important;
    align-items: center !important;
    transition: 0.5s ease;
    border-radius: 5px;
    z-index: 99;
  }

  .upload_wrap:hover .change_text {
    opacity: 1;
    visibility: visible;
    background: rgba(97, 94, 107, 0.8) !important;
  }

  .change_text span {
    z-index: 999;
    transition: none;
    color: white;
  }

  .upload_wrap:hover .reset {
    color: white;
  }

  .no_clickable {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent !important;
    border-radius: 5px;
    z-index: -1;
  }

  .reset_btn:hover~.no_clickable {
    z-index: 9999 !important;
  }
</style>