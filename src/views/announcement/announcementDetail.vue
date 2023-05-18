<template>
  <el-card class="announcementetail" v-loading="loading">
    <div class="r_head">
      <h1>{{ announcement.title }}</h1>
      <div style="display: flex;margin-left: 17%;margin-top: 50px;">
        <div class="icon"><i class="el-icon-school" />&nbsp;&nbsp;类型：{{ announcement.type }}</div>
        <div class="icon time"><i class="el-icon-watch" />&nbsp;&nbsp;发布时间：{{ formatdate(announcement.createTime) }}</div>
      </div>
    </div>

    <div >
      <!-- 使用markdown解析器，因为后台使用富文本框，格式为markdown -->
      <MarkdownPreview v-model="announcement.information" :height="800" :isPreview=true :bordered=true :copyCode=true theme="oneDark" class="content"/>
    </div>
  </el-card>
</template>

<script>
import { getAnnouncementDetail } from '../../utils/api'
import { formatMinDate } from '../../utils/dateutils'
import MarkdownPreview from 'vue-meditor'

export default {
  components: {
    MarkdownPreview
  },
  data() {
    return ({
      announcement: {},
      loading: false,
    })
  },
  mounted() {
    let id = this.$route.params.announcementId;
    this.loading = true;
    getAnnouncementDetail(id).then(({ data }) => {
      this.announcement = data.data;
      this.loading = false;
    });
  },
  methods: {
    //格式化日期
    formatdate(value) {
      return formatMinDate(value);
    },
  }
}
</script>

<style scoped>
.r_head {
  text-align: center;
}

.time {
  margin-left: 50%;
}
.icon{
  font-size: 19px;
}

.content{
  width: 70%;
  margin-left: 17%;
  margin-top: 50px;
  overflow: auto;
  border-radius: 30px;
  margin-bottom: 100px;
}
</style>