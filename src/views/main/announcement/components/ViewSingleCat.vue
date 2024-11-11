<template>
  <div>
    <div class="container my-5">
      <div class="content_wrapper">
        <el-card class="box-card">
          <div class="container px-0 inner">
            <div class="announcement_wrap pt-4 mx-lg-3">
              <h1 class="mt-0 mb-4">Price Increase Announcement - September 2023</h1>
              <p class="mb-4 date">
                <i class="bi bi-calendar2-range-fill" />{{ formatDate("2024-04-25T20:48:09.000000Z") }}
              </p>
              <p>
                Dear customer, As you may be aware, there has been a recent
                increase in the value of the US dollar, which has unfortunately
                led to a significant rise in our operational costs. It is with a
                heavy heart that we must inform you about an upcoming price
                increment in our subscription plans, set to take effect by
                September 2023 We fully understand the impact this change may have
                on your budget, and we genuinely empathize with your concerns. Our
                goal is to be transparent and to provide you with the best
                possible service at the fairest prices. Your satisfaction is our
                priority, and we are here to assist you should you have any
              </p>
              <p>
                Dear customer, As you may be aware, there has been a recent
                increase in the value of the US dollar, which has unfortunately
                led to a significant rise in our operational costs. It is with a
                heavy heart that we must inform you about an upcoming price
                increment in our subscription plans, set to take effect by
                September 2023 We fully understand the impact this change may have
                on your budget, and we genuinely empathize with your concerns. Our
                goal is to be transparent and to provide you with the best
                possible service at the fairest prices. Your satisfaction is our
                priority, and we are here to assist you should you have any
              </p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' }
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', options)
    }
  }
}
</script>

<style scoped>
.content_wrapper {
  /* width: 58em; */
  max-width: 100%;
  margin: auto;
}
h1 {
  font-size: clamp(20px, 1.8em, 5vw);
  font-weight: 300;
}

.date,
.date i {
  vertical-align: middle;
  line-height: 1;
  color: #888 !important;
}
.date i {
  font-size: 14px;
  font-weight: bold;
  margin-right: 8px;
}
p {
  color: #555;
  line-height: 2.5;
  margin-bottom: 2em;
}

@media screen and (max-width: 576px) {
  .container.inner {
    padding: 0 !important;
  }
}
</style>
