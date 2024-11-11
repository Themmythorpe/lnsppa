<template>
  <div class="app-container px-0">
    <div class="wrap">
      <el-table
        v-loading="loader"
        border
        :data="domains"
        highlight-current-row
        style="width: 100%; min-width: 80em"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="totalDomains"
      >
        <el-table-column
          prop="DomainNameID"
          label="Domain Name ID"
          min-width="200"
        >
          <template slot-scope="scope">
            <span class="text-primary py-3 d-block position-relative">{{
              scope.row["DomainNameID"]
              }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="sld"
          label="Domain Name"
          min-width="200"
        >
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">{{
              scope.row["sld"]
              }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="tld"
          label="TLD"
          min-width="150"
        >
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ scope.row["tld"] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="ns-status"
          label="NS Status"
          min-width="150"
        >
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ scope.row["ns-status"] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="auto-renew"
          label="Auto Renew"
          min-width="150"
        >
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ scope.row["auto-renew"] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="RRProcessor"
          label="RR Processor"
          min-width="150"
        >
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ scope.row["RRProcessor"] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="wppsstatus"
          label="WPPS Status"
          min-width="150"
        >
          <template slot-scope="scope">
            <span class="text-capitalize py-3 d-block position-relative">{{
              scope.row["wppsstatus"]
              }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="expiration-date"
          label="Expiration Date"
          min-width="200"
        >
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ scope.row["expiration-date"] ? formatDate(scope.row["expiration-date"]) : "---" }}
              {{ scope.row["expiration-date"] ? moment(scope.row["expiration-date"]).format("HH:mm A") : "---" }}
            </span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="Status" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
       -->
        <!-- <el-table-column
          label="Actions"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              size="small"
              type="danger"
              @click="deleteDomain(scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
    <!-- Pagination -->
    <div
      class="mt-4"
      style="width: fit-content; margin-left: auto"
    >
      <el-pagination
        small
        layout="prev, pager, next"
        :total="totalDomains"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        @current-change="handlePageChange"
      />
    </div>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog> -->

    <div>
      <el-dialog
        title="Confirm Delete"
        :visible.sync="showDeleteModal"
        width="30%"
        @close="handleClose"
      >
        <p>Are you sure you want to delete this domain?</p>
        <div class="modal-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button
            type="danger"
            @click="handleDeleteConfirm"
          >Confirm</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import axios from "axios";
import { getToken } from "@/utils/auth";
import moment from "moment";

export default {
  components: { Pagination },
    props: {
    // filters: {
    //   type: Object,
    //   default: () => ({})
    // }
  },
  data() {
    return {
      domains: [],
      loader: true,
      currentPage: 1,
      pageSize: 10,
      totalDomains: 0,
      showDeleteModal: false,
      DomId: "",
    };
  },
  created() {
    this.$bus.$on("admin_domain_purchased", this.handleDomainPurchased);
  },
  mounted() {
    this.fetchDomains();
  },
  // watch: {
  //   filters: {
  //     handler: "fetchDomains",
  //     deep: true
  //   },
  //   currentPage: "fetchDomains",
  // },
  methods: {
    moment,
    formatDate(dateString) {
        const options = { day: "numeric", month: "short", year: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", options);
    },
    handleDomainPurchased() {
      // console.log("Domain purchased event received. Refreshing domains...");
      this.fetchDomains();
    },
    fetchDomains() {
      this.loader = true;

      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
      };

      axios
        .get(this.dynamic_base_url("admin/enom/domains"), {
          headers: { Authorization: "Bearer " + getToken() },
            params,
        })
        .then((response) => {
          if (response.data.success) {
            this.totalDomains = response.data.data.length;
            const startIdx = (this.currentPage - 1) * this.pageSize;
            const endIdx = startIdx + this.pageSize;
            this.domains = response.data.data.slice(startIdx, endIdx);
          } else {
            console.error("Failed to fetch domain data");
          }
          this.loader = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error fetching domain data. Please try again later."
            );
          }
          this.loader = false;
        });
    },

    viewDomain(row) {
      // this.$router.push({
      //   name: 'view-domain-cat',
      //   params: { id: row.DomainNameID }
      // })
    },
    editDomain(row) {
      console.log("Selected domain to be edited:", row);
    },
    deleteDomain(val) {
      this.showDeleteModal = true;
      this.DomId = val.DomainNameID;
    },
    createdomain() {
      this.showCreateModal = true;
    },
    handleClose() {
      this.showDeleteModal = false;
      this.showCreateModal = false;
      this.DomId = "";
    },
    handleDeleteConfirm() {
      console.log("Assigned ID :", this.DomId);
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchDomains();
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  overflow-x: auto;
}
</style>
