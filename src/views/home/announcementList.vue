<template>
  <div class="announcementList">
    <div class="left">
      <div style="display: flex;margin-left: 70px;">
        <i class="el-icon-office-building" style="font-size: 40px;"></i>
        <span style="font-size: 30px;font-weight:bolder;">&nbsp;&nbsp;公告类别</span>
      </div>
      <div>
        <div v-for="(item, index) of typeList" :key="index" class="ann_type" :class="{ checked: item === type }"
          @click="changeType(index)">
          <h2>{{ item }}</h2>
        </div>
      </div>
    </div>

    <div class="content" v-loading="loading">
      <div style="display: flex;margin-left: 20px;">
        <i class="el-icon-document-copy" style="font-size: 25px;"></i>
        <span style="font-size: 20px;font-weight:bolder;">&nbsp;&nbsp;公告详情</span>
      </div>

      <div class="announceList">
        <announcement v-for="(item) of announceList" :key="item.id" :title="item.title" :content="item.information"
        :date="item.createTime" style="margin-top: 20px;" @click.native="goToDetail(item.id)"></announcement>
      </div>
      <!-- 分页条 -->
      <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="totalcount"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
        style="text-align: center;margin-top: 50px" :key="4839">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import announcement from '../../components/announcement/announcement.vue'
import { queryAnnouncement } from '../../utils/api'

export default {
  components: { announcement },
  data() {
    return ({
      typeList: ['思政要闻', '系统通知'],
      type: '思政要闻',
      announceList: [],
      currentPage: 1,
      totalcount: 0,
      pageSize: 7,
      loading: false,
    })
  },
  mounted() {
    this.getAnnouncement();
  },
  methods: {
    changeType(index) {
      this.type = this.typeList[index];
      this.getAnnouncement();
    },
    // 跳转到公告详情
    goToDetail(id) {
      let routeData = this.$router.resolve('/announceDetail/' + id);
      window.open(routeData.href, "_blank");
    },

    getAnnouncement() {
      let params = {
        page: this.currentPage,
        per: this.pageSize,
        type: this.type,
        orderBy: "-createTime",
      };
      this.loading = true;
      queryAnnouncement(params).then(({ data }) => {
        this.announceList = data.data.data;
        this.totalcount = data.data.totalCount;
        console.log(this.announceList);
        this.loading = false;
      });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
      this.getAnnouncement();
    },
  }
}
</script>

<style lang="less" scoped>
.announcementList {
  display: flex;
  margin-top: 40px
}

.left {
  width: 350px;
  border-right: 1px solid #A6A6A6;
  height: 700px;

  .ann_type {
    height: 100px;
    width: 270px;
    border: 1px solid #A6A6A6;
    background-color: #cfcece;
    border-radius: 13px;
    text-align: center;
    margin-top: 50px;
    margin-left: 22px;
    transition: 0.5s;
  }

  .ann_type.checked {
    border: 1px solid #fff;
    color: #fff;
    background-color: #D43030;
  }

  .ann_type:hover {
    border: 1px solid #fff;
    color: #fff;
    cursor: pointer;
    background-color: rgb(239, 115, 115);
    // scale: 1.05;
    // transition: 0.5s;
  }
}

.content {
  margin-left: 30px;
  width: 900px;
  margin-bottom: 70px;
}

.announceList{
  height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>