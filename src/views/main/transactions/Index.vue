<template>
  <div class="container-fluid">
    <el-card class="box-card mt-3">
      <h1 class="my-0">Transactions</h1>
      <!-- <div
        class="d-flex justify-content-start align-items-center mb-3"
        style="gap: 10px !important"
      >
        <label for="" class="d-block">View</label>

        <el-select
          id=""
          v-model="entrySelect"
          placeholder="Select"
          class="col-2"
        >
          <el-option label="All Entries" selected value="all-entries" />
          <el-option label="Shuffled" value="shuffled" />
        </el-select>
      </div> -->
     <div class="pt-4 pt-md-2 filter-container d-flex justify-content-end flex-row align-items-end ml-auto" style="">
      <div class="d-flex search_el align-items-center">
        <el-input
        v-model="listQuery.search"
        placeholder="Search"
        style="width: 200px"
        class="filter-item me-md-2 mt-0 pt-0"
      />
      </div>
      <div class="d-flex align-items-center" style="width: fit-content;">
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-refresh"
          @click="handleResetFilter"
        />
      </div>
      </div>

      <div class="table_wrap py-2">
        <el-table
          :key="tableKey"
          v-loading="loader"
          border
          fit
          style="width: 100%; min-width: 60em"
          :data="filteredTransactions"
          highlight-current-row
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :total="totalTransactions"
        >
          <el-table-column label="Order ID" prop="OrderID" />
          <el-table-column prop="Amount" label="Amount">
            <template slot-scope="scope">
              <span class="py-3 d-block position-relative">
                {{ scope.row["Amount"] || "Null" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Balance" label="Balance">
            <template slot-scope="scope">
              <span class="py-3 d-block position-relative">
                {{ scope.row["Balance"] || "Null" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="TransDescription" label="Description">
            <template slot-scope="scope">
              <span class="py-3 d-block position-relative">
                {{ scope.row["TransDescription"] || "Null" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Trans-Date" label="Date">
            <template slot-scope="scope">
              <span class="py-3 d-block position-relative">
                {{ formatDate(scope.row["Trans-Date"]) || "Null" }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="Action" width="195" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="primary"
                  tag="el-button"
                  icon="el-icon-view"
                  size="mini"
                  @click="viewInvoice(scope.row)"
                  >View</el-button
                >
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  @click="editInvoice(scope.row)"
                />
                <el-button type="danger" icon="el-icon-delete" size="mini" />
              </el-button-group>
            </template>
          </el-table-column> -->
        </el-table>
      </div>

      <!-- Pagination -->
      <div class="mt-4" style="width: fit-content; margin-left: auto">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="totalTransactions"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import CountTo from "vue-count-to";
import axios from "axios";
import { getToken } from "@/utils/auth";
// import { useRouter } from 'vue-router'
export default {
  components: {
    CountTo,
    Pagination,
  },
  data() {
    return {
      Transactions: [],
      loader: true,
      currentPage: 1,
      pageSize: 10,
      totalTransactions: 0,
      entrySelect: "",
      listQuery: {
        page: 1,
        payment_status: "",
        search: "",
      },
      tableKey: 0,
    };
  },
  mounted() {
    this.fetchTransactions();
  },
  computed: {
    filteredTransactions() {
      if (!this.listQuery.search) {
        return this.Transactions;
      }
      return this.Transactions.filter(
        (trsn) =>
          trsn.OrderID.toString().includes(this.listQuery.search) ||
          trsn.Amount.toString().includes(this.listQuery.search) ||
          trsn.Balance.toString().includes(this.listQuery.search) ||
          trsn.TransDescription.toLowerCase().includes(this.listQuery.search) ||
          (trsn.TransStatus && trsn.TransStatus.toLowerCase().includes(this.listQuery.search))
      );
    },
  },
  methods: {
    handleFilterChange() {
      // this.fetchTransactions();
    },

    handleResetFilter() {
      this.listQuery = {
        payment_status: "",
        search: "",
      };
    },

    fetchTransactions() {
      this.loader = true;
      axios
        .get(this.dynamic_base_url("admin/transactions"), {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          if (response.data.success) {
            this.totalTransactions = response.data.data.length;
            const startIdx = (this.currentPage - 1) * this.pageSize;
            const endIdx = startIdx + this.pageSize;
            this.Transactions = response.data.data.slice(startIdx, endIdx);
          } else {
            console.error("Failed to fetch transaction data");
          }
          this.loader = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error fetching transaction data. Please try again later."
            );
          }
          this.loader = false;
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchTransactions();
    },
    viewInvoice(row) {
      // console.log("Selected transaction to be viewed :", row);
      this.$router.push({
        name: "view-invoice",
        params: { id: row.invoice_id },
      });
    },
    editInvoice(row) {
      console.log("Selected Invoice to be edited :", row);
    },

    formatDate(dateString) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", options);
    },
  },
};
</script>

<style scoped>
.example-pagination-block + .example-pagination-block {
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
</style>


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
      // float: right;

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

@media (max-width: 576px) {
  .card-panel-description {
    padding-left: 15px !important;
  }

  // .card-panel-icon-wrapper {
  //   float: none !important;
  //   display: none !important;
  //   width: 100%;
  //   height: 100%;
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
  .filter-container .filter-item,
  .filter-container .search_el,
  .filter-container .search_el *
  {
    width: 100% !important;
  }
}
</style>
