<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="8">
      <el-col>
        <panel-group :analytics="analytics" />
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <!-- <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 24}"
        :xl="{span: 24}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <complex-table />
      </el-col> -->
      <el-col>
        <complex-table :list="list" :list-loading="listLoading" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup.vue";
import axios from "axios";
import { getToken } from "@/utils/auth";
import ComplexTable from "./components/ComplexTable";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  name: "Customers",
  // props: { list: Array },

  components: {
    PanelGroup,
    ComplexTable,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      list: [],
      analytics: [],
      total: {},
    };
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      this.$emit("listLoading", true);

      // const params = {
      //   page: this.listQuery.page,
      //   limit: this.listQuery.limit,
      //   importance: this.listQuery.importance,
      //   search: this.listQuery.search,
      //   type: this.listQuery.type,
      //   sort: this.listQuery.sort
      // }

      axios
        .get(this.dynamic_base_url("admin/accounts"), {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          this.list = response.data.data.users.data;
          this.analytics = response.data.data;

          this.$emit("analytics", this.analytics);
          this.$emit("list", this.list);
          this.total = response.data.data.users.total;

          setTimeout(() => {
            this.$emit("listLoading", false);

            this.listLoading = false;
          }, 1.5 * 1000);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.listLoading = false;
        });
    },

    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
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

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
<style scoped>
@media screen and (max-width: 576px) {
  .dashboard-editor-container {
    padding: 32px 0 !important;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
}
</style>
