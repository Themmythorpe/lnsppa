<template>
  <div class="container_fluid">
    <div
      class="w-100 d-flex flex-column flex-xl-row justify-content-between align-items-center"
    >
      <div class="w-100 d-flex justify-content-between align-items-end mb-3 d-block d-xl-none">
        <div class="" style="width: fit-content; margin-left: auto;">
          <el-button type="primary" class="read_more" @click="createPricing()"
            >Create<span class="d-none d-sm-inline"> New Pricing</span></el-button
          >
        </div>
      </div>

      <div
        class="w-100 filter-container d-flex justify-content-start flex-column flex-md-row align-items-end ml-auto"
        style=""
      >
        <div class="filter-item-wrap d-sm-flex align-items-center">
          <el-input
            v-model="listQuery.search"
            placeholder="Search TLD Name/ID..."
            style="width: 200px"
            class="filter-item me-sm-2 d-block"
            @input="handleFilterChange"
          />
          <el-input
            v-model="listQuery.pricing_id"
            placeholder="Search Pricing ID..."
            style="width: 200px"
            class="filter-item me-sm-2 d-block"
            @input="handleFilterChange"
          />
        </div>

        <div class="d-flex align-items-center" style="width: fit-content">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilterChange"
          />
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-refresh"
            @click="handleResetFilter"
          />
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-end mb-3 d-none d-xl-block">
        <div>
          <el-button type="primary" class="read_more" @click="createPricing()"
            >Create
            <span class="d-none d-sm-inline">New Pricing</span></el-button
          >
        </div>
      </div>
    </div>

    <div class="table_wrap py-2">
      <el-table
        v-loading="loader"
        border=""
        style="width: 100%; min-width: 45em"
        :data="pricings"
        highlight-current-row
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="totalPricings"
      >
        <!-- @row-click="" -->
        <el-table-column label="TLD ID" prop="tld_id" />
        <el-table-column label="Pricing ID" prop="pricing_id" />
        <el-table-column label="TLD Name" prop="name" />
        <el-table-column label="Price" prop="price" />
        <el-table-column label="Years" prop="years" />

        <el-table-column label="Action" width="195" align="center">
          <template slot-scope="scope">
            <!-- <el-button-group> -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editPricing(scope.row)"
              >Edit</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deletePricing(scope.row)"
              >Delete</el-button
            >
            <!-- </el-button-group> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pagination -->
    <div class="mt-4" style="width: fit-content; margin-left: auto">
      <el-pagination
        small
        layout="prev, pager, next"
        :total="totalPricings"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        @current-change="handlePageChange"
      />
    </div>

    <div>
      <el-dialog
        title="Confirm Delete"
        :visible.sync="showDeleteModal"
        width="30%"
        @close="handleClose"
      >
        <p>Are you sure you want to delete this pricing?</p>
        <div class="modal-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button
            type="danger"
            :loading="deleteloading"
            @click="handleDeleteConfirm"
            >Confirm</el-button
          >
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        :title="`${ModalTitle}`"
        :visible.sync="showPricingModal"
        width="40%"
        class="pb-0 mb-0"
        @close="handleClose"
      >
        <el-form ref="createPrcForm" :model="createPrc">
          <el-row :gutter="20" class="mb-0 pb-0">
            <el-form-item>
              <el-col>
                <label for="title">TLD Name</label>
                <!-- <el-input id="title" v-model.trim="" class="col-12" /> -->
                <el-select
                  id="tld_id"
                  v-model="createPrc.tld_id"
                  placeholder="Select Name"
                  class="w-100"
                >
                  <el-option
                    v-for="tld in domains_tld"
                    :key="tld.tld_id"
                    :label="`.${tld.name}`"
                    :value="tld.tld_id"
                  />
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="amount">TLD Amount</label>
                <el-input id="amount" v-model.trim="createPrc.price" />
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="title">Valid Years</label>
                <!-- <el-input id="title" v-model.trim="" class="col-12" /> -->
                <el-select
                  id="years"
                  v-model="createPrc.years"
                  placeholder="Select years"
                  class="w-100"
                >
                  <el-option
                    v-for="year in years"
                    :key="year.no"
                    :label="year.no"
                    :value="year.no"
                  />
                </el-select>
              </el-col>
            </el-form-item>

            <!-- <el-form-item>
              <el-col>
                <label for="description">Description</label>
                <textarea v-model.trim="createPrc.description" class="h-50 form-control" rows="4" />

              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col :span="12">
                <label for="subject">Subject</label>
                <el-input id="subject" v-model.trim="createPrc.subject" />
              </el-col>
              <el-col :span="12">
                <label for="status">Status</label>
                <el-select id="status" v-model="createPrc.status" placeholder="Status..." class="d-block w-100">
                  <el-option label="Active" selected value="active" />
                  <el-option label="Inactive" value="inactive" />
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="date">Date</label>
                <el-date-picker
                  id="date"
                  v-model="createPrc.date"
                  type="date"
                  format="dd-MM-yyyy"
                  placeholder="Select Date"
                  class="col-12 d-block w-100"
                />
              </el-col>
            </el-form-item> -->

            <el-form-item class="mb-0 pb-0">
              <el-col>
                <div class="" style="width: fit-content; margin-left: auto">
                  <el-button @click="handleClose">Cancel</el-button>

                  <el-button
                    v-if="ModalTitle === 'Create New Pricing'"
                    :loading="loading"
                    type="primary"
                    style="background-color: #42b983 !important; border: none"
                    @click.native.prevent="handleCreate"
                    >Create</el-button
                  >
                  <el-button
                    v-if="ModalTitle === 'Edit Pricing Details'"
                    :loading="loading"
                    type="primary"
                    style="background-color: #42b983 !important; border: none"
                    @click.native.prevent="handleUpdatePricing"
                    >Update</el-button
                  >
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
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  components: { Pagination },
  data() {
    return {
      pricings: [],
      domains_tld: [],
      loader: true,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      deleteloading: false,
      totalPricings: 0,
      entrySelect: "",
      showDeleteModal: false,
      showPricingModal: false,
      PrcId: "",
      ModalTitle: "",
      createPrc: {
        name: "",
        tld_id: "",
        price: "",
        years: "",
        pricing_id: "",
      },
      listQuery: {
        page: 1,
        search: "",
        pricing_id: "",
      },
      years: [
        {
          no: "1",
        },
        {
          no: "2",
        },
        {
          no: "3",
        },
        {
          no: "4",
        },
        {
          no: "5",
        },
        {
          no: "6",
        },
        {
          no: "7",
        },
        {
          no: "8",
        },
        {
          no: "9",
        },
        {
          no: "10",
        },
      ],
    };
  },
  mounted() {
    this.fetchPricingList();
    this.fetchDomainsTld();
  },
  methods: {
    fetchDomainsTld() {
      axios
        .get(this.dynamic_base_url("admin/domains/tld"), {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          this.domains_tld = response.data.data;
          // console.log("domains_tld :", this.domains_tld);
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error occurred while fetching pricing. Please try again later."
            );
          }
        });
    },

    handleUpdatePricing() {
      const payload = {
        pricing_id: this.createPrc.pricing_id,
        tld_id: this.createPrc.tld_id,
        price: this.createPrc.price,
        years: this.createPrc.years,
      };

      this.loading = true;
      axios
        .put(this.dynamic_base_url(`admin/domains/pricing`), payload, {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          this.$message.success(response.data.message);
          this.loading = false;
          this.createPrc.tld_id = "";
          this.createPrc.price = "";
          this.createPrc.years = "";
          this.showPricingModal = false;
          this.fetchPricingList();
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            console.error("Error during pricing update:", error);
            this.$message.error("An error occurred during pricing update.");
          }
          this.loading = false;
        });
    },

    handleCreate() {
      this.loading = true;

      // const formattedDate = this.createPrc.date
      //   .toLocaleDateString('en-GB', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric'
      //   })
      //   .split('/')
      //   .join('-')

      const payload = {
        tld_id: this.createPrc.tld_id,
        price: this.createPrc.price,
        years: this.createPrc.years,
      };

      axios
        .post(this.dynamic_base_url(`admin/domains/pricing/create`), payload, {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          this.$message.success(response.data.message);
          this.loading = false;
          this.createPrc.tld_id = "";
          this.createPrc.price = "";
          this.createPrc.years = "";
          this.showPricingModal = false;
          this.fetchPricingList();
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            console.error("Error during pricing update:", error);
            this.$message.error("An error occurred during pricing update.");
          }
          this.loading = false;
        });

      // setTimeout(() => {
      //   console.log('Create pricing :', payload)
      //   this.loading = false
      // }, 1000)
    },

    handleFilterChange() {
      this.fetchPricingList();
    },
    handleResetFilter() {
      this.listQuery = {
        search: "",
        pricing_id: "",
      };
      this.fetchPricingList();
    },

    fetchPricingList() {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize > 0 ? this.pageSize : "",
        search: this.listQuery.search,
        pricing_id: this.listQuery.pricing_id.toUpperCase(),
        page: this.listQuery.page,
      };

      this.loader = true;
      axios
        .get(this.dynamic_base_url("admin/domains/pricing"), {
          params,
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          if (response.data.success) {
            this.totalPricings = response.data.data.length;
            const startIdx = (this.currentPage - 1) * this.pageSize;
            const endIdx = startIdx + this.pageSize;
            this.pricings = response.data.data.slice(startIdx, endIdx);
            // console.log("pricings :", response);
          } else {
            console.error("Failed to fetch pricing data");
          }
          this.loader = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error fetching pricing data. Please try again later."
            );
          }
          this.loader = false;
        });
    },

    editPricing(row) {
      this.ModalTitle = "Edit Pricing Details";
      this.showPricingModal = true;
      this.createPrc.name = row.name;
      this.createPrc.price = row.price;
      this.createPrc.years = row.years;
      this.createPrc.pricing_id = row.pricing_id;
      this.createPrc.tld_id = row.tld_id;
      // this.$router.push({
      //   name: 'view-pricing-cat',
      //   params: { id: row.DomainNameID }
      // })
    },
    deletePricing(val) {
      this.showDeleteModal = true;
      this.PrcId = val.pricing_id;
    },
    createPricing() {
      this.showPricingModal = true;
      this.ModalTitle = "Create New Pricing";
    },
    handleClose() {
      this.showDeleteModal = false;
      this.createPrc.tld_id = "";
      this.createPrc.price = "";
      this.createPrc.years = "";
      this.showPricingModal = false;
      this.PrcId = "";
    },
    handleDeleteConfirm() {
      const id = {
        pricing_id: this.PrcId,
      };
      this.deleteloading = true;

      axios
        .post(
          this.dynamic_base_url(`admin/domains/pricing/${this.PrcId}`),
          id,
          {
            headers: { Authorization: "Bearer " + getToken() },
          }
        )
        .then((response) => {
          this.$message.success(response.data.message);
          this.deleteloading = false;
          this.showDeleteModal = false;
          this.fetchPricingList();
        })
        .catch((error) => {
          const errorRes = error.response.data;
          this.$message.error(errorRes.message);

          // if (errorRes.status >= 400 || errorRes.status === false) {
          //   this.$message.error(errorRes.message);
          // } else {
          //   console.error("Error during pricing update:", error);
          //   this.$message.error("An error occurred during pricing update.");
          // }
          this.deleteloading = false;
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchPricingList();
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
@media screen and (max-width: 576px) {
  .filter-item, .filter-item-wrap {
    width: 100% !important;
  }
}
</style>
