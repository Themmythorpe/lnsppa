<template>
  <div class="container_fluid">
    <div class="w-100 d-flex flex-column justify-content-between align-items-center">
      <div class="w-100">
      <label for="" class="d-block w-100 text-left mb-2">Filter by:</label>
      </div>
      <div class="w-100 filter-container d-flex justify-content-end flex-column flex-md-row align-items-end ml-auto" style="">
        <div class="filter-item-wrap d-sm-flex align-items-center">
      <el-input
        v-model="listQuery.search"
        placeholder="Search"
        style="width: 200px"
        class="filter-item me-2"
        @input="handleFilterChange"
      />
      <!--
        -->
      <el-select
        v-model="listQuery.status"
        placeholder="Select status"
        @change="handleFilterChange"
        clearable
        class="me-md-2 select_dropdown_tld mt-0 pt-0"
        style="transform: translateY(-5px)"
      >
        <el-option label="ACTIVE" value="ACTIVE"></el-option>
        <el-option label="INACTIVE" value="INACTIVE"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.badge"
        placeholder="Select badge"
        @change="handleFilterChange"
        clearable
        class="me-md-2 select_dropdown_tld mt-0 pt-0"
        style="transform: translateY(-5px)"
      >
        <el-option label="HOT" value="HOT"></el-option>
        <el-option label="SALE" value="SALE"></el-option>
        <el-option label="NEW" value="NEW"></el-option>
        <el-option label="SUPERHOT" value="SUPERHOT"></el-option>
        <el-option label="NORMAL" value="NORMAL"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.is_popular"
        placeholder="Select popularity"
        @change="handleFilterChange"
        clearable
        class="me-md-2 select_dropdown_tld mt-0 pt-0"
        style="transform: translateY(-5px)"
      >
        <el-option label="PROMOTED" value="PROMOTED"></el-option>
        <el-option label="NOT PROMOTED" value="NOT PROMOTED"></el-option>
      </el-select>
      <!-- @keyup.enter.native="handleFilter"
        @click="handleFilter"
         -->
      </div>

      <div class="d-flex align-items-center" style="width: fit-content;">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilterChange"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-refresh"
        @click="handleResetFilter"
      />
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-end mb-3 w-100">
      <div style="width: fit-content; margin-left: auto;">
        <el-button
          type="primary"
          class="read_more"
          @click="showBulkTLDModal = true"
          >Upload <span class="d-none d-sm-inline">Bulk TLDs</span></el-button
        >
        <el-button type="primary" class="read_more" @click="createNewTLD()"
          >Create <span class="d-none d-sm-inline">New TLD</span></el-button
        >
      </div>
    </div>
    </div>

    <div class="table_wrap py-2">
      <el-table
        v-loading="loader"
        border=""
        style="width: 100%; min-width: 45em"
        :data="TLDLists"
        highlight-current-row
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="totalTLDs"
      >
        <!-- @row-click="" -->
        <el-table-column label="TLD ID" prop="tld_id" />
        <el-table-column label="Name" prop="name">
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              .{{ scope.row["name"] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Badge" prop="badge">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.badge !== null" class="position-relative">
              {{ scope.row["badge"] }}
            </el-tag>
            <span v-else>NIL</span>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="Date">
          <template slot-scope="scope">
            <span class="py-3 d-block position-relative">
              {{ formatDate(scope.row["created_at"]) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Action" width="195" align="center">
          <template slot-scope="scope">
            <!-- <el-button-group> -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editTLD(scope.row)"
              >Edit</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteTLD(scope.row)"
              >Delete</el-button
            >
            <!-- </el-button-group> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pagination -->
    <div class="mt-4" style="width: fit-content; margin-left: auto">
      <el-pagination
        small
        layout="prev, pager, next"
        :total="totalTLDs"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        @current-change="handlePageChange"
      />
    </div>

    <div>
      <el-dialog
        title="Confirm Delete"
        :visible.sync="showDeleteModal"
        width="30%"
        @close="handleClose"
      >
        <p>Are you sure you want to delete this TLD?</p>
        <div class="modal-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button
            type="danger"
            :loading="deleteloading"
            @click="handleDeleteConfirm"
            >Confirm</el-button
          >
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        :title="`${ModalTitle}`"
        :visible.sync="showTLDModal"
        width="40%"
        class="pb-0 mb-0"
        @close="handleClose"
      >
        <el-form ref="createTLDForm" :model="createTLD">
          <el-row :gutter="20" class="mb-0 pb-0">
            <el-form-item>
              <el-col>
                <label for="title">TLD Name</label>
                <el-input
                  id="title"
                  v-model.trim="createTLD.name"
                  placeholder=".com, .africa, .ai, .dev e.t.c"
                />
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col>
                <label for="title">Badge</label>
                <el-select
                  id="badges"
                  v-model="createTLD.badge"
                  placeholder="Select badge"
                  class="w-100"
                >
                  <el-option
                    v-for="bdg in badges"
                    :key="bdg.badge"
                    :label="bdg.badge"
                    :value="bdg.badge"
                  />
                </el-select>
                <!-- <el-input
                  id="title"
                  v-model.trim="createTLD.badge"
                  placeholder="HOT"
                /> -->
              </el-col>
            </el-form-item>

            <el-form-item class="mb-0 pb-0">
              <el-col>
                <div class="" style="width: fit-content; margin-left: auto">
                  <el-button @click="handleClose">Cancel</el-button>

                  <el-button
                    v-if="ModalTitle === 'Create New TLD'"
                    :loading="loading"
                    type="primary"
                    style="background-color: #42b983 !important; border: none"
                    @click.native.prevent="handleCreateTLD"
                    >Create</el-button
                  >
                  <el-button
                    v-if="ModalTitle === 'Edit TLD Details'"
                    :loading="loading"
                    type="primary"
                    style="background-color: #42b983 !important; border: none"
                    @click.native.prevent="handleUpdateTLD"
                    >Update</el-button
                  >
                </div>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        title="Upload Bulk TLDs"
        :visible.sync="showBulkTLDModal"
        width="26em"
        class="pb-0 mb-0"
        @close="handleClose"
      >
        <el-form >
          <el-row :gutter="20" class="my-0 py-0">
            <el-form-item class="mt-0 pt-0">
              <el-col>
                <label for="title">Select CSV File</label>
                <div
                  class="drop_zone my-2"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <input
                    type="file"
                    @change="handleFileChange"
                    accept=".csv"
                    class="d-none"
                    ref="fileInput"
                  />
                  <div v-if="selectedFile" class="change_csv_container d-flex">
                    <div class="change_csv_wrap btn border p-0">
                      <span class="position-absolute" style="font-size: 12px"
                        >Change</span
                      >
                      <input
                        type="file"
                        @change="handleFileChange"
                        accept=".csv"
                        class="change_csv"
                      />
                    </div>

                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="handleReset"
                    />
                  </div>
                  <div
                    v-else
                    class="upload-placeholder"
                    @click="triggerFileInput"
                  >
                    <div class="mx-auto" style="width: fit-content">
                      <svg
                        width="46"
                        height="46"
                        viewBox="0 0 46 46"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="40"
                          height="40"
                          rx="20"
                          fill="#F2F4F7"
                        />
                        <rect
                          x="3"
                          y="3"
                          width="40"
                          height="40"
                          rx="20"
                          stroke="#F9FAFB"
                          stroke-width="6"
                        />
                        <g clip-path="url(#clip0_1729_11206)">
                          <path
                            d="M26.3333 26.3332L23 22.9999M23 22.9999L19.6666 26.3332M23 22.9999V30.4999M29.9916 28.3249C30.8044 27.8818 31.4465 27.1806 31.8165 26.3321C32.1866 25.4835 32.2635 24.5359 32.0351 23.6388C31.8068 22.7417 31.2862 21.9462 30.5555 21.3778C29.8248 20.8094 28.9257 20.5005 28 20.4999H26.95C26.6977 19.5243 26.2276 18.6185 25.5749 17.8507C24.9222 17.0829 24.104 16.4731 23.1817 16.0671C22.2594 15.661 21.2571 15.4694 20.2501 15.5065C19.243 15.5436 18.2575 15.8085 17.3676 16.2813C16.4777 16.7541 15.7066 17.4225 15.1122 18.2362C14.5177 19.05 14.1155 19.9879 13.9358 20.9794C13.756 21.9709 13.8034 22.9903 14.0743 23.961C14.3452 24.9316 14.8327 25.8281 15.5 26.5832"
                            stroke="#475467"
                            stroke-width="1.66667"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1729_11206">
                            <rect
                              width="20"
                              height="20"
                              fill="white"
                              transform="translate(13 13)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <p class="mb-1">
                      <span class="text-primary">Click to upload</span> or drag
                      and drop
                    </p>
                    <p class="mb-1">CSV file only</p>
                    <p v-if="errorMessage" class="text-danger fs-12">
                      {{ errorMessage }}
                    </p>
                  </div>
                  <div v-if="fileContent" class="file_preview">
                    <table class="table" style="min-width: 40em">
                      <thead>
                        <tr>
                          <th
                            v-for="(header, index) in fileContent
                              .split('\n')[0]
                              .split(',')"
                            :key="index"
                          >
                            {{ header.trim().replace(/"/g, "") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(row, index) in fileContent
                            .split('\n')
                            .slice(1)"
                          :key="index"
                        >
                          <td
                            v-for="(cell, index) in row.split(',')"
                            :key="index"
                          >
                            {{ cell.trim().replace(/"/g, "") }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </el-col>
            </el-form-item>
          </el-row>
           <el-form-item class="mb-0 pb-0">
              <el-col>
                <div class="" style="width: fit-content; margin-left: auto">
                  <el-button @click="handleClose">Cancel</el-button>
            <el-button type="primary"
                    :loading="loading"
             @click="handleUpload">Upload</el-button>
             </div>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  components: { Pagination },
  data() {
    return {
      TLDLists: [],
      loader: true,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      deleteloading: false,
      totalTLDs: 0,
      entrySelect: "",
      showDeleteModal: false,
      showTLDModal: false,
      showBulkTLDModal: false,
      selectedFile: null,
      fileContent: "",
      errorMessage: "",
      TLDId: "",
      ModalTitle: "",
      createTLD: {
        name: "",
        tld_id: "",
        badge: "",
      },
      listQuery: {
        page: 1,
        search: "",
        badge: "",
        status: "",
        is_popular: "",
        tld_id: "",
      },
      badges: [
        {
          badge: "HOT",
        },
        {
          badge: "SUPERHOT",
        },
          {
            badge: "SALE",
          },
        {
          badge: "NEW",
        },
        {
          badge: "NORMAL",
        }
      ],
    };
  },
  mounted() {
    this.fetchTLDList();
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "text/csv") {
        this.selectedFile = file;
        this.errorMessage = "";
        this.readFileContent(file);
      } else {
        this.selectedFile = null;
        this.fileContent = "";
        this.errorMessage = "Please select a CSV file only.";
      }
    },
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type === "text/csv") {
        this.selectedFile = file;
        this.errorMessage = "";
        this.readFileContent(file);
      } else {
        this.selectedFile = null;
        this.fileContent = "";
        this.errorMessage = "Please select a CSV file only.";
      }
    },
    readFileContent(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result;
      };
      reader.readAsText(file);
    },
    handleReset() {
      this.selectedFile = null;
      this.fileContent = "";
      this.errorMessage = "";
    },
    handleUpload() {
      if (this.selectedFile) {
        // console.log("this.selectedFile:", this.selectedFile);
        const formData = new FormData();
        formData.append("excel_file", this.selectedFile);

        this.loading = true;
        axios
          .post(this.dynamic_base_url(`admin/domains/tld/doc`), formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + getToken(),
            },
          })
          .then((response) => {
            if (response.data.status === true) {
              this.$message.success(response.data.message);
              this.handleClose();
              this.fetchTLDList();
            } else {
              this.$message.error("File upload failed");
            }
            this.loading = false;
          })
          .catch((error) => {
            this.$message.error("Error uploading file. Please try again.");
            this.loading = false;
          });
      } else {
        this.$message.error("No file selected.");
      }
    },

    handleUpdateTLD() {
      const payload = {
        name: this.createTLD.name.toLowerCase(),
        tld_id: this.createTLD.tld_id,
        badge: this.createTLD.badge.toUpperCase(),
      };

      // console.log("payload :", payload);
      this.loading = true;
      axios
        .put(this.dynamic_base_url(`admin/domains/tld`), payload, {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          this.$message.success(response.data.message);
          this.loading = false;
          this.createTLD.tld_id = "";
          this.createTLD.name = "";
          this.createTLD.badge = "";
          this.showTLDModal = false;
          this.fetchTLDList();
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            console.error("Error during TLD update:", error);
            this.$message.error("An error occurred during TLD update.");
          }
          this.loading = false;
        });
    },

    handleCreateTLD() {
      this.loading = true;

      // const formattedDate = this.createTLD.date
      //   .toLocaleDateString('en-GB', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric'
      //   })
      //   .split('/')
      //   .join('-')

      const payload = {
        name: this.createTLD.name.toLowerCase(),
        badge: this.createTLD.badge.toUpperCase(),
      };

      axios
        .post(this.dynamic_base_url(`admin/domains/tld`), payload, {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          this.$message.success(response.data.message);
          this.loading = false;
          this.createTLD.tld_id = "";
          this.createTLD.name = "";
          this.createTLD.badge = "";
          this.showTLDModal = false;
          this.fetchTLDList();
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            console.error("Error during TLD update:", error);
            this.$message.error("An error occurred during TLD update.");
          }
          this.loading = false;
        });
    },

    handleFilterChange() {
      this.fetchTLDList();
    },

    handleResetFilter() {
      this.listQuery = {
        search: "",
        badge: "",
        status: "",
        is_popular: "",
        tld_id: "",
      };
      this.fetchTLDList();
    },

    fetchTLDList() {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize > 0 ? this.pageSize : "",
        ...this.listQuery,
      };

      this.loader = true;
      axios
        .get(this.dynamic_base_url("admin/domains/tld"), {
          params,
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          if (response.data.success) {
            this.totalTLDs = response.data.data.length;
            const startIdx = (this.currentPage - 1) * this.pageSize;
            const endIdx = startIdx + this.pageSize;
            this.TLDLists = response.data.data.slice(startIdx, endIdx);
          } else {
            console.error("Failed to fetch TLD data");
          }
          this.loader = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error fetching TLD data. Please try again later."
            );
          }
          this.loader = false;
        });
    },

    editTLD(row) {
      // console.log("Selected tld to be viewed:", row);
      this.ModalTitle = "Edit TLD Details";
      this.showTLDModal = true;
      this.createTLD.tld_id = row.tld_id;
      this.createTLD.name = row.name;
      this.createTLD.badge = row.badge;
    },
    deleteTLD(val) {
      this.showDeleteModal = true;
      this.TLDId = val.tld_id;
    },
    createNewTLD() {
      this.showTLDModal = true;
      this.ModalTitle = "Create New TLD";
    },
    handleClose() {
      this.showDeleteModal = false;
      this.createTLD.tld_id = "";
      this.createTLD.name = "";
      this.createTLD.badge = "";
      this.showTLDModal = false;
      this.showBulkTLDModal = false;
      this.handleReset();
      this.TLDId = "";
    },
    handleDeleteConfirm() {
      const id = {
        tld_id: this.TLDId,
      };
      this.deleteloading = true;
      axios
        .delete(this.dynamic_base_url(`admin/domains/tld/${this.TLDId}`), {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        })
        .then((response) => {
          this.$message.success(response.data.message);
          this.deleteloading = false;
          this.showDeleteModal = false;
          this.fetchTLDList();
        })
        .catch((error) => {
          const errorRes = error.response.data;
          this.$message.error(errorRes.message);

          // if (errorRes.status >= 400 || errorRes.status === false) {
          //   this.$message.error(errorRes.message);
          // } else {
          //   console.error("Error during TLD update:", error);
          //   this.$message.error("An error occurred during TLD update.");
          // }
          this.deleteloading = false;
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchTLDList();
    },
    formatDate(dateString) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", options);
    },
  },
};
</script>

<style scoped>
.example-pagination-block + .example-pagination-block {
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

/* DropZone Styles */

.drop_zone {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 12em;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px !important;
  overflow: hidden;
  /* cursor: pointer; */
  background: rgba(234, 236, 240, 0.5);
}
.drop_zone * {
  cursor: pointer;
}

.drop_zone p {
  text-align: center;
  color: #667085;
}

.drop_zone p span {
  font-weight: 500;
  font-size: 14px !important;
}

.drop_zone input {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  outline: none;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
}

.change_csv_container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.change_csv_container button {
  /* background: rgba(234, 236, 240, 1) !important; */
  width: 50px;
  height: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
  z-index: 10;
}

.change_csv_container button i {
  line-height: 0;
  position: absolute;
  font-size: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.change_csv_wrap {
  border: 2px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(234, 236, 240, 1) !important;
}

.drop_zone .change_csv,
.imgDrop_zone .change_csv {
  position: relative;
  width: 70px;
  height: 30px;
  background: rgba(234, 236, 240, 1) !important;
}
.file_preview > div {
  overflow: scroll !important;
}

.file_preview {
  width: 100%;
  overflow: auto;
  max-width: 100%;
  max-height: 15em;
  /* margin: auto; */
  /* text-align: center; */
  /* display: -webkit-box; */
  /* -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; */
  font-size: 12px;
  color: #6e798a !important;
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  /* line-height: 2; */
}
.file_preview th,
.file_preview td {
  white-space: nowrap;
}

@media screen and (max-width: 576px) {
  .filter-item,
  .filter-item-wrap,
  .select_dropdown_tld {
    margin-bottom: 6px !important;
    width: 100% !important;
  }
  .filter-item {
    margin-bottom: 12px !important;
  }
}
</style>
