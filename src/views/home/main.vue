<template>
  <div>
    <div class="main-head">
      <div class="head_scroll">
        <!-- <el-image :src="require('@/assets/img/head/fastNews.png')"
          style="height: 100px;margin-left: 220px;margin-bottom: 20px;"></el-image> -->
        <el-carousel :interval="5000" arrow="always" :height="bannerHeight + 'px'" style="margin-top: 40px;">
          <el-carousel-item v-for="(item) in scrollList" :key="item.id">
            <img :src="'http://localhost:47581/api/Attachment/getImage?file=' + item.picAddress"
              @click="openUrl(item.messAddress)">
            <h1 style="position:absolute;top:370px;left: 55px;">{{ item.title }}</h1>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="politic_news">
        <el-image :src="require('@/assets/img/head/politicNews.png')" style="height: 70px;"></el-image>
        <short_announce v-for="(item) in newsList" :key="item.id" :announcement="item" style="margin-top: 10px;">
        </short_announce>
      </div>
    </div>

    <div class="main-content">
      <div class="last_box">
        <el-image :src="require('@/assets/img/head/lastIdeocase.png')"
          style="height: 70px;margin-bottom: -20px;"></el-image>
        <div class="lastIdeocase" v-loading="ideocase_loading">
          <ideocase v-for="(item) of ideocaseList" :key="item.id" :ideocase="item" :detail="false" :modify="false"
            style="width: 200px;height: 280px;margin-left: 25px;margin-top: 20px;">
          </ideocase>
        </div>
        <el-image :src="require('@/assets/img/head/lastResource.png')"
          style="height: 70px;margin-top: 50px;margin-bottom: -20px;"></el-image>
        <div class="lastResource" v-loading="resource_loading">
          <resource v-for="(item) of resourceList" :key="item.id" :resource="item" :detail="false"
            style="width: 200px;height: 230px;margin-left: 25px;margin-top: 20px;">
          </resource>
        </div>
      </div>

      <div class="showdata">
        <div class="datasum">
          <div style="display: flex;margin-left: 10px;">
            <el-image :src="require('@/assets/img/icon/home/stastic.png')"
              style="height: 40px;margin-top: 16px;"></el-image>
            <h2>&nbsp;数据统计</h2>
          </div>
          <div style="display: flex;margin-top: 27px;margin-left: 30px;">
            <el-image :src="require('@/assets/img/icon/home/resource.png')"
              style="height: 35px;margin-top: -2px;"></el-image>
            <div style="color: #A1A7C4;font-size: 18px;">&nbsp;&nbsp;素材数量统计:&nbsp;&nbsp;{{ resource_totalcount }}</div>
          </div>
          <div style="display: flex;margin-top: 27px;margin-left: 30px;">
            <el-image :src="require('@/assets/img/icon/home/ideocase.png')"
              style="height: 35px;margin-top: -2px;"></el-image>
            <div style="color: #A1A7C4;font-size: 18px;">&nbsp;&nbsp;案例数量统计:&nbsp;&nbsp;{{ ideocase_totalcount }}</div>
          </div>
          <div style="display: flex;margin-top: 27px;margin-left: 30px;">
            <el-image :src="require('@/assets/img/icon/home/course.png')"
              style="height: 35px;margin-top: -2px;"></el-image>
            <div style="color: #A1A7C4;font-size: 18px;">&nbsp;&nbsp;现有课程数量统计:&nbsp;&nbsp;{{ course_totalcount }}</div>
          </div>
          <div style="display: flex;margin-top: 27px;margin-left: 30px;">
            <el-image :src="require('@/assets/img/icon/home/knowledge.png')"
              style="height: 35px;margin-top: -2px;"></el-image>
            <div style="color: #A1A7C4;font-size: 18px;">&nbsp;&nbsp;知识点数量统计:&nbsp;&nbsp;{{ knowledge_totalcount }}</div>
          </div>
        </div>

        <div class="datasum" style="margin-top: 90px;height: auto;">
          <div style="display: flex;margin-left: 10px;">
            <el-image :src="require('@/assets/img/icon/home/notify-all.png')"
              style="height: 40px;margin-top: 16px;"></el-image>
            <h2>&nbsp;系统通知</h2>
          </div>
          <div v-for="item of notifyList" :key="item.id" style="margin-top: 10px;margin-left: 13px;margin-bottom: 25px;">
            <div style="display: flex;">
              <el-image :src="require('@/assets/img/icon/home/notify-item.png')"
                style="height: 30px;margin-top: -2px;"></el-image>
              <div class="information"> {{ item.information }} </div>
            </div>
            <div style="color: #131523;font-size: 15px;font-weight: bold;margin-left: 230px;margin-top: 7px;">{{
              formatDate(item.createTime) }}</div>
          </div>
        </div>

        <div class="datasum" style="margin-top: 100px; border:0px;">
          <div style="display: flex;margin-left: 10px;margin-top: 50px;">
            <el-image :src="require('@/assets/img/icon/home/ideotype.png')"
              style="height: 40px;margin-top: 16px;"></el-image>
            <h2>&nbsp;思政类别</h2>
          </div>
          <div id="tagCloud" style="margin-left: 17%;scale: 1.2;color: #D43030;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import short_announce from '../../components/announcement/short_announce.vue'
import TagCloud from '../../../node_modules/TagCloud'
import {
  queryAnnouncement, queryScroll, queryResource, queryIdeocase, queryCourse,
  queryKnowledgePoint, getAllIdeoType
} from '../../utils/api'
import { formatDayDate } from '../../utils/dateutils'
import resource from '../../components/resource/resource.vue'
import ideocase from '../../components/ideocase/ideocase'

export default {
  components: {
    short_announce,
    resource,
    ideocase,
  },
  data() {
    return ({
      scrollList: [],
      newsList: [],
      notifyList: [],
      resourceList: [],
      ideocaseList: [],
      ideotypeList: [],
      resource_totalcount: 0,
      ideocase_totalcount: 0,
      course_totalcount: 0,
      knowledge_totalcount: 0,
      resource_loading: false,
      ideocase_loading: false,
      resourceCount: 0,
      ideocaseCount: 0,
      bannerHeight: 900,
      // 浏览器宽度
      screenWidth: 0,
    })
  },
  mounted() {
    // 首次加载时,需要调用一次，调节走马灯高度
    this.screenWidth = window.innerWidth;
    this.setSize();
    // 窗口大小发生改变时,调用一次
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
      this.setSize();
    }
    this.getScroll();
    this.getAnnouncement();
    this.getLastResource();
    this.getLastIdeocase();
    queryCourse({}).then(({ data }) => { this.course_totalcount = data.data.totalCount; })
    queryKnowledgePoint({}).then(({ data }) => { this.knowledge_totalcount = data.data.totalCount; })
    getAllIdeoType().then(({ data }) => {
      data.data.data.forEach(element => {
        this.ideotypeList.push(element.typeName);
      });
      let container = document.getElementById('tagCloud')
      TagCloud(container, this.ideotypeList, this.tagCloud);
    })
  },
  methods: {
    setSize() {
      // 通过浏览器宽度(图片宽度)计算高度
      this.bannerHeight = 580 / 1920 * this.screenWidth;
    },
    getScroll() {
      let param = {};
      queryScroll(param).then(({ data }) => {
        this.scrollList = data.data.data;
      })
    },
    // 获取通知公告信息
    getAnnouncement() {
      let param = {
        type: '思政要闻',
        per: 5,
        page: 1,
        orderBy: "-createTime"
      };
      queryAnnouncement(param).then(({ data }) => {
        this.newsList = data.data.data;
      })
      param.type = '系统通知';
      queryAnnouncement(param).then(({ data }) => {
        this.notifyList = data.data.data;
      })
    },

    getLastResource() {
      let param = {
        state: 'success',
        per: 8,
        page: 1,
        orderBy: "-createTime"
      };
      this.resource_loading = true;
      queryResource(param).then(({ data }) => {
        this.resource_totalcount = data.data.totalCount;
      });
      param.shareField = 'public';
      queryResource(param).then(({ data }) => {
        this.resourceList = data.data.data;
        this.resource_loading = false;
      });
    },

    getLastIdeocase() {
      let param = {
        state: 'success',
        per: 8,
        page: 1,
        orderBy: "-createTime"
      };
      this.ideocase_loading = true;
      queryIdeocase(param).then(({ data }) => {
        this.ideocase_totalcount = data.data.totalCount;
      })
      param.sharefield = 'public';
      queryIdeocase(param).then(({ data }) => {
        this.ideocaseList = data.data.data;
        this.ideocase_loading = false;
      })
    },

    openUrl(href) {
      window.open(href);
    },

    formatDate(date) {
      return formatDayDate(date);
    }
  }
}
</script>

<style lang="less" scoped>
.main-head {
  margin-top: 70px;
  display: flex;
}

.main-content {
  display: flex;
  margin-bottom: 50px;
}

.head_scroll {
  width: 770px;
  height: auto;
}

.el-carousel__item h1 {
  color: #ebe8e8;
}

.politic_news {
  margin-bottom: 60px;
  margin-left: 80px;
  margin-top: -30px;
}

.main-content {
  margin-top: -40px;
}

.last_box {
  width: 1020px;
}

.lastResource,
.lastIdeocase {
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;
  align-items: center;
  /* 设置纵向对齐方式为居中 */
}

.showdata {
  // border: 2px solid darkorange;
  width: 380px;
  margin-top: 50px;
}

.datasum {
  width: 350px;
  border: 3px solid #131523;
  height: 370px;
  border-radius: 20px;
}

.information {
  width: 280px;
  overflow: hidden;
  color: #808080;
  margin-left: 20px;
  margin-top: -5px;
  font-size: 14px;
  /* 多行文本超限显示 */
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

img {
  /*设置图片宽度和浏览器宽度一致*/
  width: 100%;
  height: inherit;
}
</style>