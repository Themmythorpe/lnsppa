<template>
  <div class="editor-container">

        <!--  -->

    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Active Users</div>
            <count-to
              :start-val="0"
              :end-val="102400"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Inactive Users</div>
            <count-to
              :start-val="0"
              :end-val="81212"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="component" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Processed Users</div>
            <count-to
              :start-val="0"
              :end-val="9280"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="example" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">Declined Users</div>
            <count-to
              :start-val="0"
              :end-val="13600"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card class="box-card">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="text-jumbo text-ginormous mb-0">
          Manage Users
        </h4>
        <div class="d-flex align-items-center">
          <el-input
            v-model="listQuery.search"
            placeholder="Search users..."
            style="width: 250px"
            class="filter-item me-2"
            @input="handleSearch"
          />
          <el-button type="primary" class="ml-3" @click="showDialog = true">
            Create New User
          </el-button>
        </div>
      </div>

      <el-table :data="paginatedList" style="width: 100%; padding-top: 15px">
        <el-table-column label="S/N" width="50" align="center">
          <template slot-scope="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Name" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="Vehicle" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.vehicle }}
          </template>
        </el-table-column>
        <el-table-column label="Plate Number" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.plate_number }}
          </template>
        </el-table-column>
        <el-table-column label="Order_No" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.order_no | orderNoFilter }}
          </template>
        </el-table-column>
        <el-table-column label="Price" width="195" align="center">
          <template slot-scope="scope">
            {{ $store.getters.currencyIcon
            }}{{ scope.row.price | toThousandFilter }}
          </template>
        </el-table-column>
        <el-table-column label="Status" width="100" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="195" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <!-- View Button -->
              <el-button
                tag="el-button"
                icon="el-icon-view"
                size="mini"
                @click="viewUser(scope.row)"
              />

              <!-- Edit Button -->
              <el-button
                icon="el-icon-edit"
                size="mini"
                @click="editUser(scope.row)"
              />

              <!-- Delete Button -->
              <el-button
                icon="el-icon-delete"
                size="mini"
                @click="showDeleteModal(scope.row)"
              />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="d-block w-100 pt-4">
        <div class="" style="width: fit-content; margin-left: auto">
          <el-pagination
            small
            layout="prev, pager, next"
            v-show="total > 0"
            :total="total"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>

      <el-dialog
        width="600px"
        title="Create New User"
        :visible.sync="showDialog"
      >
        <el-form :model="newUser" label-width="120px">
          <el-form-item label="User Name">
            <el-input v-model="newUser.name" />
          </el-form-item>
          <!-- <el-form-item label="Permissions">
            <el-select
              v-model="newUser.permissions"
              multiple
              placeholder="Select permissions"
              class="w-100"
            >
              <el-option
                v-for="permission in allPermissions"
                :key="permission"
                :label="permission"
                :value="permission"
              />
            </el-select>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">Cancel</el-button>
          <el-button type="primary" @click="createUser">Create</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { transactionList } from "@/api/remote-search";
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        pending: "danger",
      };
      return statusMap[status];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    },
  },
  data() {
    return {
      showDialog: false,
      list: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      listQuery: {
        search: "",
      },
      newUser: {
        name: "",
        permissions: [],
      },
    };
  },
  computed: {
    paginatedList() {
      const filteredList = this.list.filter((user) =>
        user.name.toLowerCase().includes(this.listQuery.search.toLowerCase())
      );
      this.total = filteredList.length;
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return filteredList.slice(start, end);
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
    fetchData() {
      // Mock data for demonstration purposes
      this.list = [
        {
          name: "John Doe",
          vehicle: "Toyota Camry",
          plate_number: "F12345T3",
          order_no: "123456789012345678901234567890",
          price: 100,
          status: "success",
        },
        {
          name: "Jane Smith",
          vehicle: "Honda Accord",
          plate_number: "F67890T3",
          order_no: "223456789012345678901234567890",
          price: 200,
          status: "pending",
        },
        {
          name: "Alice Johnson",
          vehicle: "Ford Focus",
          plate_number: "F11223T3",
          order_no: "323456789012345678901234567890",
          price: 150,
          status: "success",
        },
        {
          name: "Bob Brown",
          vehicle: "Chevrolet Malibu",
          plate_number: "F44556T3",
          order_no: "423456789012345678901234567890",
          price: 250,
          status: "pending",
        },
        {
          name: "Charlie Davis",
          vehicle: "Nissan Altima",
          plate_number: "F77889T3",
          order_no: "523456789012345678901234567890",
          price: 300,
          status: "success",
        },
        {
          name: "Diana Evans",
          vehicle: "Hyundai Elantra",
          plate_number: "F99001T3",
          order_no: "623456789012345678901234567890",
          price: 350,
          status: "pending",
        },
        {
          name: "Ethan Harris",
          vehicle: "Kia Optima",
          plate_number: "F22334T3",
          order_no: "723456789012345678901234567890",
          price: 400,
          status: "success",
        },
        {
          name: "Fiona Green",
          vehicle: "Volkswagen Jetta",
          plate_number: "F55667T3",
          order_no: "823456789012345678901234567890",
          price: 450,
          status: "pending",
        },
      ];
      this.total = this.list.length;
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleSearch() {
      this.currentPage = 1; // Reset to first page on search
    },
    createUser() {
      this.showDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
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

@media (max-width: 550px) {
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

