<template>
  <div class="app-container">
    <div class="filter-container d-flex justify-content-end flex-column flex-md-row align-items-end ml-auto" style="">
      <div class="d-flex align-items-center">
      <el-input
        v-model="listQuery.search"
        placeholder="Search"
        style="width: 200px"
        class="filter-item me-2"
      />
        <!-- @input="handleFilterChange"
        @change="handleFilterChange"
        -->
      <el-select
        v-model="listQuery.status"
        placeholder="Select status"
        clearable
        class="me-md-2 mt-0 pt-0"
        style="transform: translateY(-5px)"
      >
        <el-option label="Active" value="ACTIVE"></el-option>
        <el-option label="Pending" value="PENDING"></el-option>
        <el-option label="Inactive" value="INACTIVE"></el-option>
      </el-select>
      </div>

      <!-- @keyup.enter.native="handleFilter"
        @click="handleFilter"
         -->
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
        icon="el-icon-plus"
        @click="showCreateAccountDialog"
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

    <el-table
      :key="tableKey"
      v-loading="isCstmrListLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="totalDomains"
    >
      <el-table-column label="Account Id" align="center" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.account_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Full Name" min-width="200">
        <template slot-scope="{ row }">
          <span>{{ row.first_name }} {{ row.last_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" min-width="200">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.email }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="Phone Number" min-width="200">
        <template slot-scope="{ row }">
          <span>{{ row.phone_code }} {{ row.phone_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="showEditDialog(row)">
            Edit
          </el-button>
          <!-- <el-button size="mini" type="success">
            View
          </el-button> -->
          <!-- <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-button size="mini" type="danger" @click="showDeleteDialog(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4" style="width: fit-content; margin-left: auto">
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

    <!--  :title="textMap[dialogCreateStatus]" -->
    <el-dialog :visible.sync="showCreateAccountModal" @close="handleClose">
      <el-form
        ref="accountForm"
        style="width: 100%; padding: 0 10px"
        @submit.prevent="createAccountForm"
        v-loading="createLoader"
      >
        <el-form-item>
          <el-col :span="12">
            <el-form-item label="First Name">
              <el-input ref="firstNameInput" v-model="first_name" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Last Name">
              <el-input v-model="last_name" type="text" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="street_address">Address</label>
            <textarea
              v-model="street_address"
              type="text"
              class="h-50 form-control"
            />
          </el-col>
          <el-col :span="12">
            <label for="street_address2">Address 2 (Optional)</label>
            <textarea
              v-model="street_address2"
              type="text"
              class="h-50 form-control"
            />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="12">
            <label for="first_name">Where did you hear about us</label>
            <textarea
              v-model="where_did_you_hear_about_us"
              type="text"
              class="h-50 form-control"
            />
          </el-col>
          <el-col :span="12">
            <label for="receive_mails">Receive Mail</label><br />
            <el-select
              id="receive_mails"
              v-model="receive_mails"
              placeholder="Receive Mails"
              class="col-12"
            >
              <el-option label="YES" selected value="YES" />
              <el-option label="NO" value="NO" />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="is_login">Is Login</label><br />
            <el-select
              id="role"
              v-model="is_login"
              placeholder=""
              class="col-12"
            >
              <el-option label="YES" selected value="YES" />
              <el-option label="NO" value="NO" />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
          <el-col :span="12">
            <label for="role">Role</label><br />
            <el-select
              id="is_login"
              v-model="role"
              placeholder="role"
              class="col-12"
            >
              <el-option label="admin" selected value="admin" />
              <el-option label="client" value="client" />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="8">
            <label for="city">City</label>
            <el-input v-model="city" type="text" />
          </el-col>
          <el-col :span="8">
            <label for="state">State</label>
            <el-input v-model="state" type="text" class="col-4" />
          </el-col>
          <el-col :span="8">
            <label for="country">Country</label>
            <el-select v-model="country" placeholder="Country">
              <el-option
                v-for="(country_name, key) in countryWithCode"
                :key="key"
                :label="country_name.name"
                :value="country_name.name"
              />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="postcode">Postcode</label>
            <el-input id="postcode" v-model="postcode" type="number" />
          </el-col>
          <el-col :span="12">
            <label for="customer_cat">Customer Category</label>
            <el-input v-model="customer_cat" type="text" class="col-4" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="currency">Currency</label><br />
            <el-select v-model="currency" placeholder="Currency" class="col-6">
              <el-option
                v-for="(current, key) in chooseCurrency"
                :key="key"
                :label="current.name"
                :value="current.currency"
              />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
          <el-col :span="12">
            <label for="status">Status</label><br />
            <el-select
              v-model="status"
              class="filter-item"
              placeholder="Please select"
              style="width: 100%"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="email">Email</label>
            <el-input v-model="email" type="email" class="col-12" />
          </el-col>

          <el-col :span="12">
            <label for="phone_number">Phone Number</label><br />
            <el-input
              v-model="phone_number"
              :sm="12"
              :md="8"
              :lg="8"
              placeholder="Enter phone number"
            >
              <template slot="prepend">
                <el-select
                  v-model="phone_code"
                  placeholder="Code"
                  class="phone-code"
                >
                  <el-option
                    v-for="(code, key) in countryWithCode"
                    :key="key"
                    :label="code.dial_code"
                    :value="code.dial_code"
                  />
                  <!-- Add more options as needed -->
                </el-select>
              </template>
            </el-input>
          </el-col>

          <el-col :span="12">
            <!-- <label for="share_personal_data">Share Personal data</label> -->
            <div class="checkbox-container">
              <input
                id="myCheckbox"
                v-model="share_personal_data"
                type="checkbox"
              />
              <label for="myCheckbox">Consent to share personal data *</label>
            </div>
            <!-- Use a hidden input to store the value as 'YES' or 'NO' -->
            <input
              v-model="share_personal_data"
              type="hidden"
              name="share_personal_data"
            />
          </el-col>
          <el-col :span="12">
            <label for="security_questions">Security Questions</label>
            <textarea
              v-model="security_questions"
              type="text"
              class="h-50 form-control"
            />
          </el-col>
          <el-col :span="12">
            <label for="security_answer">Security Answer</label>
            <textarea
              v-model="security_answer"
              type="text"
              class="h-50 form-control col-12"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="password">Password</label>
            <el-input v-model="password" type="password" class="col-12" />
          </el-col>
          <el-col :span="12">
            <label for="password_confirmation">Password Confirmation</label>
            <el-input
              v-model="password_confirmation"
              type="password"
              class="col-12"
            />
          </el-col>
        </el-form-item>
        <el-form-item class="mx-2">
          <el-button type="primary" @click="createAccountForm"
            >Confirm</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="Edit Account"
      :visible.sync="showEditModal"
      @close="resetEditForm"
    >
      <el-form
        v-if="editedItem"
        ref="editAccountForm"
        style="width: 100%; padding: 0 30px"
        :model="editedItem"
        v-loading="editLoader"
      >
        <el-form-item>
          <el-col :span="12">
            <el-form-item label="First Name">
              <el-input v-model="editedItem.first_name" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Last Name">
              <el-input v-model="editedItem.last_name" type="text" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="street_address">Address</label>
            <textarea
              v-model="editedItem.street_address"
              type="text"
              class="h-50 form-control"
            />
          </el-col>
          <el-col :span="12">
            <label for="street_address2">Address 2 (Optional)</label>
            <textarea
              v-model="editedItem.street_address2"
              type="text"
              class="h-50 form-control"
            />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="12">
            <label for="first_name">Where did you hear about us</label>
            <textarea
              v-model="editedItem.where_did_you_hear_about_us"
              type="text"
              class="h-50 form-control"
            />
          </el-col>
          <el-col :span="12">
            <label for="company_name">Company Name</label>
            <textarea
              v-model="company_name"
              type="text"
              class="h-50 form-control col-12"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="is_login">Is Login</label><br />
            <el-select
              id="role"
              v-model="editedItem.is_login"
              placeholder=""
              class="col-12"
            >
              <el-option label="YES" selected value="YES" />
              <el-option label="NO" value="NO" />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
          <el-col :span="12">
            <label for="role">Role</label><br />
            <el-select
              id="is_login"
              v-model="editedItem.role"
              placeholder="role"
              class="col-12"
            >
              <el-option label="admin" selected value="admin" />
              <el-option label="client" value="client" />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="8">
            <label for="city">City</label>
            <el-input v-model="editedItem.city" type="text" />
          </el-col>
          <el-col :span="8">
            <label for="state">State</label>
            <el-input v-model="editedItem.state" type="text" class="col-4" />
          </el-col>
          <el-col :span="8">
            <label for="country">Country</label>
            <el-select v-model="editedItem.country" placeholder="Country">
              <el-option
                v-for="(country_name, key) in countryWithCode"
                :key="key"
                :label="country_name.name"
                :value="country_name.name"
              />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="postcode">Postcode</label>
            <el-input v-model="editedItem.postcode" type="number" />
          </el-col>
          <el-col :span="12">
            <label for="customer_cat">Customer Category</label>
            <el-input
              v-model="editedItem.customer_cat"
              type="text"
              class="col-4"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="currency">Currency</label><br />
            <el-select v-model="editedItem.currency" placeholder="Currency">
              <el-option
                v-for="(current, key) in chooseCurrency"
                :key="key"
                :label="current.name"
                :value="current.currency"
              />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
          <el-col :span="12">
            <label for="status">Status</label><br />
            <el-select
              v-model="editedItem.status"
              class="filter-item"
              placeholder="Please select"
              style="width: 100%"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="email">Email</label>
            <el-input v-model="editedItem.email" type="email" class="col-12" />
          </el-col>
          <el-col :span="12">
            <label for="phone_number">Phone Number</label><br />
            <el-input
              v-model="editedItem.phone_number"
              :sm="12"
              :md="8"
              :lg="8"
              placeholder="Enter phone number"
            >
              <template slot="prepend">
                <el-select
                  v-model="editedItem.phone_code"
                  placeholder="Code"
                  class="phone-code"
                >
                  <el-option
                    v-for="(code, key) in countryWithCode"
                    :key="key"
                    :label="code.dial_code"
                    :value="code.dial_code"
                  />
                  <!-- Add more options as needed -->
                </el-select>
              </template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="security_questions">Security Questions</label>
            <textarea
              v-model="editedItem.security_questions"
              type="text"
              class="h-50 form-control col-12"
            />
          </el-col>
          <el-col :span="12">
            <label for="security_answer">Security Answer</label>
            <textarea
              v-model="editedItem.security_answer"
              type="text"
              class="h-50 form-control col-12"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="company_name">Company Name</label>
            <el-input
              v-model="editedItem.company_name"
              type="text"
              class="col-12"
            />
          </el-col>
          <el-col :span="12">
            <label for="password">Password</label>
            <el-input
              v-model="editedItem.password"
              type="password"
              class="col-12"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <label for="password_confirmation">Password Confirmation</label>
            <el-input
              v-model="editedItem.password_confirmation"
              type="password"
              class="col-12"
            />
          </el-col>
          <!-- <el-col :span="12">
            <div class="checkbox-container">
              <input
                id="myCheckbox"
                v-model="editedItem.share_personal_data"
                type="checkbox"
              />
              <label for="myCheckbox">Consent to share personal data *</label>
            </div>
            <input
              v-model="editedItem.share_personal_data"
              type="hidden"
              name="share_personal_data"
            />
          </el-col> -->
          <el-col :span="12">
            <label for="receive_mails">Receive Mail</label><br />
            <el-select
              id="receive_mails"
              v-model="editedItem.receive_mails"
              placeholder="Receive Mails"
              class="col-12"
            >
              <el-option label="YES" selected value="YES" />
              <el-option label="NO" value="NO" />
              <!-- Add more options as needed -->
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item class="mx-2">
          <el-button type="primary" @click="updateAccountForm"
            >Update Account</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <div>
      <el-dialog
        title="Confirm Delete"
        :visible.sync="showDeleteModal"
        width="30%"
        @close="handleClose"
      >
        <p>Are you sure you want to delete this user?</p>
        <div class="modal-footer">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="handleDeleteConfirm"
            >Confirm</el-button
          >
        </div>
      </el-dialog>
    </div>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import waves from "../../waves"; // waves directive
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import countryWithCode from "../../mixin/country_with_code";
import chooseCurrency from "../../mixin/choose_currency";

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        ACTIVE: "success",
        INACTIVE: "info",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  props: ["list", "listLoading"],
  data() {
    return {
      currentPage: 1,
      pageSize: 0,
      countryWithCode,
      chooseCurrency,
      editLoader: false,
      createLoader: false,
      showCreateAccountModal: false,
      title: "",
      first_name: "",
      last_name: "",
      street_address: "",
      street_address2: "",
      company_name: "",
      is_login: "",
      role: "",
      city: "",
      state: "",
      country: "",
      postcode: "",
      customer_cat: "",
      share_personal_data: false,
      security_questions: "",
      security_answer: "",
      password: "",
      password_confirmation: "",
      where_did_you_hear_about_us: "",
      receive_mails: "",
      email: "",
      currency: "",
      type: "",
      phone_code: "",
      phone_number: "",
      status: "ACTIVE",
      showEditModal: false,
      editedItem: null,
      showDeleteModal: false,
      selectedRowForDelete: null,
      tableKey: 0,
      total: 0,
      // listLoading: true,
      listQuery: {
        page: 1,
        status: "",
        search: "",
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["ACTIVE", "INACTIVE"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        first_name: "",
        last_name: "",
        street_address: "",
        street_address2: "",
        is_login: "",
        role: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
        security_questions: "",
        security_answer: "",
        password: "",
        password_confirmation: "",
        customer_cat: "",
        share_personal_data: false,
        currency: "",
        type: "",
        status: "",
      },
      dialogCreateFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      isCstmrListLoading: true,
      downloadLoading: false,
    };
  },
  computed: {
    full_name: {
      get() {
        return `${this.temp.first_name} ${this.temp.last_name}`;
      },
      set(value) {
        const [first_name, last_name] = value.split(" ");
        this.$set(this.temp, "first_name", first_name);
        this.$set(this.temp, "last_name", last_name);
      },
    },
  },
  methods: {
    handleFilterChange() {
      this.getList();
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.getList();
    },

    handleResetFilter() {
      this.listQuery = {
        status: "",
        search: "",
      };
      this.getList();
    },

    getList() {
      this.isCstmrListLoading = true;

      const params = {
        page: this.currentPage,
        per_page: this.pageSize > 0 ? this.pageSize : '',
        ...this.listQuery,
      };

      axios
        .get(this.dynamic_base_url("admin/accounts"), {
          headers: { Authorization: "Bearer " + getToken() },
          params,
        })
        .then((response) => {
          this.isCstmrListLoading = false;
          this.list = response.data.data.users.data;
          this.analytics = response.data.data;
          this.total = response.data.data.users.total;
          this.pageSize = response.data.data.users.per_page;

          setTimeout(() => {
            this.$emit("listLoading", false);
          }, 1.5 * 1000);
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error("Error fetching data. Please try again later.");
          }
          this.isCstmrListLoading = false;
        });
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      // this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },

    createAccountForm() {
      const formData = {
        first_name: this.first_name,
        last_name: this.last_name,
        street_address: this.street_address,
        street_address2: this.street_address2,
        where_did_you_hear_about_us: this.where_did_you_hear_about_us,
        receive_mails: this.receive_mails,
        is_login: this.is_login,
        role: this.role,
        city: this.city,
        state: this.state,
        country: this.country,
        postcode: this.postcode,
        customer_cat: this.customer_cat,
        share_personal_data: this.share_personal_data ? "YES" : "NO",
        // share_personal_data: this.share_personal_data,
        company_name: this.company_name,
        security_questions: this.security_questions,
        security_answer: this.security_answer,
        password: this.password,
        password_confirmation: this.password_confirmation,

        currency: this.currency,
        email: this.email,
        phone_code: this.phone_code,
        phone_number: this.phone_number,
      };
      // Log the form data
      // console.log("Form Data:", formData);
      // Make a POST request to create data
      this.createLoader = true;
      axios
        .post(this.dynamic_base_url("admin/accounts/create"), formData, {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        })
        .then((response) => {
          // Handle the response as needed
          this.$message({
            message: "Data created successfully",
            type: "success",
            duration: 5 * 1000,
          });

          // Fetch the updated data after successful submission
          this.getList();
          // clear form field
          this.clearFormFields();
          this.createLoader = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error creating account. Please try again later."
            );
          }
          this.createLoader = false;
        });
    },
    clearFormFields() {
      // Iterate through each form field using refs and reset their values
      Object.keys(this.$refs).forEach((ref) => {
        if (
          this.$refs[ref] &&
          this.$refs[ref].$el &&
          this.$refs[ref].$el.value !== undefined
        ) {
          // Check if the ref has $el (assumes it's an element with a 'value' property)
          this.$refs[ref].$el.value = "";
        }
      });
    },
    showEditDialog(row) {
      this.editedItem = { ...row };
      this.showEditModal = true;
    },
    updateAccountForm() {
      // Prepare data for the PUT request
      const formData = {
        account_id: this.editedItem.account_id,
        first_name: this.editedItem.first_name,
        last_name: this.editedItem.last_name,
        street_address: this.editedItem.street_address,
        street_address2: this.editedItem.street_address2,
        where_did_you_hear_about_us:
          this.editedItem.where_did_you_hear_about_us,
        receive_mails: this.editedItem.receive_mails,
        is_login: this.editedItem.is_login,
        role: this.editedItem.role,
        city: this.editedItem.city,
        state: this.editedItem.state,
        country: this.editedItem.country,
        postcode: this.editedItem.postcode,
        customer_cat: this.editedItem.customer_cat,
        share_personal_data: this.editedItem.share_personal_data ? "YES" : "NO",
        company_name: this.editedItem.company_name,
        security_questions: this.editedItem.security_questions,
        security_answer: this.editedItem.security_answer,
        password: this.editedItem.password,
        password_confirmation: this.editedItem.password_confirmation,

        currency: this.editedItem.currency,
        // email: this.editedItem.email,
        phone_code: this.editedItem.phone_code,
        phone_number: this.editedItem.phone_number,
      };
      // Log the form data

      if (this.editedItem && this.editedItem.account_id) {
        this.editLoader = true;
        axios
          .put(this.dynamic_base_url(`admin/account/update`), formData, {
            headers: {
              Authorization: "Bearer " + getToken(),
            },
          })
          .then((response) => {
            // Handle the response as needed
            this.editLoader = false;
            this.$message({
              message: "Data updated successfully",
              type: "success",
              duration: 5 * 1000,
            });

            // Optionally, you can reset the form fields after successful submission
            this.$refs.editAccountForm.resetFields();
            this.showEditModal = false;

            // Fetch the updated data after successful submission
            this.getList();
          })
          .catch((error) => {
            const errorRes = error.response.data;
            this.$message.error(errorRes.message);
            // if (errorRes.status >= 400 || errorRes.status === false) {
            // } else {
            //   this.$message.error(
            //     "Error updating account. Please try again later."
            //   );
            // }

            this.editLoader = false;
          });
      } else {
        console.error("Invalid editedItem or editedItem.account_id");
      }
    },
    showCreateAccountDialog() {
      this.showCreateAccountModal = true;
    },
    resetEditForm() {
      this.$refs.editAccountForm.resetFields();
      this.editedItem = null;
    },
    handleCancel() {
      this.showDeleteModal = false;
    },
    handleConfirm() {
      this.$emit("confirm");
    },
    handleClose() {
      this.$emit("close");
      this.first_name = "";
      this.last_name = "";
      this.street_address = "";
      this.street_address2 = "";
      this.company_name = "";
      this.is_login = "";
      this.role = "";
      this.city = "";
      this.state = "";
      this.country = "";
      this.postcode = "";
      this.customer_cat = "";
      this.security_questions = "";
      this.security_answer = "";
      this.password = "";
      this.password_confirmation = "";
      this.where_did_you_hear_about_us = "";
      this.receive_mails = "";
      this.email = "";
      this.currency = "";
      this.type = "";
      this.phone_code = "";
      this.phone_number = "";
    },
    showDeleteDialog(row) {
      this.selectedRowForDelete = row;
      this.showDeleteModal = true;
    },
    handleDeleteConfirm() {
      // Ensure 'selectedRowForDelete' is not null and has an 'account_id'
      if (this.selectedRowForDelete && this.selectedRowForDelete.account_id) {
        const accountId = this.selectedRowForDelete.account_id;

        axios
          .delete(this.dynamic_base_url(`admin/account/delete/${accountId}`), {
            headers: {
              Authorization: "Bearer " + getToken(),
            },
          })
          .then(() => {
            this.$notify({
              title: "Success",
              message: "Delete Successfully",
              type: "success",
              duration: 1000,
            });

            // Update the frontend list immediately after successful deletion
            this.list = this.list.filter(
              (item) => item.account_id !== accountId
            );

            // Optionally, close the delete modal
            this.showDeleteModal = false;
          })
          .catch((error) => {
            const errorRes = error.response.data;
            if (errorRes.status >= 400 || errorRes.status === false) {
              this.$message.error(errorRes.message);
            } else {
              this.$message.error(
                "Error deleting customer account. Please try again later."
              );
            }
          });
      } else {
        console.error(
          "Invalid row or row.account_id:",
          this.selectedRowForDelete
        );
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.phone-input {
  width: 300px;
  /* Adjust the width as needed */
}

.phone-code {
  width: 80px;
  /* Adjust the width as needed */
}

.checkbox-container {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 8px;
  /* Adjust as needed */
}
</style>
