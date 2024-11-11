<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col>
        <el-form>
          <el-form-item>
            <el-col :span="12">
              <label for="first_name">First Name</label>
              <el-input v-model.trim="user.name" class="col-12" />
            </el-col>
            <el-col :span="12">
              <label for="last_name">Last Name</label>
              <el-input v-model.trim="user.name" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <label for="phone_number">Phone Number</label><br>
              <el-input v-model="user.phone_number" :sm="12" :md="8" :lg="8" placeholder="Enter phone number">
                <template slot="prepend">
                  <el-select v-model="user.phone_code" placeholder="Code" class="phone-code">
                    <el-option
                      v-for="(code, key) in countryWithCode"
                      :key="key"
                      :label="code.dial_code"
                      :value="code.dial_code"
                    />
                    <!-- Add more options as needed -->
                  </el-select>
                </template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email">
                <el-input v-model.trim="user.email" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <label for="first_name">Address</label>
              <textarea v-model.trim="user.street_address" class="h-50 form-control" />
            </el-col>
            <el-col :span="12">
              <label for="first_name">Address 2 (Optional)</label>
              <textarea v-model.trim="user.street_address2" class="h-50 form-control" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <label for="first_name">Where did you hear about us</label>
              <textarea v-model.trim="user.where_did_you_hear_aboutus" class="h-50 form-control" />
            </el-col>
            <el-col :span="12">
              <label for="first_name">Receive Mail</label>
              <textarea v-model.trim="user.receive_mail" class="h-50 form-control" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <label for="is_login">Is Login</label>
              <el-input id="is_login" v-model.trim="user.is_login" class="col-12" readonly />
            </el-col>
            <el-col :span="12">
              <label for="role">Role</label>
              <el-input id="role" v-model.trim="user.role" class="col-12" readonly />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <label for="last_login">Last Login</label>
              <el-input id="last_login" v-model.trim="user.last_login" class="col-12" readonly />
            </el-col>
            <el-col :span="12">
              <label for="customer_cat">Customer Cat</label>
              <el-input id="customer_cat" v-model.trim="user.customer_cat" class="col-12" readonly />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <label for="currency">Currency</label>
              <el-input id="currency" v-model.trim="user.currency" class="col-12" readonly />
            </el-col>
            <el-col :span="12">
              <label for="status">Status</label><br>
              <el-select id="status" v-model.trim="user.status" placeholder="Select Status" class="col-12">
                <el-option label="Pending" selected value="pending" />
                <el-option label="Success" value="success" />
                <!-- Add more options as needed -->
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="8">
              <label for="city">City</label>
              <el-input id="city" v-model.trim="user.city" />
            </el-col>
            <el-col :span="8">
              <label for="state">State</label>
              <el-input id="state" v-model.trim="user.state" class="col-4" />
            </el-col>
            <el-col :span="8">
              <label for="country">Country</label>
              <el-input id="country" v-model.trim="user.country" readonly />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="12">
              <label for="postcode">Postcode</label>
              <el-input id="postcode" v-model.trim="user.postcode" />
            </el-col>
            <el-col :span="12">
              <label for="customer_cat">Category</label>
              <el-input id="customer_cat" v-model.trim="user.customer_cat" class="col-4" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">Update</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
      countryWithCode
    }
  },
  methods: {
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
<style scoped>
  .phone-input {
    width: 300px;
    /* Adjust the width as needed */
  }

  .phone-code {
    width: 80px;
    /* Adjust the width as needed */
  }
</style>
