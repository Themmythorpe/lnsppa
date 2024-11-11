<template>
  <div>
    <!-- <h1>announcement {{ id }}</h1> -->
    <div class="container my-5">
      <el-card v-loading="loader" class="box-card pb-4 announcement_container">
        <!-- <div class="container pb-4"> -->
        <div class="" style="width: fit-content; margin-left: auto">
          <el-select v-model="monthValue" placeholder="Select Month..." class="phone-code">
            <el-option v-for="(code, key) in monthList" :key="key" :label="formatDate(code.date)"
              :value="formatDate(code.date)" />
            <!-- Add more options as needed -->
          </el-select>
        </div>
        <div v-if="!loader" class="">
          <div v-for="item in filteredAnnouncements" :key="item.id" class="announcement_wrap py-4 mx-lg-3">
            <p class="mb-2 date">
              <i class="bi bi-calendar2-range-fill" />{{ formatDate(item.date) }}
            </p>
            <h2>
              <i class="bi bi-arrow-right" />
              <span class="ml-3">{{ item.title }}</span>
            </h2>
            <p class="mb-0">{{ truncateDescription(item.description) }}</p>
            <div class="d-sm-flex justify-content-start align-items-center mt-4">
              <div class="mb-3 mb-sm-0">
                <el-button size="mini" type="" class="read_more ml-0 ml-sm-2 mb-2 mb-sm-0"
                  @click="readAnnouncement(item)">Read More</el-button>
                <!-- <el-button
                    size="mini"
                    type=""
                    class="recom ml-0 ml-sm-2 mb-2 mb-sm-0"
                  ><i class="bi bi-facebook" />
                    <span> Recommend</span></el-button>
                  <el-button
                    size="mini"
                    type=""
                    class="share ml-0 ml-sm-2 mb-2 mb-sm-0"
                  >Share</el-button> -->
              </div>
              <!-- <div class="signup_div">
                  <span><a href="">Sign Up</a> to see what your friends
                    recommend.</span>
                </div> -->
            </div>
          </div>
        </div>
        <!-- </div> -->
      </el-card>
    </div>
  </div>
</template>

<script>
  import countryWithCode from '../../mixin/country_with_code'

  export default {
    data() {
      return {
        countryWithCode,
        id: this.$route.params.id,
        loader: false,
        monthValue: '',
        announcements: [
          {
            id: 1,
            title: 'Price Increase Announcement - September 2023',
            description:
              "To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-04-25T20:48:09.000000Z'
          },
          {
            id: 2,
            title: 'Reseller Portal Discontinuation',
            description:
              "This way, your frontend will manage pagination locally without the need to modify the backend API. Make sure that your backend always sends all announcements, and your frontend handles pagination using the received data. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-06-31T20:48:09.000000Z'
          },
          {
            id: 3,
            title: 'Price Increase Announcement - September 2023',
            description:
              "To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-01-29T20:48:09.000000Z'
          },
          {
            id: 4,
            title: 'Reseller Portal Discontinuation',
            description:
              "This way, your frontend will manage pagination locally without the need to modify the backend API. Make sure that your backend always sends all announcements, and your frontend handles pagination using the received data. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-03-26T20:48:09.000000Z'
          },
          {
            id: 5,
            title: 'Price Increase Announcement - September 2023',
            description:
              "To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-04-25T20:48:09.000000Z'
          },
          {
            id: 6,
            title: 'Reseller Portal Discontinuation',
            description:
              "This way, your frontend will manage pagination locally without the need to modify the backend API. Make sure that your backend always sends all announcements, and your frontend handles pagination using the received data. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-06-31T20:48:09.000000Z'
          },
          {
            id: 7,
            title: 'Price Increase Announcement - September 2023',
            description:
              "To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-01-29T20:48:09.000000Z'
          },
          {
            id: 8,
            title: 'Reseller Portal Discontinuation',
            description:
              "This way, your frontend will manage pagination locally without the need to modify the backend API. Make sure that your backend always sends all announcements, and your frontend handles pagination using the received data. To implement pagination purely on the frontend without sending pagination parameters to the backend, you can simply paginate the data you receive from the backend API directly in your frontend logic. Here's how you can adjust your fetchAnnouncements method to achieve this",
            date: '2024-03-26T20:48:09.000000Z'
          }
        ],
        monthList: [
          {
            date: 'All'
          },
          {
            date: '2024-03-26T20:48:09.000000Z'
          },
          {
            date: '2024-01-29T20:48:09.000000Z'
          },
          {
            date: '2024-06-31T20:48:09.000000Z'
          },
          {
            date: '2024-04-25T20:48:09.000000Z'
          }
        ]
      }
    },
    computed: {
      filteredAnnouncements() {
        this.loader = true
        setTimeout(() => {
          this.loader = false
        }, 1000)
        if (!this.monthValue || this.monthValue === 'All') {
          return this.announcements
        }
        return this.announcements.filter(
          (announcement) => this.formatDate(announcement.date) === this.monthValue
        )
      }
    },
    mounted() {
      if (this.monthList.length > 0) {
        this.monthValue = this.formatDate(this.monthList[0].date) // set default value to the first option
      }
    },
    methods: {
      truncateDescription(description) {
        const maxLength = 380 // maximum number of characters to display
        if (description.length > maxLength) {
          return description.slice(0, maxLength) + '...' // add ellipsis if the description is longer than maxLength
        } else {
          return description
        }
      },
      formatDate(dateString) {
        if (dateString === 'All') {
          return dateString
        } else {
          const options = { day: 'numeric', month: 'short', year: 'numeric' }
          const date = new Date(dateString)
          return date.toLocaleDateString('en-GB', options)
        }
      },

      readAnnouncement(val) {
        this.$router.push({
          name: 'read-announcement',
          params: { id: val.id }
        })
      }
    }
  }
</script>

<style scoped>
  .announcement_container {
    min-height: 50vh !important;
  }

  .announcement_wrap {
    border-bottom: #eee 1px solid;
  }

  .container .announcement_wrap:last-of-type {
    border-bottom: none;
  }

  .announcement_wrap h2 {
    font-size: clamp(20px, 1.8em, 5vw);
    /* font-size: 1.8em; */
    color: rgb(20, 121, 245);
    font-weight: 300;
  }

  .announcement_wrap p {
    color: #555;
    line-height: 2.1;
  }

  h2 i {
    font-size: 20px;
    display: inline-block;
    margin-right: 10px;
  }

  .truncate-lines-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
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

  .read_more {
    background-color: rgb(213, 228, 255);
    color: rgb(20, 121, 245);
    border: none;
    font-weight: 700;
    vertical-align: middle;
    line-height: 1;
  }

  .recom,
  .share {
    color: rgb(213, 228, 255);
    background: rgb(20, 121, 245);
    border: none;
    font-weight: 700;
    vertical-align: middle;
    line-height: 1;
  }

  .recom i,
  .recom span {
    vertical-align: middle;
    line-height: 1;
    font-size: 14px;
  }

  .signup_div {
    margin-left: 10px;
  }

  .signup_div span {
    font-weight: 600;
    font-size: 14px;
  }

  .signup_div a {
    text-decoration: none;
    color: rgb(93, 113, 166);
  }
</style>