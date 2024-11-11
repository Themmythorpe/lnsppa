<template>
  <el-form ref="accountForm" :model="account">
    <el-row v-loading="listLoading" :gutter="20">
      <el-form-item>
        <el-col :span="12">
          <label for="first_name">First Name</label>
          <el-input v-model.trim="account.first_name" class="col-12" />
        </el-col>
        <el-col :span="12">
          <label for="last_name">Last Name</label>
          <el-input v-model.trim="account.last_name" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="12">
          <label for="phone_number">Phone Number</label><br>
          <el-input v-model="account.phone_number" :sm="12" :md="8" :lg="8" placeholder="Enter phone number">
            <template slot="prepend">
              <el-select v-model="account.phone_code" placeholder="Code" class="phone-code">
                <el-option
                  v-for="(code, key) in countryWithCode"
                  :key="key"
                  :label="`${code.dial_code} ${code.name}`"
                  :value="code.dial_code"
                />
                <!-- Add more options as needed -->
              </el-select>
            </template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Email">
            <el-input v-model.trim="account.email" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="12">
          <label for="street_address">Address</label>
          <textarea v-model.trim="account.street_address" class="h-50 form-control" />
        </el-col>
        <el-col :span="12">
          <label for="street_address2">Address 2 (Optional)</label>
          <textarea v-model.trim="account.street_address2" class="h-50 form-control" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="12">
          <label for="company_name">Company Name</label>
          <el-input id="company_name" v-model.trim="account.company_name" class="col-12" readonly />
        </el-col>
        <el-col :span="12">
          <label for="receive_mails">Receive Mail</label><br>
          <el-select id="receive_mails" v-model.trim="account.receive_mails" placeholder="Receive Mails" class="col-12">
            <el-option label="Yes" :value="true" />
            <el-option label="No" :value="false" />
            <!-- Add more options as needed -->
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="8">
          <label for="city">City</label>
          <el-input id="city" v-model.trim="account.city" />
        </el-col>
        <el-col :span="8">
          <label for="state">State</label>
          <el-input id="state" v-model.trim="account.state" class="col-4" />
        </el-col>
        <el-col :span="8">
          <label for="country">Country</label>
          <el-select v-model.trim="account.country" placeholder="Country" class="d-block w-100">
            <el-option
              v-for="(country_name, key) in countryWithCode"
              :key="key"
              :label="country_name.name"
              :value="country_name.name"
            />
          </el-select>
          <!-- <el-input id="country" v-model.trim="account.country" readonly /> -->
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="12">
          <label for="postcode">Postcode</label>
          <el-input id="postcode" v-model.trim="account.postcode" type="number" />
        </el-col>
        <el-col :span="12">
          <label for="customer_cat">Category</label>
          <el-input id="customer_cat" v-model.trim="account.customer_cat" class="col-4" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col>
          <div class="" style="width: fit-content; margin-left: auto">
            <el-button
              :loading="loading"
              type="primary"
              style="background-color: #42b983 !important; border: none"
              @click.native.prevent="submit"
            >Update Account</el-button>
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
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          phone_number: '',
          phone_code: ''
        }
      }
    }
  },
  data() {
    return {
      countryWithCode,
      listLoading: true,
      loading: false,
      account: {
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        street_address: '',
        street_address2: '',
        company_name: '',
        receive_mails: '',
        city: '',
        state: '',
        country: '',
        postcode: '',
        customer_cat: ''
      }
    }
  },
  created() {
    this.fetchUserData()
  },
  methods: {
    fetchUserData() {
      this.listLoading = true
      axios
        .get(this.dynamic_base_url('client/profile'), {
          headers: { Authorization: 'Bearer ' + getToken() }
        })
        .then((response) => {
          this.account = response.data.data
          this.listLoading = false
        })
        .catch((error) => {
          const errorRes = error.response.data
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message)
          } else {
            console.error('Error during account profile update:', error)
            this.$message.error('An error occurred during account profile update.')
          }
          this.listLoading = false
        })
    },
    submit() {
      this.loading = true

      axios
        .put(
          this.dynamic_base_url('client/profile/update'),
          {
            account_id: this.account.account_id,
            first_name: this.account.first_name,
            last_name: this.account.last_name,
            phone_number: this.account.phone_number,
            phone_code: this.account.phone_code,
            email: this.account.email,
            street_address: this.account.street_address,
            street_address2: this.account.street_address2,
            company_name: this.account.company_name,
            receive_mails: this.account.receive_mails,
            city: this.account.city,
            state: this.account.state,
            country: this.account.country,
            postcode: this.account.postcode,
            customer_cat: this.account.customer_cat
          },
          {
            headers: { Authorization: 'Bearer ' + getToken() }
          }
        )
        .then((response) => {
          this.$message.success(response.data.message)
          this.loading = false
          this.fetchUserData()
        })
        .catch((error) => {
          const errorRes = error.response.data
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message)
          } else {
            console.error('Error during account profile update:', error)
            this.$message.error('An error occurred during account profile update.')
          }
          this.loading = false
        })
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

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    display: none !important;
    margin: 0;
  }

  textarea {
    resize: none;
    box-shadow: none !important;
  }
</style>
