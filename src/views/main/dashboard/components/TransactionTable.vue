<template>
  <div>
    <div class="app-container rounded bg-white px-0 pb-0 mb-0">
      <h4 class="p-3 pt-0 text-dark">Recent Domains</h4>

      <div class="w-100 table_wrap">
      <el-table v-loading="loader" border :data="domains" highlight-current-row style="width: 100%;"
        :current-page.sync="currentPage" :page-size="pageSize" :total="totalDomains">
        <el-table-column prop="domain_id" label="Domain ID" min-width="150">
          <template slot-scope="scope">
            <span class="text-primary py-3 d-block position-relative">{{ scope.row["domain_id"] }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="domain_name" label="Domain Name" min-width="200">
          <template slot-scope="scope">
            <span class=" py-3 d-block position-relative">{{ scope.row["domain_name"] }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="domain_sld" label="Domain SLD" min-width="150">
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ scope.row["domain_sld"] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="domain_tld" label="Domain TLD" min-width="150">
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ scope.row["domain_tld"] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="amount" label="Amount" min-width="150">
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ $store.getters.currencyIcon }}{{ formatAmount(scope.row["amount"] || 0) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="domain_created_at" label="Date" min-width="200">
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ formatDate(scope.row["domain_created_at"]) }}
              {{ scope.row.domain_created_at ? moment(scope.row["domain_created_at"]).format("HH:mm A") : "---" }}
            </span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" icon="el-icon-view" size="small" @click="viewDomain(scope.row)" />
            <el-button icon="el-icon-edit" type="primary" size="small" @click="editDomain(scope.row)" />
            <el-button icon="el-icon-delete" size="small" type="danger" @click="deleteDomain(scope.row)" />
          </el-button-group>
        </template>
      </el-table-column> -->
      </el-table>
      </div>

    </div>

    <!-- Pagination -->
    <div class="bg-white">
      <div class="p-3" style="width: fit-content; margin-left: auto">
        <el-pagination small layout="prev, pager, next" :total="totalDomains" :current-page.sync="currentPage"
          :page-size.sync="pageSize" @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import axios from 'axios'
  import { getToken } from '@/utils/auth'
import moment from "moment";

  export default {
    components: { Pagination },
    data() {
      return {
        domains: [],
        loader: true,
        currentPage: 1,
        pageSize: 10,
        totalDomains: 0,
        showDeleteModal: false,
        DomId: ''
      }
    },
    mounted() {
      this.fetchDomains()
    },
    methods: {
      moment,
      fetchDomains() {
        this.loader = true
        axios
          .get(this.dynamic_base_url('client/dashboard'), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            if (response.data.success == true) {
              this.totalDomains = response.data.data.recent_domains.length
              const startIdx = (this.currentPage - 1) * this.pageSize
              const endIdx = startIdx + this.pageSize
              this.domains = response.data.data.recent_domains.slice(startIdx, endIdx)
            } else {
              console.error('Failed to fetch recent domain data')
            }
            this.loader = false
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error(
                'Error fetching recent domain data. Please try again later.'
              )
            }
            this.loader = false
          })
      },
      handleClose() {
        this.showDeleteModal = false
        this.showCreateModal = false
        this.DomId = ''
      },
      handlePageChange(page) {
        this.currentPage = page
        this.fetchDomains()
      },
      formatDate(dateString) {
        if (dateString === 'All') {
          return dateString
        } else {
          const options = { day: 'numeric', month: 'short', year: 'numeric' }
          const date = new Date(dateString)
          return date.toLocaleDateString('en-GB', options)
        }
      },
      formatAmount(amount) {
        if (typeof amount === 'string' && amount.includes(',')) {
          amount = amount.replace(/,/g, '')
        }

        const numericAmount = parseFloat(amount)

        // Check if numericAmount is a valid number
        if (!isNaN(numericAmount)) {
          return numericAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }

        return amount
      }
    }
  }
</script>

<style scoped>
  td {
    padding: 20px 0 !important;
  }

  .app-container {
    overflow-x: hidden;
  }
  .table_wrap {
    overflow-x: auto;
  }
</style>
