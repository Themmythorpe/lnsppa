<template>
  <div class="container_fluid">
    <div class="d-flex justify-content-between align-items-end mb-3">
      <div class="d-sm-flex justify-content-center align-items-start flex-column"
        style="gap: 6px !important; min-width: 10em">
        <!-- <label for="" class="d-block">View</label>

        <el-select
          id=""
          v-model="entrySelect"
          placeholder="Select..."
          class="w-100"
        >
          <el-option label="All Entries" selected value="all-entries" />
          <el-option label="Shuffled" value="shuffled" />
        </el-select> -->
      </div>
      <div>
        <el-button type="primary" class="read_more" @click="createGateway()">Create <span class="d-none d-sm-inline">New
            Gateway</span></el-button>
      </div>
    </div>

    <div class="table_wrap py-2">
      <el-table v-loading="loader" border="" style="width: 100%; min-width: 45em" :data="gateways" highlight-current-row
        :current-page.sync="currentPage" :page-size="pageSize" :total="totalGateways">
        <!-- @row-click="" -->
        <el-table-column label="Gateway ID" prop="pg_id" min-width="150" />
        <el-table-column label="Name" prop="name" min-width="150" />

        <el-table-column label="Key" prop="key" min-width="400">
          <template slot-scope="scope">
            <span class="py-3 text-center d-block w-100 pe-5 position-relative">
              <span v-if="keyType[scope.$index]">
                {{ scope.row["key"] }}
              </span>
              <span v-else>* * * * * * * *</span>

              <span class="show-pwd" @click="showPwd(scope.$index)">
                <svg-icon :icon-class="keyType[scope.$index] ? 'eye' : 'eye-open'" />
              </span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Secret Key" prop="secret" min-width="400">
          <template slot-scope="scope">
            <span class="py-3 text-center d-block w-100 pe-5 position-relative">
              <span v-if="secretType[scope.$index]">
                {{ scope.row["secret"] }}
              </span>
              <span v-else>* * * * * * * *</span>

              <span class="show-pwd" @click="showPwd(scope.$index, true)">
                <svg-icon :icon-class="secretType[scope.$index] ? 'eye' : 'eye-open'" />
              </span>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="Date" min-width="150">
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ formatDate(scope.row["created_at"]) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Action" width="195" align="center">
          <template slot-scope="scope">
            <!-- <el-button-group> -->
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editGateway(scope.row)">Edit</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small"
              @click="deleteGateway(scope.row)">Delete</el-button>
            <!-- </el-button-group> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pagination -->
    <div class="mt-4" style="width: fit-content; margin-left: auto">
      <el-pagination small layout="prev, pager, next" :total="totalGateways" :current-page.sync="currentPage"
        :page-size.sync="pageSize" @current-change="handlePageChange" />
    </div>

    <div>
      <el-dialog title="Confirm Delete" :visible.sync="showDeleteModal" width="30%" @close="handleClose">
        <p>Are you sure you want to delete this Gateway?</p>
        <div class="modal-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="danger" :loading="deleteloading" @click="handleDeleteConfirm">Confirm</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog :title="`${ModalTitle}`" :visible.sync="showGatewayModal" width="40%" class="pb-0 mb-0"
        @close="handleClose">
        <el-form ref="createGTWForm" :model="createGTW">
          <el-row :gutter="20" class="mb-0 pb-0">
            <el-form-item>
              <el-col>
                <label for="title">Gateway Name</label>
                <el-input id="amount" v-model.trim="createGTW.name" />
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="amount">Gateway Slug</label>
                <el-input id="amount" v-model.trim="createGTW.slug" />
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="amount">Key</label>
                <el-input id="amount" v-model.trim="createGTW.key" />
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="amount">Secret Key</label>
                <el-input id="amount" v-model.trim="createGTW.secret" />
              </el-col>
            </el-form-item>

            <el-form-item class="mb-0 pb-0">
              <el-col>
                <div class="" style="width: fit-content; margin-left: auto">
                  <el-button @click="handleClose">Cancel</el-button>

                  <el-button v-if="ModalTitle === 'Create New Gateway'" :loading="loading" type="primary"
                    style="background-color: #42b983 !important; border: none"
                    @click.native.prevent="handleCreateGateway">Create</el-button>
                  <el-button v-if="ModalTitle === 'Edit Gateway Details'" :loading="loading" type="primary"
                    style="background-color: #42b983 !important; border: none"
                    @click.native.prevent="handleUpdateGateway">Update</el-button>
                </div>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import axios from 'axios'
  import { getToken } from '@/utils/auth'

  export default {
    components: { Pagination },
    data() {
      return {
        gateways: [],
        loader: true,
        currentPage: 1,
        pageSize: 10,
        loading: false,
        deleteloading: false,
        totalGateways: 0,
        entrySelect: '',
        showDeleteModal: false,
        showGatewayModal: false,
        GTWId: '',
        ModalTitle: '',
        createGTW: {
          pg_id: '',
          name: '',
          slug: '',
          key: '',
          secret: ''
        },
        keyType: [],
        secretType: []
      }
    },
    mounted() {
      this.fetchGatewayList()
    },
    methods: {
      initializeVisibilityState() {
        // Initialize visibility state for each row
        if (this.gateways.length > 0) {
          this.keyType = Array(this.gateways.length).fill(false)
          this.secretType = Array(this.gateways.length).fill(false)
        }
      },
      showPwd(index, isSecret = false) {
        if (isSecret) {
          this.secretType.splice(index, 1, !this.secretType[index])
        } else {
          this.keyType.splice(index, 1, !this.keyType[index])
        }
        // console.log("For keyType in showPwd :", this.keyType);
        // console.log("For secretType in showPwd :", this.secretType);
      },

      handleUpdateGateway() {
        const payload = {
          pg_id: this.createGTW.pg_id,
          name: this.createGTW.name,
          slug: this.createGTW.slug,
          key: this.createGTW.key,
          secret: this.createGTW.secret
        }

        this.loading = true
        axios
          .put(this.dynamic_base_url(`admin/payment/gateway`), payload, {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            this.$message.success(response.data.message)
            this.loading = false
            this.createGTW.pg_id = ''
            this.createGTW.name = ''
            this.createGTW.slug = ''
            this.createGTW.key = ''
            this.createGTW.secret = ''
            this.showGatewayModal = false
            this.fetchGatewayList()
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              console.error('Error during gateway update:', error)
              this.$message.error('An error occurred during gateway update.')
            }
            this.loading = false
          })
      },

      handleCreateGateway() {
        this.loading = true

        const payload = {
          name: this.createGTW.name,
          slug: this.createGTW.slug,
          key: this.createGTW.key,
          secret: this.createGTW.secret
        }

        axios
          .post(this.dynamic_base_url(`admin/payment/gateway`), payload, {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            this.$message.success(response.data.message)
            this.loading = false
            this.createGTW.pg_id = ''
            this.createGTW.name = ''
            this.createGTW.slug = ''
            this.createGTW.key = ''
            this.createGTW.secret = ''
            this.showGatewayModal = false
            this.fetchGatewayList()
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              console.error('Error during gateway update:', error)
              this.$message.error('An error occurred during gateway update.')
            }
            this.loading = false
          })
      },

      fetchGatewayList() {
        this.loader = true
        axios
          .get(this.dynamic_base_url('admin/payment/gateway'), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            if (response.data.success) {
              this.totalGateways = response.data.data.length
              const startIdx = (this.currentPage - 1) * this.pageSize
              const endIdx = startIdx + this.pageSize
              this.gateways = response.data.data.slice(startIdx, endIdx)

              if (this.gateways.length > 0) {
                this.initializeVisibilityState()
              }
              // console.log("gateways :", response);
            } else {
              console.error('Failed to fetch gateway data')
            }
            this.loader = false
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error(
                'Error fetching gateway data. Please try again later.'
              )
            }
            this.loader = false
          })
      },

      editGateway(row) {
        this.ModalTitle = 'Edit Gateway Details'
        this.showGatewayModal = true
        this.createGTW.pg_id = row.pg_id
        this.createGTW.name = row.name
        this.createGTW.slug = row.slug
        this.createGTW.key = row.key
        this.createGTW.secret = row.secret
      },
      deleteGateway(val) {
        this.showDeleteModal = true
        this.GTWId = val.pg_id
      },
      createGateway() {
        this.showGatewayModal = true
        this.ModalTitle = 'Create New Gateway'
      },
      handleClose() {
        this.showDeleteModal = false
        this.createGTW.pg_id = ''
        this.createGTW.name = ''
        this.createGTW.slug = ''
        this.createGTW.key = ''
        this.createGTW.secret = ''
        this.showGatewayModal = false
        this.GTWId = ''
      },
      handleDeleteConfirm() {
        const id = {
          pg_id: this.GTWId
        }
        this.deleteloading = true

        axios
          .post(this.dynamic_base_url(`admin/payment/gateway/${this.GTWId}`), id, {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            this.$message.success(response.data.message)
            this.deleteloading = false
            this.showDeleteModal = false
            this.fetchGatewayList()
          })
          .catch((error) => {
            const errorRes = error.response.data
            this.$message.error(errorRes.message)

            // if (errorRes.status >= 400 || errorRes.status === false) {
            //   this.$message.error(errorRes.message);
            // } else {
            //   console.error("Error during gateway update:", error);
            //   this.$message.error("An error occurred during gateway update.");
            // }
            this.deleteloading = false
          })
      },
      handlePageChange(page) {
        this.currentPage = page
        this.fetchGatewayList()
      },

      formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' }
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', options)
      }
    }
  }
</script>

<style scoped>
  .example-pagination-block+.example-pagination-block {
    margin-top: 10px;
  }

  .example-pagination-block .example-demonstration {
    margin-bottom: 16px;
  }

  .table_wrap {
    width: 100%;
    overflow-x: auto;
  }

  .box-card {
    /* width: 400px; */
    max-width: 100%;
    margin: 20px auto;
    padding: 0;
    padding-bottom: 30px;
  }

  label {
    font-weight: 500 !important;
  }

  .dot_icon {
    vertical-align: middle;
    line-height: 1;
    font-size: 30px;
    font-weight: bold;
  }

  .bi-dot::before {
    width: 22px;
  }

  .el-dialog__body {
    padding: 30px 20px 10px !important;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }

  .show-pwd {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    /* color: ; */
    cursor: pointer;
    user-select: none;
    padding: 12px;
  }
</style>