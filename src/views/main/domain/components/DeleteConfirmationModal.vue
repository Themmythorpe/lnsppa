<!-- DeleteConfirmationModal.vue -->
<template>
  <el-dialog
    title="Confirm Delete"
    :visible.sync="deleteModalVisible"
    width="30%"
    @close="handleClose"
  >
    <p>Are you sure you want to delete this user?</p>
    <div class="modal-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleConfirm">Confirm</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    deleteModalVisible: Boolean
  },
  methods: {
    handleCancel() {
      this.$emit('cancel')
    },
    handleConfirm() {
      this.$emit('confirm')
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
