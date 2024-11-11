<template>
  <div class="editor-container">
    <el-card class="box-card">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="text-jumbo text-ginormous mb-0">
          Manage Roles & Permissions
        </h4>
        <div class="d-flex align-items-center">
          <el-input
            v-model="listQuery.search"
            placeholder="Search roles..."
            style="width: 200px"
            class="filter-item me-2"
            @input="handleSearch"
          />
          <el-button type="primary" class="ml-3" @click="showDialog = true">
            New Role
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
        <el-table-column label="Permissions" min-width="150">
          <template slot-scope="scope">
            <el-tag
              v-for="(permission, index) in scope.row.permissions.slice(0, 3)"
              :key="index"
              type="primary"
              size="mini"
              class="mx-1"
            >
              {{ permission }}
            </el-tag>
            <el-tag
              v-if="scope.row.permissions.length > 3"
              type="warning"
              size="mini"
              class="mx-1"
            >
              +{{ scope.row.permissions.length - 3 }} more
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
                @click="viewPerm(scope.row)"
              />

              <!-- Edit Button -->
              <el-button
                icon="el-icon-edit"
                size="mini"
                @click="editPerm(scope.row)"
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
        title="New Role"
        :visible.sync="showDialog"
      >
        <el-form :model="newRole" label-width="120px">
          <el-form-item label="Role Name">
            <el-input v-model="newRole.name" />
          </el-form-item>
          <el-form-item label="Permissions">
            <el-select
              v-model="newRole.permissions"
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
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">Cancel</el-button>
          <el-button type="primary" @click="createRole">Create</el-button>
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
      newRole: {
        name: "",
        permissions: [],
      },
      allPermissions: ["Read", "Write", "Execute", "Delete", "Update"],
    };
  },
  computed: {
    paginatedList() {
      const filteredList = this.list.filter((role) =>
        role.name.toLowerCase().includes(this.listQuery.search.toLowerCase())
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
        { name: "Admin", permissions: ["Read", "Write", "Execute", "Delete"] },
        { name: "Editor", permissions: ["Read", "Write", "Update"] },
        { name: "Viewer", permissions: ["Read"] },
        { name: "Contributor", permissions: ["Read", "Write"] },
        { name: "Manager", permissions: ["Read", "Write", "Execute"] },
        { name: "Operator", permissions: ["Read", "Execute"] },
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
    createRole() {
      if (this.newRole.name && this.newRole.permissions.length) {
        this.list.push({ ...this.newRole });
        this.showDialog = false;
        this.newRole = { name: "", permissions: [] }; // Reset form
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
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

