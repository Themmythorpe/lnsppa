<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order_No" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    },
    toThousandFilter(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // Mock data for demonstration purposes
      this.list = [
        { order_no: '123456789012345678901234567890', price: 1000, status: 'success' },
        { order_no: '223456789012345678901234567890', price: 2000, status: 'pending' },
        { order_no: '323456789012345678901234567890', price: 1500, status: 'success' },
        { order_no: '423456789012345678901234567890', price: 2500, status: 'pending' },
        { order_no: '523456789012345678901234567890', price: 3000, status: 'success' },
        { order_no: '623456789012345678901234567890', price: 3500, status: 'pending' },
        { order_no: '723456789012345678901234567890', price: 4000, status: 'success' },
        { order_no: '823456789012345678901234567890', price: 4500, status: 'pending' }
      ];

      //       transactionList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      // })
    }
  }
}
</script>
