<template>
  <div class="app-container px-0">

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="Account Id" prop="id" sortable="custom" align="center" width="120px" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column> -->
      <el-table-column label="Domain Name" min-width="200">
        <template>
          example.ng.com
        </template>
      </el-table-column>
      <el-table-column label="TLD" min-width="200">
        <template>
          TLD
        </template>
      </el-table-column>
      <el-table-column label="Transaction Id" min-width="200">
        <template>
          New Value
        </template>
      </el-table-column>
      <el-table-column label="Type" min-width="200">
        <template>
          New Value
        </template>
      </el-table-column>
      <el-table-column label="Registrar" min-width="200">
        <template>
          New Value
        </template>
      </el-table-column>
      <el-table-column label="DNS1" min-width="200">
        <template>
          New Value
        </template>
      </el-table-column>
      <el-table-column label="DNS2" min-width="200">
        <template>
          New Value
        </template>
      </el-table-column>
      <el-table-column label="Purchased" width="195" align="center">
        <template>
          Purchase
        </template>
      </el-table-column>
      <el-table-column label="Date" width="195" align="center">
        <template>
          2000-05-21 22:43
        </template>
      </el-table-column>
      <el-table-column label="Expiration" width="195" align="center">
        <template>
          2000-05-24 22:43
        </template>
      </el-table-column>
      <!-- <el-table-column label="Status" class-name="status-col" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column> -->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" style="width: 100%; padding:0 30px;">
        <!-- <el-form-item>
              <el-col :span="12">
                <label for="Type">Type</label>
                <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                  <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                </el-select>
              </el-col>
              <el-col :span="12">
                <label for="first_name">Address</label>
                <textarea class="h-50 form-control" />
              </el-col>

            </el-form-item> -->
        <el-form-item>

          <el-col :span="12">
            <el-form-item class="col-12">
              <label for="Date" prop="timestamp">Date</label><br>
              <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Full Name" prop="title">
              <el-input v-model="temp.fullName" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="first_name">Address</label>
            <textarea v-model="temp.address" class="h-50 form-control" />
          </el-col>
          <el-col :span="12">
            <label for="first_name">Address 2 (Optional)</label>
            <textarea v-model="temp.address2" class="h-50 form-control" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="12">
            <label for="first_name">Where did you hear about us</label>
            <textarea class="h-50 form-control" />
          </el-col>
          <el-col :span="12">
            <label for="first_name">Receive Mail</label>
            <textarea class="h-50 form-control" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="is_login">Is Login</label>
            <el-input v-model="temp.isLogin" class="col-12" />
          </el-col>
          <el-col :span="12">
            <label for="role">Role</label>
            <el-input v-model="temp.role" class="col-12" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="8">
            <label for="city">City</label>
            <el-input v-model="temp.city" />
          </el-col>
          <el-col :span="8">
            <label for="state">State</label>
            <el-input v-model="temp.state" class="col-4" />
          </el-col>
          <el-col :span="8">
            <label for="country">Country</label>
            <el-input v-model="temp.country" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="postcode">Postcode</label>
            <el-input v-model="temp.postCode" />
          </el-col>
          <el-col :span="12">
            <label for="customer_cat">Category</label>
            <el-input v-model="temp.category" class="col-4" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="currency">Currency</label>
            <el-input v-model="temp.currency" class="col-12" />
          </el-col>
          <el-col :span="12">
            <label for="status">Status</label><br>
            <el-select v-model="temp.status" class="filter-item" placeholder="Please select" style="width: 100%;">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="Title" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
            <el-form-item label="Imp">
              <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
            </el-form-item>
            <el-form-item label="Remark">
              <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
            </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '../../../../api/article'
import waves from '../../waves' // waves directive
import { parseTime } from '../../../../utils'
import Pagination from '../../pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'AllExpireTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        fullName: '',
        address: '',
        address2: '',
        isLogin: '',
        role: '',
        city: '',
        state: '',
        country: '',
        postCode: '',
        category: '',
        currency: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
