<template>
  <div class="container-fluid">
    <div class="app-container pb-0">
      <!-- <h1>Invoices</h1> -->
      <el-row :gutter="40" class="panel-group">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
          class="card-panel-col"
          style="padding-left: 0 !important"
        >
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">All Invoices</div>
              <count-to
                :start-val="0"
                :end-val="analytics.all"
                :duration="2600"
                class="card-panel-num"
              />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">Paid Invoices</div>
              <count-to
                :start-val="0"
                :end-val="analytics.paid"
                :duration="3200"
                class="card-panel-num"
              />
            </div>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
          class="card-panel-col"
          style="padding-right: 0 !important"
        >
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">Pending Invoices</div>
              <count-to
                :start-val="0"
                :end-val="analytics.pending"
                :duration="3200"
                class="card-panel-num"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-card class="box-card mt-0">
      <!-- <div
        class="d-flex justify-content-start align-items-center mb-3"
        style="gap: 10px !important"
      >
        <label for="" class="d-block">View</label>

        <el-select
          id=""
          v-model="entrySelect"
          placeholder="Select"
          class="col-2"
        >
          <el-option label="All Entries" selected value="all-entries" />
          <el-option label="Shuffled" value="shuffled" />
        </el-select>
      </div> -->
      <div
        class="pt-2 filter-container d-flex justify-content-end flex-column flex-md-row align-items-end ml-auto"
        style=""
      >
        <div class="d-flex align-items-center">
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
            v-model="listQuery.payment_status"
            placeholder="Select status"
            @change="handleFilterChange"
            clearable
            class="me-md-2 mt-0 pt-0"
            style="transform: translateY(-5px)"
          >
            <el-option label="Paid" value="PAID"></el-option>
            <el-option label="Unpaid" value="UNPAID"></el-option>
          </el-select>
        </div>
        <!-- @keyup.enter.native="handleFilter"
        @click="handleFilter"
         -->
        <div class="d-flex align-items-center" style="width: fit-content">
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

      <div class="table_wrap py-2">
        <el-table
          :key="tableKey"
          v-loading="loader"
          border
          fit
          style="width: 100%; min-width: 80em"
          :data="invoices"
          highlight-current-row
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :total="totalInvoices"
        >
          <el-table-column label="Invoice #" prop="invoice_id" />
          <el-table-column label="Total" prop="total_amount" >
            <template slot-scope="scope">
              <span class="py-3 d-block position-relative">
                {{ $store.getters.currencyIcon
              }}{{ formatAmount(scope.row["total_amount"]) || "0.00" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="payment_status" label="Payment Status">
            <template slot-scope="scope">
              <span
                v-if="scope.row.payment_status === 'PAID'"
                class="py-3 d-block position-relative"
              >
                <svg
                  width="64"
                  height="24"
                  viewBox="0 0 64 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="64" height="24" rx="4" fill="#D1FAE5" />
                  <circle cx="12" cy="12" r="3" fill="#34D399" />
                  <path
                    d="M23.5649 17V6.81818H27.1942C27.9863 6.81818 28.6425 6.96236 29.1629 7.25071C29.6833 7.53906 30.0727 7.93347 30.3312 8.43395C30.5898 8.93111 30.719 9.49124 30.719 10.1143C30.719 10.7408 30.5881 11.3042 30.3263 11.8047C30.0677 12.3018 29.6766 12.6963 29.153 12.9879C28.6326 13.2763 27.978 13.4205 27.1892 13.4205H24.6934V12.1179H27.05C27.5505 12.1179 27.9565 12.0317 28.268 11.8594C28.5796 11.6837 28.8083 11.4451 28.9541 11.1435C29.0999 10.8419 29.1729 10.4988 29.1729 10.1143C29.1729 9.72988 29.0999 9.38849 28.9541 9.0902C28.8083 8.7919 28.5779 8.55824 28.2631 8.3892C27.9515 8.22017 27.5405 8.13565 27.0301 8.13565H25.1011V17H23.5649ZM34.5546 17.169C34.0707 17.169 33.6332 17.0795 33.2421 16.9006C32.851 16.7183 32.5411 16.4548 32.3124 16.1101C32.087 15.7654 31.9743 15.3428 31.9743 14.8423C31.9743 14.4115 32.0572 14.0568 32.2229 13.7784C32.3886 13.5 32.6124 13.2796 32.8941 13.1172C33.1758 12.9548 33.4907 12.8321 33.8387 12.7493C34.1867 12.6664 34.5413 12.6035 34.9026 12.5604C35.36 12.5073 35.7312 12.4643 36.0162 12.4311C36.3013 12.3946 36.5084 12.3366 36.6377 12.2571C36.767 12.1776 36.8316 12.0483 36.8316 11.8693V11.8345C36.8316 11.4003 36.709 11.0639 36.4637 10.8253C36.2217 10.5866 35.8605 10.4673 35.3799 10.4673C34.8794 10.4673 34.485 10.5784 34.1966 10.8004C33.9116 11.0192 33.7144 11.2628 33.605 11.5312L32.208 11.2131C32.3737 10.7491 32.6157 10.3745 32.9339 10.0895C33.2554 9.80114 33.6249 9.59233 34.0425 9.46307C34.4601 9.33049 34.8993 9.2642 35.36 9.2642C35.6649 9.2642 35.9881 9.30066 36.3295 9.37358C36.6742 9.44318 36.9956 9.57244 37.2939 9.76136C37.5956 9.95028 37.8425 10.2204 38.0347 10.5717C38.2269 10.9197 38.3231 11.3722 38.3231 11.929V17H36.8714V15.956H36.8117C36.7156 16.1482 36.5714 16.3371 36.3792 16.5227C36.1869 16.7083 35.94 16.8625 35.6384 16.9851C35.3368 17.1077 34.9755 17.169 34.5546 17.169ZM34.8778 15.9759C35.2887 15.9759 35.6401 15.8946 35.9317 15.7322C36.2267 15.5698 36.4504 15.3577 36.6029 15.0959C36.7587 14.8307 36.8366 14.5473 36.8366 14.2457V13.2614C36.7835 13.3144 36.6808 13.3641 36.5283 13.4105C36.3792 13.4536 36.2085 13.4917 36.0162 13.5249C35.824 13.5547 35.6367 13.5829 35.4545 13.6094C35.2722 13.6326 35.1197 13.6525 34.9971 13.669C34.7087 13.7055 34.4452 13.7668 34.2066 13.853C33.9713 13.9392 33.7823 14.0634 33.6398 14.2259C33.5006 14.3849 33.431 14.5971 33.431 14.8622C33.431 15.2301 33.5669 15.5085 33.8387 15.6974C34.1105 15.883 34.4568 15.9759 34.8778 15.9759ZM40.303 17V9.36364H41.7895V17H40.303ZM41.0537 8.18537C40.7952 8.18537 40.5731 8.09919 40.3875 7.92685C40.2052 7.75118 40.1141 7.54238 40.1141 7.30043C40.1141 7.05516 40.2052 6.84635 40.3875 6.67401C40.5731 6.49834 40.7952 6.41051 41.0537 6.41051C41.3122 6.41051 41.5326 6.49834 41.7149 6.67401C41.9005 6.84635 41.9933 7.05516 41.9933 7.30043C41.9933 7.54238 41.9005 7.75118 41.7149 7.92685C41.5326 8.09919 41.3122 8.18537 41.0537 8.18537ZM46.648 17.1491C46.0315 17.1491 45.4813 16.9917 44.9974 16.6768C44.5168 16.3587 44.139 15.9062 43.8639 15.3196C43.5921 14.7296 43.4562 14.022 43.4562 13.1967C43.4562 12.3714 43.5938 11.6655 43.8689 11.0788C44.1473 10.4922 44.5284 10.0431 45.0123 9.73153C45.4962 9.41998 46.0448 9.2642 46.6579 9.2642C47.1319 9.2642 47.5131 9.34375 47.8014 9.50284C48.0931 9.65862 48.3184 9.84091 48.4775 10.0497C48.6399 10.2585 48.7659 10.4425 48.8554 10.6016H48.9449V6.81818H50.4314V17H48.9797V15.8118H48.8554C48.7659 15.9742 48.6366 16.1598 48.4676 16.3686C48.3019 16.5774 48.0732 16.7597 47.7815 16.9155C47.4898 17.0713 47.112 17.1491 46.648 17.1491ZM46.9761 15.8814C47.4037 15.8814 47.7649 15.7687 48.0599 15.5433C48.3582 15.3146 48.5836 14.9981 48.7361 14.5938C48.8918 14.1894 48.9697 13.7187 48.9697 13.1818C48.9697 12.6515 48.8935 12.1875 48.741 11.7898C48.5886 11.392 48.3648 11.0821 48.0699 10.8601C47.7749 10.638 47.4103 10.527 46.9761 10.527C46.5287 10.527 46.1558 10.643 45.8575 10.875C45.5592 11.107 45.3338 11.4235 45.1814 11.8246C45.0322 12.2256 44.9577 12.678 44.9577 13.1818C44.9577 13.6922 45.0339 14.1513 45.1863 14.5589C45.3388 14.9666 45.5642 15.2898 45.8625 15.5284C46.1641 15.7637 46.5353 15.8814 46.9761 15.8814Z"
                    fill="#065F46"
                  />
                </svg>
              </span>

              <span
                v-if="scope.row.payment_status === 'UNPAID'"
                class="py-3 d-block position-relative"
              >
                <svg
                  width="82"
                  height="24"
                  viewBox="0 0 82 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="82" height="24" rx="4" fill="#FEF3C7" />
                  <circle cx="12" cy="12" r="3" fill="#FBBF24" />
                  <path
                    d="M29.8908 6.81818H31.432V13.5149C31.432 14.2275 31.2646 14.8589 30.9299 15.4091C30.5951 15.956 30.1245 16.3868 29.5179 16.7017C28.9114 17.0133 28.2005 17.169 27.3851 17.169C26.5731 17.169 25.8638 17.0133 25.2573 16.7017C24.6507 16.3868 24.1801 15.956 23.8453 15.4091C23.5106 14.8589 23.3432 14.2275 23.3432 13.5149V6.81818H24.8794V13.3906C24.8794 13.8513 24.9805 14.2607 25.1827 14.6186C25.3882 14.9766 25.6782 15.2583 26.0527 15.4638C26.4273 15.666 26.8714 15.767 27.3851 15.767C27.9022 15.767 28.348 15.666 28.7225 15.4638C29.1003 15.2583 29.3887 14.9766 29.5875 14.6186C29.7897 14.2607 29.8908 13.8513 29.8908 13.3906V6.81818ZM35.0327 12.4659V17H33.5462V9.36364H34.973V10.6065H35.0675C35.2431 10.2022 35.5182 9.87737 35.8928 9.6321C36.2706 9.38684 36.7462 9.2642 37.3196 9.2642C37.84 9.2642 38.2957 9.37358 38.6868 9.59233C39.0779 9.80777 39.3812 10.1293 39.5966 10.5568C39.812 10.9844 39.9197 11.513 39.9197 12.1428V17H38.4332V12.3217C38.4332 11.7682 38.2891 11.3357 38.0007 11.0241C37.7124 10.7093 37.3163 10.5518 36.8125 10.5518C36.4678 10.5518 36.1612 10.6264 35.8928 10.7756C35.6276 10.9247 35.4171 11.1435 35.2614 11.4318C35.1089 11.7169 35.0327 12.0616 35.0327 12.4659ZM41.9134 19.8636V9.36364H43.3651V10.6016H43.4893C43.5755 10.4425 43.6998 10.2585 43.8622 10.0497C44.0246 9.84091 44.25 9.65862 44.5384 9.50284C44.8267 9.34375 45.2079 9.2642 45.6818 9.2642C46.2983 9.2642 46.8485 9.41998 47.3324 9.73153C47.8163 10.0431 48.1958 10.4922 48.4709 11.0788C48.7493 11.6655 48.8885 12.3714 48.8885 13.1967C48.8885 14.022 48.7509 14.7296 48.4759 15.3196C48.2008 15.9062 47.8229 16.3587 47.3423 16.6768C46.8617 16.9917 46.3132 17.1491 45.6967 17.1491C45.2327 17.1491 44.8532 17.0713 44.5582 16.9155C44.2666 16.7597 44.0379 16.5774 43.8722 16.3686C43.7064 16.1598 43.5788 15.9742 43.4893 15.8118H43.3999V19.8636H41.9134ZM43.37 13.1818C43.37 13.7187 43.4479 14.1894 43.6037 14.5938C43.7595 14.9981 43.9848 15.3146 44.2798 15.5433C44.5748 15.7687 44.9361 15.8814 45.3636 15.8814C45.8078 15.8814 46.179 15.7637 46.4773 15.5284C46.7756 15.2898 47.0009 14.9666 47.1534 14.5589C47.3092 14.1513 47.3871 13.6922 47.3871 13.1818C47.3871 12.678 47.3108 12.2256 47.1584 11.8246C47.0092 11.4235 46.7839 11.107 46.4822 10.875C46.1839 10.643 45.8111 10.527 45.3636 10.527C44.9328 10.527 44.5682 10.638 44.2699 10.8601C43.9749 11.0821 43.7512 11.392 43.5987 11.7898C43.4463 12.1875 43.37 12.6515 43.37 13.1818ZM52.7763 17.169C52.2924 17.169 51.8549 17.0795 51.4638 16.9006C51.0727 16.7183 50.7628 16.4548 50.5341 16.1101C50.3087 15.7654 50.196 15.3428 50.196 14.8423C50.196 14.4115 50.2789 14.0568 50.4446 13.7784C50.6103 13.5 50.834 13.2796 51.1158 13.1172C51.3975 12.9548 51.7124 12.8321 52.0604 12.7493C52.4084 12.6664 52.763 12.6035 53.1243 12.5604C53.5817 12.5073 53.9529 12.4643 54.2379 12.4311C54.523 12.3946 54.7301 12.3366 54.8594 12.2571C54.9886 12.1776 55.0533 12.0483 55.0533 11.8693V11.8345C55.0533 11.4003 54.9306 11.0639 54.6854 10.8253C54.4434 10.5866 54.0821 10.4673 53.6016 10.4673C53.1011 10.4673 52.7067 10.5784 52.4183 10.8004C52.1333 11.0192 51.9361 11.2628 51.8267 11.5312L50.4297 11.2131C50.5954 10.7491 50.8374 10.3745 51.1555 10.0895C51.477 9.80114 51.8466 9.59233 52.2642 9.46307C52.6818 9.33049 53.121 9.2642 53.5817 9.2642C53.8866 9.2642 54.2098 9.30066 54.5511 9.37358C54.8958 9.44318 55.2173 9.57244 55.5156 9.76136C55.8172 9.95028 56.0642 10.2204 56.2564 10.5717C56.4486 10.9197 56.5447 11.3722 56.5447 11.929V17H55.093V15.956H55.0334C54.9373 16.1482 54.7931 16.3371 54.6009 16.5227C54.4086 16.7083 54.1617 16.8625 53.8601 16.9851C53.5585 17.1077 53.1972 17.169 52.7763 17.169ZM53.0994 15.9759C53.5104 15.9759 53.8617 15.8946 54.1534 15.7322C54.4484 15.5698 54.6721 15.3577 54.8246 15.0959C54.9804 14.8307 55.0582 14.5473 55.0582 14.2457V13.2614C55.0052 13.3144 54.9025 13.3641 54.75 13.4105C54.6009 13.4536 54.4302 13.4917 54.2379 13.5249C54.0457 13.5547 53.8584 13.5829 53.6761 13.6094C53.4938 13.6326 53.3414 13.6525 53.2188 13.669C52.9304 13.7055 52.6669 13.7668 52.4283 13.853C52.1929 13.9392 52.004 14.0634 51.8615 14.2259C51.7223 14.3849 51.6527 14.5971 51.6527 14.8622C51.6527 15.2301 51.7886 15.5085 52.0604 15.6974C52.3321 15.883 52.6785 15.9759 53.0994 15.9759ZM58.5247 17V9.36364H60.0112V17H58.5247ZM59.2754 8.18537C59.0169 8.18537 58.7948 8.09919 58.6092 7.92685C58.4269 7.75118 58.3358 7.54238 58.3358 7.30043C58.3358 7.05516 58.4269 6.84635 58.6092 6.67401C58.7948 6.49834 59.0169 6.41051 59.2754 6.41051C59.5339 6.41051 59.7543 6.49834 59.9366 6.67401C60.1222 6.84635 60.215 7.05516 60.215 7.30043C60.215 7.54238 60.1222 7.75118 59.9366 7.92685C59.7543 8.09919 59.5339 8.18537 59.2754 8.18537ZM64.8697 17.1491C64.2532 17.1491 63.703 16.9917 63.2191 16.6768C62.7385 16.3587 62.3607 15.9062 62.0856 15.3196C61.8138 14.7296 61.6779 14.022 61.6779 13.1967C61.6779 12.3714 61.8155 11.6655 62.0906 11.0788C62.369 10.4922 62.7501 10.0431 63.234 9.73153C63.7179 9.41998 64.2665 9.2642 64.8796 9.2642C65.3536 9.2642 65.7347 9.34375 66.0231 9.50284C66.3147 9.65862 66.5401 9.84091 66.6992 10.0497C66.8616 10.2585 66.9876 10.4425 67.0771 10.6016H67.1665V6.81818H68.6531V17H67.2013V15.8118H67.0771C66.9876 15.9742 66.8583 16.1598 66.6893 16.3686C66.5236 16.5774 66.2949 16.7597 66.0032 16.9155C65.7115 17.0713 65.3337 17.1491 64.8697 17.1491ZM65.1978 15.8814C65.6254 15.8814 65.9866 15.7687 66.2816 15.5433C66.5799 15.3146 66.8053 14.9981 66.9577 14.5938C67.1135 14.1894 67.1914 13.7187 67.1914 13.1818C67.1914 12.6515 67.1152 12.1875 66.9627 11.7898C66.8103 11.392 66.5865 11.0821 66.2915 10.8601C65.9966 10.638 65.632 10.527 65.1978 10.527C64.7504 10.527 64.3775 10.643 64.0792 10.875C63.7809 11.107 63.5555 11.4235 63.4031 11.8246C63.2539 12.2256 63.1793 12.678 63.1793 13.1818C63.1793 13.6922 63.2556 14.1513 63.408 14.5589C63.5605 14.9666 63.7859 15.2898 64.0842 15.5284C64.3858 15.7637 64.757 15.8814 65.1978 15.8814Z"
                    fill="#92400E"
                  />
                </svg>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Payment Link Status"
            prop="payment_link_status"
          />
          <el-table-column prop="invoice_date" label="Invoice Date">
            <template slot-scope="scope">
              <span class="py-3 d-block position-relative">
                {{ formatDate(scope.row["invoice_date"]) || "Null" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="due_date" label="Due Date">
            <template slot-scope="scope">
              <span class="py-3 d-block position-relative">
                {{ formatDate(scope.row["due_date"]) || "Null" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="195" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="primary"
                  tag="el-button"
                  icon="el-icon-view"
                  size="mini"
                  @click="viewInvoice(scope.row)"
                  >View</el-button
                >
                <!-- <el-button
                  icon="el-icon-edit"
                  size="mini"
                  @click="editInvoice(scope.row)"
                />
                <el-button type="danger" icon="el-icon-delete" size="mini" /> -->
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination -->
      <div class="mt-4" style="width: fit-content; margin-left: auto">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="totalInvoices"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import CountTo from "vue-count-to";
import axios from "axios";
import { getToken } from "@/utils/auth";
// import { useRouter } from 'vue-router'
export default {
  components: {
    CountTo,
    Pagination,
  },
  data() {
    return {
      invoices: [],
      analytics: {
        all: 0,
        paid: 0,
        pending: 0,
      },
      loader: true,
      currentPage: 1,
      pageSize: 0,
      totalInvoices: 0,
      entrySelect: "",
      listQuery: {
        page: 1,
        payment_status: "",
        search: "",
      },
      tableKey: 0,
    };
  },
  mounted() {
    this.fetchInvoices();
  },
  methods: {
    handleFilterChange() {
      this.fetchInvoices();
    },

    handleResetFilter() {
      this.listQuery = {
        payment_status: "",
        search: "",
      };
      this.fetchInvoices();
    },

    fetchInvoices() {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize > 0 ? this.pageSize : "",
        ...this.listQuery,
      };

      this.loader = true;
      axios
        .get(this.dynamic_base_url("admin/invoices"), {
          headers: { Authorization: "Bearer " + getToken() },
          params,
        })
        .then((response) => {
          if (response.data.success) {
            this.invoices = response.data.data.data.data;
            this.pageSize = response.data.data.data.per_page;
            this.totalInvoices = response.data.data.data.total;
            this.analytics.all = response.data.data.analytics.all;
            this.analytics.paid = response.data.data.analytics.paid;
            this.analytics.pending = response.data.data.analytics.pending;
          } else {
            console.error("Failed to fetch invoice data");
          }
          this.loader = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error fetching invoice data. Please try again later."
            );
          }
          this.loader = false;
        });
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchInvoices();
    },
    viewInvoice(row) {
      // console.log("Selected Invoice to be viewed :", row);
      this.$router.push({
        name: "view-invoice",
        params: { id: row.invoice_id },
      });
    },
    editInvoice(row) {
      console.log("Selected Invoice to be edited :", row);
    },

    formatDate(dateString) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", options);
    },

    formatAmount(amount) {
      if (typeof amount === "string" && amount.includes(",")) {
        amount = amount.replace(/,/g, "");
      }

      const numericAmount = parseFloat(amount);

      // Check if numericAmount is a valid number
      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }

      return amount;
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
      // float: right;

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
    padding-left: 15px !important;
  }
  // .card-panel-icon-wrapper {
  //   float: none !important;
  //   display: none !important;
  //   width: 100%;
  //   height: 100%;
  //   margin: 0 !important;

  //   .svg-icon {
  //     display: block;
  //     margin: 14px auto !important;
  //     float: none !important;
  //   }
  // }
}
</style>
<style scoped>
@media screen and (max-width: 768px) {
  .card-panel-col {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
</style>
