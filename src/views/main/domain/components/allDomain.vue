<!-- eslint-disable vue/valid-template-root -->
<template>
  <div class="">
    <el-table :data="list" style="width: 100%;">
      <el-table-column label="Domain Name" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="TLD" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Transaction Id" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Type" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Registrar" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="DNS1" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="DNS2" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Purchased" width="195" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.price | toThousandFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Date" width="195" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.price | toThousandFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Expiration" width="195" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.price | toThousandFilter }}
        </template>
      </el-table-column>
      <!-- Action column -->
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
    <!-- Include the DeleteConfirmationModal -->
    <delete-confirmation-modal
      :delete-modal-visible.sync="deleteModalVisible"
      @cancel="handleDeleteCancel"
      @confirm="handleDeleteConfirm"
      @close="handleDeleteClose"
    />
    <!-- Pagination -->
    <template>
      <!-- <el-pagination small layout="prev, pager, next" :total="50" /> -->
      <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
    </template>
  </div>
</template>

<script>
import { transactionList, deleteUser } from '@/api/remote-search'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'
export default {
  components: {
    DeleteConfirmationModal
  },
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
    }
  },
  data() {
    return {
      list: null,
      deleteModalVisible: false,
      deletingUser: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then((response) => {
        this.list = response.data.items.slice(0, 8)
      })
    },
    viewUser(user) {
      // Implement the logic to view user details, e.g., navigate to a user profile page
      this.$router.push({ name: 'user-profile', params: { id: user.id }})
    },
    editUser(user) {
      // Implement the logic to edit user details, e.g., navigate to an edit user page
      this.$router.push({ name: 'edit-user', params: { id: user.id }})
    },
    deleteUser(user) {
      const confirmed = confirm(`Are you sure you want to delete user ${user.id}?`)

      if (confirmed) {
        deleteUser(user.id)
          .then(() => {
            // Refresh the user list after successful deletion
            this.fetchData()
          })
          .catch((error) => {
            console.error('Error deleting user:', error)
          })
      }
    },
    // Show the delete confirmation modal
    showDeleteModal(user) {
      this.deletingUser = user
      this.deleteModalVisible = true
    },

    // Handle delete modal cancel
    handleDeleteCancel() {
      this.deleteModalVisible = false
    },

    // Handle delete modal confirm
    handleDeleteConfirm() {
      if (this.deletingUser) {
        deleteUser(this.deletingUser.id)
          .then(() => {
            // Refresh the user list after successful deletion
            this.fetchData()
          })
          .catch((error) => {
            console.error('Error deleting user:', error)
          })
          .finally(() => {
            // Close the delete confirmation modal
            this.deleteModalVisible = false
          })
      }
    },

    // Handle delete modal close
    handleDeleteClose() {
      // Reset the deletingUser when the modal is closed
      this.deletingUser = null
    }

  }
}
</script>
<style scoped>
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}
</style>
