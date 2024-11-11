<template>
  <div class="container-fluid">
    <el-card class="box-card">
      <h1>Announcements</h1>
      <div class="d-flex justify-content-between align-items-end mb-3">
        <div class="d-sm-flex justify-content-start align-items-center" style="gap: 10px !important; min-width: 10em">
          <!-- <label for="" class="d-block">View</label>

          <el-select id="" v-model="entrySelect" placeholder="Select..." class="w-100">
            <el-option label="All Entries" selected value="all-entries" />
            <el-option label="Shuffled" value="shuffled" />
          </el-select> -->
        </div>
        <div>
          <el-button type="primary" class="read_more" @click="createAnnouncement()">Create
            <span class="d-none d-sm-inline">Announcement</span></el-button>
        </div>
      </div>

      <div class="table_wrap py-2">
        <el-table v-loading="loader" border="" style="width: 100%; min-width: 80em;" :data="announcements"
          highlight-current-row :current-page.sync="currentPage" :page-size="pageSize" :total="totalAnnouncements">
          <!-- @row-click="" -->
          <el-table-column label="Department" prop="DomainNameID" />
          <el-table-column label="Subject" prop="sld">
            <template slot-scope="scope">
              <div>
                <p class="text-primary mb-1">
                  #{{ scope.row["DomainNameID"] }}
                </p>
                <p class="mb-0">{{ scope.row["sld"] }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Status" prop="ns-status">
            <template slot-scope="scope">
              <span class="status_span"><i class="bi bi-dot dot_icon" />{{
                scope.row["ns-status"]
                }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Last Updated" prop="expiration-date" />

          <el-table-column label="Action" width="195" align="center">
            <template slot-scope="scope">
              <!-- <el-button-group> -->
              <el-button type="primary" icon="el-icon-view" size="small"
                @click="viewAnnouncement(scope.row)">View</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small"
                @click="deleteAnnouncement(scope.row)">Delete</el-button>
              <!-- </el-button-group> -->
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination -->
      <div class="mt-4" style="width: fit-content; margin-left: auto">
        <el-pagination small layout="prev, pager, next" :total="totalAnnouncements" :current-page.sync="currentPage"
          :page-size.sync="pageSize" @current-change="handlePageChange" />
      </div>
    </el-card>

    <div>
      <el-dialog title="Confirm Delete" :visible.sync="showDeleteModal" width="30%" @close="handleClose">
        <p>Are you sure you want to delete this Announcement?</p>
        <div class="modal-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="danger" @click="handleDeleteConfirm">Confirm</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog title="Create New Announcement" :visible.sync="showCreateModal" width="40%" class="pb-0 mb-0"
        @close="handleClose">
        <el-form ref="createAnnForm" :model="createAnn">
          <el-row :gutter="20" class="mb-0 pb-0">
            <el-form-item>
              <el-col :span="12">
                <label for="title">Title</label>
                <el-input id="title" v-model.trim="createAnn.title" class="col-12" />
              </el-col>
              <el-col :span="12">
                <label for="dept">Department</label>
                <el-input id="dept" v-model.trim="createAnn.dept" />
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="description">Description</label>
                <textarea v-model.trim="createAnn.description" class="h-50 form-control" rows="4" />
                <!-- <el-input
                  id="description"
                  v-model.trim="createAnn.description"
                /> -->
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col :span="12">
                <label for="subject">Subject</label>
                <el-input id="subject" v-model.trim="createAnn.subject" />
              </el-col>
              <el-col :span="12">
                <label for="status">Status</label>
                <el-select id="status" v-model="createAnn.status" placeholder="Status..." class="d-block w-100">
                  <el-option label="Active" selected value="active" />
                  <el-option label="Inactive" value="inactive" />
                  <!-- Add more options as needed -->
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="date">Date</label>
                <el-date-picker id="date" v-model="createAnn.date" type="date" format="dd-MM-yyyy"
                  placeholder="Select Date" class="col-12 d-block w-100" />
              </el-col>
            </el-form-item>

            <el-form-item class="mb-0 pb-0">
              <el-col>
                <div class="" style="width: fit-content; margin-left: auto">
                  <el-button @click="handleClose">Cancel</el-button>
                  <el-button :loading="loading" type="primary"
                    style="background-color: #42b983 !important; border: none"
                    @click.native.prevent="handleSubmit">Create</el-button>
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
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import axios from 'axios'
  import { getToken } from '@/utils/auth'

  export default {
    components: { Pagination },
    data() {
      return {
        announcements: [],
        loader: true,
        currentPage: 1,
        pageSize: 10,
        loading: false,
        totalAnnouncements: 0,
        entrySelect: '',
        showDeleteModal: false,
        showCreateModal: false,
        AnnId: '',
        createAnn: {
          title: '',
          description: '',
          dept: '',
          subject: '',
          status: '',
          date: ''
        }
      }
    },
    mounted() {
      this.fetchAnnouncements()
    },
    methods: {
      handleSubmit() {
        this.loading = true

        const formattedDate = this.createAnn.date
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          .split('/')
          .join('-')

        const payload = {
          title: this.createAnn.title,
          description: this.createAnn.description,
          dept: this.createAnn.dept,
          subject: this.createAnn.subject,
          status: this.createAnn.status,
          date: formattedDate
        }

        setTimeout(() => {
          this.loading = false
        }, 1000)
      },

      fetchAnnouncements() {
        this.loader = true
        axios
          .get(this.dynamic_base_url('admin/enom/domains'), {
            headers: { Authorization: 'Bearer ' + getToken() }
          })
          .then((response) => {
            if (response.data.success) {
              this.totalAnnouncements = response.data.data.length
              const startIdx = (this.currentPage - 1) * this.pageSize
              const endIdx = startIdx + this.pageSize
              this.announcements = response.data.data.slice(startIdx, endIdx)
            } else {
              console.error('Failed to fetch announcement data')
            }
            this.loader = false
          })
          .catch((error) => {
            const errorRes = error.response.data
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message)
            } else {
              this.$message.error(
                'Error fetching announcement data. Please try again later.'
              )
            }
            this.loader = false
          })
      },

      viewAnnouncement(row) {
        this.$router.push({
          name: 'view-announcement-cat',
          params: { id: row.DomainNameID }
        })
      },
      deleteAnnouncement(val) {
        this.showDeleteModal = true
        this.AnnId = val.DomainNameID
      },
      createAnnouncement() {
        this.showCreateModal = true
      },
      handleClose() {
        this.showDeleteModal = false
        this.showCreateModal = false
        this.AnnId = ''
      },
      handleDeleteConfirm() {
        // console.log('Assigned ID :', this.AnnId)
      },
      handlePageChange(page) {
        this.currentPage = page
        this.fetchAnnouncements()
      }
    }
  }
</script>

<style scoped>
  .example-pagination-block+.example-pagination-block {
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
</style>
