<template>
  <el-row :gutter="40" class="panel-group">
    <el-col
      v-for="(value, key) in statsSlice"
      :key="key"
      :xs="24"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon
            :icon-class="getIconClass(key)"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ formatKeyName(key) }}
          </div>
          <span
            v-if="key === 'enom_available_balance' || key === 'enom_balance'"
            class="card-panel-num"
            >{{ $store.getters.currencyIcon }}</span
          ><count-to
            :start-val="0"
            :end-val="value"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>

  <!-- <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Customers
          </div>
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Active
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Inactive
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />

        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            New Clients
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Purchases
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Total Domain
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Active
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            InActive
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row> -->
</template>

<script>
import CountTo from "vue-count-to";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  components: {
    CountTo,
  },
  data() {
    return {
      stats: {
        customers: 0,
        new_customers: 0,
        active_customers: 0,
        inactive_customers: 0,
        domains: 0,
        new_domains: 0,
        active_domains: 0,
        inactive_domains: 0,
        invoices: 0,
        new_invoices: 0,
        paid_invoices: 0,
        unpaid_invoices: 0,
        enom_balance: 0,
        enom_available_balance: 0,
        recent_domains: [],
      },
      loader: false,
    };
  },
  computed: {
    statsSlice() {
      const filteredStats = { ...this.stats };
      delete filteredStats.recent_domains;
      return filteredStats;
    },
  },
  mounted() {
    this.fetchStatistics();
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
    formatKeyName(key) {
      return key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    getIconClass(key) {
      // You can define your logic here to return icon class based on key
      // For example:
      switch (key) {
        case "customers":
        case "active_customers":
        case "inactive_customers":
        case "new_customers":
          return "peoples";

        case "domains":
        case "new_domains":
        case "active_domains":
        case "inactive_domains":
          return "money";

        case "invoices":
        case "new_invoices":
        case "active_invoices":
        case "inactive_invoices":
        case "paid_invoices":
        case "unpaid_invoices":
          return "drag";

        case "enom_available_balance":
        case "enom_balance":
          return "money";
        default:
          return "";
      }
    },
    fetchStatistics() {
      this.loader = true;
      axios
        .get(this.dynamic_base_url("client/dashboard"), {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          if (response.data.success == true) {
            this.stats = { ...response.data.data };
            this.formatEnomBalances();

            // this.stats = response.data.data
            // if (response.data.message === 'Cards fetched successfully.') {
            //   this.$message.success('Stats fetched successfully.')
            // } else {
            //   this.$message.success(response.data.message)
            // }
          } else {
            console.error("Failed to fetch statistics data");
          }
          this.loader = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error fetching statistics data. Please try again later."
            );
          }
          this.loader = false;
        });
    },

    formatEnomBalances() {
      if (this.stats.enom_available_balance) {
        const formattedAvailableBalance = parseFloat(
          this.stats.enom_available_balance.replace(/,/g, "")
        );
        this.$set(
          this.stats,
          "enom_available_balance",
          formattedAvailableBalance
        );
      }
      if (this.stats.enom_balance) {
        const formattedBalance = parseFloat(
          this.stats.enom_balance.replace(/,/g, "")
        );
        this.$set(this.stats, "enom_balance", formattedBalance);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

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
        background: #34bfa3;
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
      color: #34bfa3;
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
      width: 185px;
      max-width: 100%;
      float: right;
      position: absolute;
      right: 0;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      margin-right: 0px;
      white-space: nowrap;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        white-space: nowrap;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 360px) {
  // .card-panel-description {
  //   display: none;
  // }

  // .card-panel-icon-wrapper {
    // display: none;
    //   // float: none !important;
    //   margin: 0 !important;

    //   .svg-icon {
    //     display: block;
    //     margin: 14px auto !important;
    //     float: none !important;
    //   }
  // }
}
</style>

<style scoped>
@media screen and (max-width: 576px) {
  .panel-group {
  margin-top: 18px;
  margin-left: -8px !important;
  margin-right: -8px !important;
  }
   .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    }

  .card-panel-description {
    width: 200px;
    max-width: 100%;
    float: none !important;
    position: relative !important;
    right: auto !important;
    font-weight: bold;
    margin: 26px;
    margin-left: 10px !important;
    white-space: nowrap;
  }

  .card-panel-text {
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    white-space: nowrap;
    margin-bottom: 12px;
  }

  .card-panel-num {
    font-size: 20px;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
    transform: translateY(-6px);
  }
}
</style>
