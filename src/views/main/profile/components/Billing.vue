<template>
  <div class="app-container">
    <el-form ref="billingForm" @submit.prevent="createBillingForm">
      <el-form-item>
        <el-col :span="12">
          <label for="credit_card">Card Number</label>
          <el-input v-model="card_number" class="col-12" type="number" @input="handleCardNumberInput" />
        </el-col>

        <el-col :span="4">
          <label for="card_month">Exp. Month</label>
          <el-select v-model="card_month" placeholder="MM">
            <el-option v-for="month in months" :key="month.value" :label="month.label" :value="month.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <label for="card_year"> Exp. Year</label><br>
          <el-select v-model="card_year" placeholder="YY">
            <el-option v-for="year in futureYears" :key="year" :label="year" :value="year" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <label for="cvv">CVV</label><br>
          <el-input v-model="card_cvv" type="password" :maxlength="3" placeholder="CVV" />
        </el-col>
      </el-form-item>
      <el-form-item class="mx-2">
        <el-button type="primary" :loading="loading" @click="createBillingForm">Create Card</el-button>
      </el-form-item>
    </el-form>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
      style="width: 100%;">
      <el-table-column label="Billing Code" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.billing_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Card Number" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.card_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Card Expiration" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.card_expiration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Card CVV" min-width="200">
        <template slot-scope="{ row }">
          <span v-if="row.showCVV">{{ row.card_cvv }}</span>
          <span v-else>***</span>
          <el-button type="text" size="mini" @click="toggleCVV(row)">
            {{ row.showCVV ? '👁️' : '👁️‍🗨️' }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="showEditDialog(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="showDeleteDialog(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

    <el-dialog title="Edit Card" :visible.sync="showEditModal" @close="resetEditForm">
      <el-form v-if="editedItem" ref="editBillingForm" :model="editedItem">
        <el-form-item>
          <el-col :span="12">
            <label for="card_number">card number</label>
            <el-input v-model="editedItem.card_number" class="col-12" type="number" />
          </el-col>

          <!-- <el-col :span="12">
            <label for="card_expiration">Card Expiration</label><br>
            <el-input v-model="editedItem.card_expiration" type="text" class="col-12" />
          </el-col> -->
          <el-col :span="12">
            <label for="card_month">Exp. Month</label>
            <el-select v-model="editedItem.card_month" placeholder="MM">
              <el-option v-for="month in months" :key="month.value" :label="month.label" :value="month.value" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <label for="card_year"> Exp. Year</label><br>
            <el-select v-model="editedItem.card_year" placeholder="YY">
              <el-option v-for="year in futureYears" :key="year" :label="year" :value="year" />
            </el-select>
          </el-col>

          <el-col :span="12">
            <label for="cvv">CVV</label><br>
            <el-input v-model="editedItem.card_cvv" type="password" :maxlength="3" placeholder="CVV" />
          </el-col>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateBillingForm">Update Card</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <div>
      <el-dialog title="Confirm Delete" :visible.sync="showDeleteModal" width="30%" @close="handleClose">
        <p>Are you sure you want to delete this user?</p>
        <div class="modal-footer">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="handleDeleteConfirm">Confirm</el-button>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import { getToken } from '@/utils/auth'
  import countryWithCode from '../../mixin/country_with_code'
  import Pagination from '../../pagination' // secondary package based on el-pagination

  export default {
    components: { Pagination },
    props: {
      user: {
        type: Object,
        default: () => ({
          name: '',
          email: '',
          phone_number: '',
          phone_code: ''
        })
      }
    },
    data() {
      return {
        loading: false,
        showCVV: false,
        countryWithCode,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        cvvVisibility: {},
        listQuery: { page: 1, limit: 10 },
        // Form data
        card_number: '',
        card_month: '',
        card_year: '',
        card_cvv: '',
        card_expiration: '',
        showEditModal: false,
        showDeleteModal: false,
        selectedRowForDelete: null,
        editedItem: null,
        futureYears: this.generateFutureYears(),
        months: [
          { value: '01', label: 'January' },
          { value: '02', label: 'February' },
          { value: '03', label: 'March' },
          { value: '04', label: 'April' },
          { value: '05', label: 'May' },
          { value: '06', label: 'June' },
          { value: '07', label: 'July' },
          { value: '08', label: 'August' },
          { value: '09', label: 'September' },
          { value: '10', label: 'October' },
          { value: '11', label: 'November' },
          { value: '12', label: 'December' }
        ]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleCardNumberInput() {
        // Ensure the card number does not exceed 11 digits
        if (this.card_number && this.card_number.toString().length > 11) {
          this.card_number = this.card_number.toString().slice(0, 11)
        }
      },
      generateFutureYears() {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let i = 0; i < 4; i++) {
          years.push((currentYear + i).toString().slice(-2))
        }
        return years
      },
      toggleCVV(row) {
        // Toggle the visibility of CVV for the clicked row
        this.$set(row, 'showCVV', !row.showCVV)

        // Reset showCVV for all other rows
        this.list.forEach((item) => {
          if (item !== row) {
            this.$set(item, 'showCVV', false)
          }
        })
      },

      getList() {
        this.listLoading = true
        axios
          .get(this.dynamic_base_url('client/billings'), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            // Assuming each item in the response has an 'id' property
            this.list = response.data.data.map(item => ({ ...item, id: item.client_id }))

            this.total = this.list.length

            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
          .catch((error) => {
            console.error('Error fetching data:', error)
            this.listLoading = false
          })
      },

      handleExpMonthInput() {
        if (this.card_month < 0) {
          this.card_month = 0
        }
      },
      createBillingForm() {
        // Prepare data for the POST request
        const formData = {
          card_number: this.card_number,
          card_cvv: this.card_cvv,
          card_expiration: this.card_expiration,
          card_month: this.card_month,
          card_year: this.card_year
        }

        // Log the form data
        this.loading = true

        // Make a POST request to create data
        axios
          .post(this.dynamic_base_url('client/billings/create'), formData, {
            headers: {
              Authorization: 'Bearer ' + getToken(),
            }
          })
          .then((response) => {
            // Handle the response as needed
            this.$message.success(response.data.message)
            this.$message({
              message: 'Data created successfully',
              type: 'success',
              duration: 5 * 1000
            })
            this.loading = false

            // Fetch the updated data after successful submission
            this.getList()
            this.list.push(response.data.data)

            // Clear form fields
            this.card_number = ''
            this.card_cvv = ''
            this.card_expiration = ''
            this.card_month = ''
            this.card_year = ''
          })
          .catch(error => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status == false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error('Failed to create data. Please try again later.')
            }

            this.loading = false
          })
      },

      showEditDialog(row) {
        // Customize this part based on your data structure
        const cardExpiration = row.card_expiration
        const [cardMonth, cardYear] = cardExpiration.split('/')

        // Customize this part based on your data structure
        this.editedItem = {
          ...row,
          card_month: cardMonth,
          card_year: cardYear
        }
        this.showEditModal = true
      },

      updateBillingForm() {
        // Prepare data for the PUT request
        const formData = {
          card_number: this.editedItem.card_number,
          card_cvv: this.editedItem.card_cvv,
          card_expiration: this.editedItem.card_expiration,
          card_month: this.editedItem.card_month,
          card_year: this.editedItem.card_year
        }

        // Log the form data
        if (this.editedItem && this.editedItem.billing_code) {
          axios
            .put(
              this.dynamic_base_url(`client/billing/update/${this.editedItem.billing_code}`),
              formData,
              {
                headers: {
                  Authorization: 'Bearer ' + getToken(),
                }
              }
            )
            .then((response) => {
              // Handle the response as needed
              this.$message({
                message: 'Data updated successfully',
                type: 'success',
                duration: 5 * 1000
              })

              // Optionally, you can reset the form fields after successful submission
              this.$refs.editBillingForm.resetFields()
              this.showEditModal = false

              // Fetch the updated data after successful submission
              this.getList()
            })
            .catch((error) => {
              console.error('Error updating data:', error)
              this.$message.error('Failed to update data')
            })
        } else {
          console.error('Invalid editedItem or editedItem.billing_code')
        }
      },

      // Dialog for Delete
      resetEditForm() {
        this.$refs.editBillingForm.resetFields()
        this.editedItem = null
      },
      handleCancel() {
        this.$emit('cancel')
      },
      handleConfirm() {
        this.$emit('confirm')
      },
      handleClose() {
        this.$emit('close')
      },
      showDeleteDialog(row) {
        this.selectedRowForDelete = row
        this.showDeleteModal = true
      },
      handleDeleteConfirm() {
        // Ensure 'selectedRowForDelete' is not null and has a 'billing_code'
        if (this.selectedRowForDelete && this.selectedRowForDelete.billing_code) {
          const billingCode = this.selectedRowForDelete.billing_code

          axios
            .delete(this.dynamic_base_url(`client/billing/delete/${billingCode}`), {
              headers: { Authorization: 'Bearer ' + getToken() }
            })
            .then(() => {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
              })

              // Optionally, close the delete modal
              this.showDeleteModal = false

              // Optionally, update your data list to reflect the deletion
              const index = this.list.findIndex(item => item.billing_code === billingCode)
              if (index !== -1) {
                this.list.splice(index, 1)
              }
            })
            .catch(error => {
              console.error('Error deleting data:', error)
            })
        } else {
          console.error('Invalid row or row.billing_code:', this.selectedRowForDelete)
        }
      },

      fetchBillingDetails(billingCode) {
        // Make a request to fetch billing details based on billing code
        axios
          .get(this.dynamic_base_url(`client/billing/details/${billingCode}`), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            // Assuming the response data contains billing details
            this.editedItem = { ...response.data.data } // Update the form data
          }).catch(error => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error('Error fetching billing details.')
            }

            // this.loading = false
          })
      }

    }
  }
</script>
