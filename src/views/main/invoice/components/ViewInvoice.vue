<template>
  <div>
    <div class="container-fluid my-5">
      <div class="row content_wrapper">
        <div
          class="pt-md-4 col-md-2 box_col d-block d-md-none"
          style="width: fit-content; margin-left: auto"
        >
          <el-button
            :loading="loader"
            type="secondary"
            class="btn btn-secondary pull-right"
            @click="downloadPDF"
          >
            <i
              v-if="!loader"
              class="bi bi-cloud-download"
              style="
                font-size: 1.2em;
                vertical-align: middle;
                padding-right: 5px;
              "
            />
            <span
              v-if="!loader"
              class="pl-1"
              style="font-size: 1.2em; vertical-align: middle"
              >Download</span
            >
            <span
              v-if="loader"
              class="pl-1"
              style="font-size: 1.2em; vertical-align: middle"
              >Please wait...</span
            >
          </el-button>
        </div>
        <div class="col-md-9 box_col col-lg-10">
          <el-card
            v-if="invoiceDetailsData && !invoiceDetailsDataLoading"
            id="template_invoice"
            class="box-card py-4 my-4"
          >
            <div class="row justify-content-between segments">
              <div class="col-md-6">
                <div class="invoice_title">
                  <h1>
                    Invoice #{{ invoiceDetailsData.invoice_id }}
                    <span class="paid">{{
                      invoiceDetailsData.payment_status
                    }}</span>
                  </h1>
                </div>
              </div>
              <div class="col-md-5">
                <div
                  class="d-md-flex justify-content-between align-items-start"
                  style="gap: 1.6em"
                >
                  <div class="invoice_date_key">
                    <p class="font-weight-bold">Invoice Date</p>
                    <p class="font-weight-bold">Payment Method</p>
                  </div>
                  <div class="invoice_date_val">
                    <p class="">
                      {{ formatDate(invoiceDetailsData.invoice_date) }}
                    </p>
                    <p class="">
                      {{ invoiceDetailsData.payment_method ? invoiceDetailsData.payment_method.name : '---' }} ({{
                        invoiceDetailsData.payment_method ? invoiceDetailsData.payment_method.slug : '---'
                      }})
                    </p>
                  </div>
                </div>
                <!-- <p class="lead">Order # 12345</p> -->
              </div>
            </div>

            <div class="row justify-content-between segments">
              <div class="col-md-4">
                <div class="">
                  <div class="pay_to">
                    <h5>Pay To:</h5>
                    <p class="">
                      {{ invoiceDetailsData.description }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="pay_to">
                  <h5>Invoiced To:</h5>
                  <p>
                    {{ userDetails.full_name }}
                    <br />
                    {{ userDetails.email }} ({{ userDetails.phone_code_num }})
                    <br />
                    {{ userDetails.street_address }}, {{ userDetails.city }}
                    {{ userDetails.state }}, {{ userDetails.postcode }}
                    <br />
                    {{ userDetails.country }}.
                  </p>
                </div>
              </div>
            </div>

            <div class="row segments">
              <h5>Invoice Items</h5>
              <div class="pt-2 mb-0 w-100">
                <div class="wrap w-100" style="overflow-x: auto;">
                  <el-table
                    v-loading="invoiceDetailsDataLoading"
                    border
                    :data="invoiceDetailsData.items"
                    highlight-current-row
                    style="width: 100%;"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    :total="totalInvoices"
                  >
                    <el-table-column
                      prop="invoice_id"
                      label="ID"
                      min-width="200"
                    >
                      <template slot-scope="scope">
                        <span
                          class="text-primary py-3 d-block position-relative"
                          >{{ scope.row["invoice_id"] }}</span
                        >
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="domain_name"
                      label="Domain Name"
                      min-width="200"
                    >
                      <template slot-scope="scope">
                        <span class="py-3 d-block position-relative">{{
                          scope.row["domain_name"]
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="amount"
                      label="Amount"
                      min-width="200"
                    >
                      <template slot-scope="scope">
                        <span class="py-3 d-block position-relative"
                          >{{ $store.getters.currencyIcon
                          }}{{ formatAmount(scope.row["amount"]) }}</span
                        >
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="num_years"
                      label="No of Years"
                      min-width="200"
                    >
                      <template slot-scope="scope">
                        <span class="py-3 d-block position-relative">{{
                          scope.row.num_years ? scope.row["num_years"] : 'NIL'
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="domain_created_at"
                      label="Purchase Date"
                      min-width="200"
                    >
                      <template slot-scope="scope">
                        <span class="py-3 d-block position-relative">{{
                          formatDate(scope.row["domain_created_at"])
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="domain_expires"
                      label="Expiration Date"
                      min-width="200"
                    >
                      <template slot-scope="scope">
                        <span class="py-3 d-block position-relative">{{
                          formatDate(scope.row["domain_expires"])
                        }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
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
                <div class="totals">
                  <div class="subtotal pt-3 ml-auto">
                    <div class="d-flex w-100">
                      <p class="w-100">Sub Total</p>
                      <p class="w-100">
                        {{ $store.getters.currencyIcon
                        }}{{ formatAmount(subtotal) }}
                      </p>
                    </div>

                    <div class="d-flex w-100">
                      <p class="w-100">0% VAT</p>
                      <p class="w-100">
                        {{ $store.getters.currencyIcon }}{{ formatAmount(vat) }}
                      </p>
                    </div>

                    <div class="d-flex w-100">
                      <p class="w-100">Credit</p>
                      <p class="w-100">
                        {{ $store.getters.currencyIcon
                        }}{{ formatAmount(credit) }}
                      </p>
                    </div>
                  </div>
                  <div class="total bg-light">
                    <div class="subtotal py-3 ml-auto">
                      <div class="d-flex w-100">
                        <p class="w-100 mb-0">Total</p>
                        <p class="w-100 mb-0">
                          {{ $store.getters.currencyIcon
                          }}{{ formatAmount(total) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3">
                    <p class="mb-0 text-primary">* Indicates a taxed item.</p>
                  </div>
                </div>
            </div>

            <!-- <div class="row">
              <h5>Transactions</h5>
              <div class="table-responsive pt-3">
                <div class="table_wrap border-top">
                  <el-table
                    style="width: 100%; padding-top: 10px"
                    :data="invoices"
                    highlight-current-row
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    :total="totalInvoices"
                  >
                    <el-table-column prop="date" label="Date">
                      <template slot-scope="scope">
                        <div>
                          <p class="mb-0">
                            {{ formatDate(scope.row["date"]) }}
                          </p>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="gateway" label="Gateway" />
                    <el-table-column prop="trn_id" label="Transaction ID" />
                    <el-table-column prop="amount" label="Amount">
                      <template slot-scope="scope">
                        <div>
                          {{ $store.getters.currencyIcon
                          }}{{ formatAmount(scope.row["amount"]) }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <div class="totals">
                  <div class="total bg-light">
                    <div class="subtotal py-3 ml-auto">
                      <div class="d-flex w-100">
                        <p class="w-100 mb-0">Balance</p>
                        <p class="w-100 mb-0">N0.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </el-card>
          <div v-else>
            <el-card
              v-loading="invoiceDetailsDataLoading"
              class="search_result_wrap w-100 p-4 mb-5"
            >
              <span v-if="invoiceDetailsDataLoading"
                >Fetching invoice data</span
              >
              <h6
                v-if="invoiceDetailsData === null && !invoiceDetailsDataLoading"
              >
                No data found
              </h6>
            </el-card>
          </div>
        </div>
        <div
          class="pt-4 col-md-3 box_col col-lg-2 d-none d-md-block"
          style="width: fit-content; margin-left: auto"
        >
          <el-button
            :loading="loader"
            type="secondary"
            class="btn btn-secondary pull-right"
            @click="downloadPDF"
            :disabled="invoiceDetailsDataLoading || invoiceDetailsData === null"
          >
            <i
              v-if="!loader"
              class="bi bi-cloud-download"
              style="
                font-size: 1.2em;
                vertical-align: middle;
                padding-right: 5px;
              "
            />
            <span
              v-if="!loader"
              class="pl-1"
              style="font-size: 1.2em; vertical-align: middle"
              >Download</span
            >
            <span
              v-if="loader"
              class="pl-1"
              style="font-size: 1.2em; vertical-align: middle"
              >Please wait...</span
            >
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      id: this.$route.params.id,
      loader: false,
      currentPage: 1,
      pageSize: 10,
      invoiceDetailsData: null,
      userDetails: null,
      invoiceDetailsDataLoading: true,
      totalInvoices: 0,
      totalInvoices: 0,
      invoices: [
        {
          id: 1,
          date: "2024-03-26T20:48:09.000000Z",
          gateway: "Gateway 01",
          trn_id: "12345",
          amount: "5000.00",
        },
        {
          id: 2,
          date: "2024-02-26T20:48:09.000000Z",
          gateway: "Gateway 02",
          trn_id: "12345",
          amount: "5000.00",
        },
        {
          id: 3,
          date: "2024-01-26T20:48:09.000000Z",
          gateway: "Gateway 03",
          trn_id: "12345",
          amount: "5000.00",
        },
        {
          id: 4,
          date: "2024-06-26T20:48:09.000000Z",
          gateway: "Gateway 04",
          trn_id: "12345",
          amount: "5000.00",
        },
      ],
      vatRate: 0,
    };
  },
  computed: {
    subtotal() {
      return this.invoiceDetailsData && this.invoiceDetailsData.items ? this.invoiceDetailsData.items.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0
      ) : 0;
    },
    vat() {
      return (this.subtotal * this.vatRate) / 100;
    },
    credit() {
      return this.invoiceDetailsData ? this.invoiceDetailsData.total_amount : 0;
    },
    total() {
      return this.subtotal;
      // return this.subtotal + this.vat - this.credit;
    },
  },
  mounted() {
    this.userDetails = JSON.parse(sessionStorage.getItem("user_details"));
    this.fetchInvoiceDetailsData();
  },
  methods: {
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
    handlePageChange(page) {
      this.currentPage = page;
    },
    fetchInvoiceDetailsData() {
      this.invoiceDetailsDataLoading = true;
      axios
        .get(this.dynamic_base_url(`admin/invoices/${this.$route.params.id}`), {
          headers: { Authorization: "Bearer " + getToken() },
        })
        .then((response) => {
          if (response.data.success) {
            this.invoiceDetailsData = response.data.data;
            this.totalInvoices = response.data.data.items.length;

            // console.log(" invoiceDetailsData :", response.data.data);
          } else {
            console.error("Failed to fetch Invoice details data");
          }
          this.invoiceDetailsDataLoading = false;
        })
        .catch((error) => {
          const errorRes = error.response.data;
          if (errorRes.status >= 400 || errorRes.status === false) {
            this.$message.error(errorRes.message);
          } else {
            this.$message.error(
              "Error fetching Invoice details data. Please try again later."
            );
          }
          this.invoiceDetailsDataLoading = false;
        });
    },
    formatDate(dateString) {
      if (dateString === "All") {
        return dateString;
      } else {
        const options = { day: "numeric", month: "short", year: "numeric" };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", options);
      }
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
    downloadPDF() {
      // Create new jsPDF instance
      this.loader = true;
      const pdf = new jsPDF();

      // Get the element containing the content you want to convert to PDF
      const element = document.getElementById("template_invoice");

      // Use html2canvas to capture the content as an image and add it to the PDF
      html2canvas(element, {
        scale: 2, // Adjust the scale factor as needed
        windowWidth: document.documentElement.offsetWidth, // Set the window width for mobile devices
        windowHeight: document.documentElement.offsetHeight, // Set the window height for mobile devices
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        // console.log('imgHeight :', imgHeight)

        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Add the captured content as multiple pages to the PDF
        while (position < imgHeight) {
          // const remainingHeight = imgHeight - position
          // const heightToDisplay = Math.min(pageHeight, remainingHeight)

          // Add the portion of the image corresponding to the current page
          pdf.addImage(
            imgData,
            "PNG",
            0,
            -position,
            imgWidth,
            imgHeight,
            null,
            "SLOW"
          );

          // Add a new page if there's more content remaining
          if (position + pageHeight < imgHeight) {
            pdf.addPage();
          }
          position += pageHeight; // Increment position by pageHeight
        }

        this.loader = false;

        // Save the PDF file
        pdf.save("Invoice.pdf");
      });
    },
  },
};
</script>

<style scoped>
.content_wrapper {
  /* width: 58em; */
  max-width: 100%;
  margin: auto;
}
.search_result_wrap {
  min-height: 20em;
  border-radius: 10px;
  background: white;
  padding: 4em 1.2em;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.search_result_wrap h6 {
  color: #074172;
}
.btn-info,
.lead {
  margin-top: 20px;
}

.segments {
  margin-bottom: 3.5em;
}

.invoice_title h1 {
  font-weight: normal;
}

.paid {
  vertical-align: middle;
  color: #42b983;
  font-size: 12px;
  background: rgba(66, 185, 131, 0.2);
  padding: 5px 8px;
  border-radius: 4px;
}

.invoice_date_key p {
  font-weight: 700;
}

.invoice_date_val p {
  font-weight: 400;
  color: rgba(108, 117, 125, 0.8) !important;
}

.pay_to p {
  line-height: 1.8;
  color: rgba(108, 117, 125, 0.8) !important;
}

.table_el tbody tr td:nth-child(1) {
  width: 75%;
}

.table_el tbody td {
  padding: 16px 10px;
}

.table_el thead th {
  color: #909399;
  padding: 20px 10px 15px;
}

.subtotal {
  width: 23em;
  max-width: 100%;
  margin-left: auto;
}

.total {
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  font-weight: 700;
}

.table_wrap th {
  white-space: nowrap !important;
  min-width: 8em;
}
@media screen and (max-width: 576px) {
  .invoice_title h1 {
    font-size: 22px !important;
  }
  .content_wrapper .box_col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

.segments {
  margin-bottom: 2.0em;
}
}
</style>
