<template>
  <div class="editor-container">
    <el-card class="box-card">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="text-jumbo text-ginormous mb-0">
          Manage Activity Log
        </h4>
        <div class="d-flex align-items-center">
          <el-input
            v-model="listQuery.search"
            placeholder="Search activities..."
            style="width: 200px"
            class="filter-item me-2"
            @input="handleSearch"
          />
        </div>
      </div>

      <el-table :data="paginatedList" style="width: 100%; padding-top: 15px">
        <el-table-column label="S/N" width="50" align="center">
          <template slot-scope="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Causer" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.causer }}
          </template>
        </el-table-column>
        <el-table-column label="Subject" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.subject }}
          </template>
        </el-table-column>
        <el-table-column label="Description" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="Date" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
      </el-table>

      <div class="d-flex justify-content-between align-items-center pt-4">
        <div>
          Showing {{ (currentPage - 1) * pageSize + 1 }} to
          {{ Math.min(currentPage * pageSize, total) }} of {{ total }} entries
        </div>
        <div class="d-flex align-items-center">
          <el-select v-model="pageSize" placeholder="Items per page" @change="handleSizeChange" style="width: 120px;">
            <el-option v-for="size in pageSizes" :key="size" :label="size === total ? 'All' : size" :value="size" />
          </el-select>
          <el-pagination
            small
            layout="prev, pager, next"
            v-show="total > 0"
            :total="total"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      pageSizes: [5, 10, 20, 50, 'All'],
      listQuery: {
        search: "",
      },
    };
  },
  computed: {
    paginatedList() {
      const filteredList = this.list.filter((activity) =>
        activity.causer.toLowerCase().includes(this.listQuery.search.toLowerCase()) ||
        activity.subject.toLowerCase().includes(this.listQuery.search.toLowerCase()) ||
        activity.description.toLowerCase().includes(this.listQuery.search.toLowerCase())
      );
      this.total = filteredList.length;
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.pageSize === 'All' ? this.total : start + this.pageSize;
      return filteredList.slice(start, end);
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // Mock data for demonstration purposes
      this.list = [
        { causer: "John Doe", subject: "Login", description: "User logged in", date: "2023-10-01" },
        { causer: "Jane Smith", subject: "Update Profile", description: "Profile updated", date: "2023-10-02" },
        { causer: "Alice Johnson", subject: "Logout", description: "User logged out", date: "2023-10-03" },
        { causer: "Bob Brown", subject: "Password Change", description: "Password changed", date: "2023-10-04" },
        { causer: "Charlie Davis", subject: "Login", description: "User logged in", date: "2023-10-05" },
        { causer: "Diana Evans", subject: "Delete Account", description: "Account deleted", date: "2023-10-06" },
        { causer: "Ethan Harris", subject: "Login", description: "User logged in", date: "2023-10-07" },
        { causer: "Fiona Green", subject: "Update Profile", description: "Profile updated", date: "2023-10-08" }
      ];
      this.total = this.list.length;
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    handleSizeChange(size) {
      this.pageSize = size === 'All' ? this.total : size;
      this.currentPage = 1; // Reset to first page on size change
    },
    handleSearch() {
      this.currentPage = 1; // Reset to first page on search
    }
  }
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

