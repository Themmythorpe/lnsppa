<template>
  <div>
    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain ID</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.domain_id || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain Name</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.domain_name || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain SLD</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.domain_sld || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain TLD</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.domain_tld || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain DNS</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.domain_dns || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain NS</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.domain_ns || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Transaction ID</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.tranx_id || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Account ID</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.account_id || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Payment Method</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.payment_method || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Amount</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ $store.getters.currencyIcon }}{{ formatAmount(selected_domain.amount || 0) }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Number of years</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.num_years || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Purchase IP</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.purchase_ip || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Status</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.status || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain created at</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ formatDate(selected_domain.domain_created_at) || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Domain Expiration Date</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ formatDate(selected_domain.domain_expires) || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Order ID</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.order_id || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Consent Status</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.consent_status || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Delayed Order</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.order_delayed || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Contact Type</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.contact_type_contact || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Total Amount Charged</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ $store.getters.currencyIcon }}{{ formatAmount(selected_domain.total_charged || 0) }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">RRP Text</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.rrp_text || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Order Status</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.order_status || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Order Description</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.order_description || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">API Status</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.api_status || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Tracking Key</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.tracking_key || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Server</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ selected_domain.server || 'Null' }}
        </p>
      </div>
    </div>

    <div class="d-sm-flex justify-content-between align-items-center py-3 border-top">
      <div class="w-100">
        <p class="mb-0">Date</p>
      </div>
      <div class="w-100">
        <p class="mb-0">
          {{ formatDate(selected_domain.created_at) || 'Null' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SelectedDomain',
    props: {
      selected_domain: {
        type: Object,
        required: true
      }
    },
    data() { },
    methods: {
      formatDate(dateString) {
        if (dateString === 'All') {
          return dateString
        } else {
          const options = { day: 'numeric', month: 'short', year: 'numeric' }
          const date = new Date(dateString)
          return date.toLocaleDateString('en-GB', options)
        }
      },
      formatAmount(amount) {
        if (typeof amount === 'string' && amount.includes(',')) {
          amount = amount.replace(/,/g, '')
        }

        const numericAmount = parseFloat(amount)

        // Check if numericAmount is a valid number
        if (!isNaN(numericAmount)) {
          return numericAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }

        return amount
      }
    }
  }
</script>

<style scoped>
  p {
    font-size: 16px;
  }
</style>