<template>
  <div class="app-container">

    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="analytics.customers">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Customers
            </div>
            <count-to :start-val="0" :end-val="analytics.customers" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="analytics.new_customers">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              New
            </div>
            <count-to :start-val="0" :end-val="analytics.new_customers" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="analytics.active_customers">
          <div class="card-panel-icon-wrapper">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Active
            </div>
            <count-to :start-val="0" :end-val="analytics.active_customers" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="analytics.inactive_customers">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Inactive
            </div>
            <count-to :start-val="0" :end-val="analytics.inactive_customers" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
import axios from 'axios'
import { getToken } from '@/utils/auth'

  export default {
    components: {
      CountTo,
    },
    data() {
      return {
        analytics: {
          customers: 0,
          new_customers: 0,
          active_customers: 0,
          inactive_customers: 0,
        },
      }
    },
    computed: {
      statsSlice() {
        const keys = Object.keys(this.analytics)
        const slicedKeys = keys.slice(0, -3)
        const slicedStats = {}
        slicedKeys.forEach((key) => {
          // console.log("Checking Array", slicedStats[key])
          // if (slicedStats[key].includes("customer")) {
          slicedStats[key] = this.analytics[key]
          // }
        })
        // console.log('slicedStats', slicedStats)
        return slicedStats
      }
    },
    mounted() {
      // console.log('Analytics', this.analytics)
      this.fetchStatistics()

    },
    methods: {
      // handleSetLineChartData(type) {
      //   this.$emit('handleSetLineChartData', type)
      // }

      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
      formatKeyName(key) {
        return key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      },
      getIconClass(key) {
        // You can define your logic here to return icon class based on key
        // For example:
        switch (key) {
          case 'customers':
          case 'new_customers':
            return 'peoples'

          case 'active_customers':
          case 'inactive_customers':
            return 'money'

          case 'invoices':
          case 'new_invoices':
          case 'active_invoices':
          case 'inactive_invoices':
          case 'paid_invoices':
          case 'pending_invoices':
            return 'drag'
          default:
            return ''
        }
      },
      fetchStatistics() {
        this.loader = true
        axios
          .get(this.dynamic_base_url('admin/accounts'), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            if (response.data.success == true) {
              this.analytics.customers = response.data.data.customers
              this.analytics.new_customers = response.data.data.new_customers
              this.analytics.active_customers = response.data.data.active_customers
              this.analytics.inactive_customers = response.data.data.inactive_customers
              // if (response.data.message === 'Cards fetched successfully.') {
              //   this.$message.success('Stats fetched successfully.')
              // } else {
              //   this.$message.success(response.data.message)
              // }
            } else {
              console.error('Failed to fetch statistics data')
            }
            this.loader = false
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error(
                'Error fetching statistics data. Please try again later.'
              )
            }
            this.loader = false
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
