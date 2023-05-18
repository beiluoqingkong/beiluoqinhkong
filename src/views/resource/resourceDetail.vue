<template>
  <el-card class="resourceDetail" v-loading="loading">
    <div class="r_head">
      <el-card class="frontcover">
        <el-image :src="require('@/assets/img/icon/big/picture.png')" v-if="resource.type === '图片'"></el-image>
        <el-image :src="require('@/assets/img/icon/big/video.png')" v-else-if="resource.type === '视频'"></el-image>
        <el-image :src="require('@/assets/img/icon/big/ppt.png')" v-else-if="resource.type === '电子课件'"></el-image>
        <el-image :src="require('@/assets/img/icon/big/pdf.png')" v-else-if="resource.suffix === '.pdf'"></el-image>
        <el-image :src="require('@/assets/img/icon/big/word.png')" v-else></el-image>
      </el-card>

      <div class="detail">
        <div>素材名：{{ resource.name }}</div>
        <div>素材介绍：{{ resource.intro }}</div>
        <div><i class="el-icon-bell" />&nbsp;&nbsp;思政类别：
          <el-tag type="success" style="scale: 1.0;">{{ resource.target.type.typeName }}</el-tag>
        </div>
        <div><i class="el-icon-star-off" />&nbsp;&nbsp;思政目标：
          <el-tag type="success" style="scale: 1.0;">{{ resource.target.targetName }}</el-tag>
        </div>
        <div><i class="el-icon-user" />&nbsp;&nbsp;发布者：{{ resource.teacher.name }}</div>
        <div><i class="el-icon-school" />&nbsp;&nbsp;院校：{{ resource.teacher.university.name }}</div>
        <div><i class="el-icon-watch" />&nbsp;&nbsp;上传时间：{{ formatdate(resource.createTime) }}</div>
      </div>
    </div>

    <div>
      <div style="display: flex;margin-top: 80px;margin-left: 15%;">
        <i class="el-icon-film" style="font-size: 30px;"></i>
        <div style="font-size: 23px;margin-left: 10px;">素材预览</div>
        <div style="margin-left: 50%;">
          <el-button @click="downloadFile(resource.path)" type="primary" style="font-size: 20px;width:80px;" round>
            下载<Bottom style="width: 20px;"></Bottom>
          </el-button>
        </div>
      </div>

      <div class="show">
        <span>
          <Video v-if="resource.type === '视频'" :videoUrl="resource.path" :key="resource.id"></Video>
          <Photo v-else-if="resource.type === '图片'" :img_url="resource.path" :preview_list="[resource.path]"></Photo>
          <Mypdf v-else-if="resource.suffix === '.pdf'" :url="resource.path"></Mypdf>
          <Myppt v-else :url="resource.path"></Myppt>
          <!-- <Word v-else-if="resource.suffix === '.doc' || resource.suffix === '.docx'" :wordURL="resource.path"></Word> -->
          <!-- <h2 v-else>素材暂不支持预览，请下载后观看！</h2> -->
        </span>
      </div>

    </div>
  </el-card>
</template>

<script>
import { queryResource } from '../../utils/api'
import { download } from '../../utils/download.js'
import Video from '../../components/file/video.vue'
import Myppt from '../../components/file/myppt.vue'
import Mypdf from '../../components/file/mypdf.vue'
import Word from '../../components/file/word.vue'
import Photo from '../../components/file/photo.vue'
import { formatMinDate } from '../../utils/dateutils'

export default {
  components: {
    Video,
    Mypdf,
    Word,
    Photo,
    Myppt
  },
  data() {
    return ({
      resource: {},
      loading: false,
    })
  },
  mounted() {
    let param = {};
    param.id = this.$route.params.resourceId;
    this.loading = true;
    queryResource(param).then(({ data }) => {
      this.resource = data.data.data[0];
      // console.log(this.resource);
      // console.log(this.resource.type);
      this.loading = false;
    });
  },
  methods: {
    //格式化日期
    formatdate(value) {
      return formatMinDate(value);
    },
    downloadFile(url) {
      download(url);
    }
  }
}
</script>

<style scoped>
.resourceDetail {
  margin-left: 12%;
  width: 75%;
}

.resourceDetail .r_head {
  display: flex;
}

.resourceDetail .r_head .frontcover>.el-image {
  scale: 1.2;
}

.resourceDetail .r_head .detail {
  margin-left: 34%;
  font-size: 17px;
  color: grey;
}

.resourceDetail .r_head .detail>div {
  margin-top: 20px;
}

.resourceDetail .r_head .detail>div>i {
  scale: 1.4;
}

.resourceDetail .show {
  /* margin-left: 150px; */
  margin-top: 40px;
  display: grid;
  place-items: center;
  /* text-align: center; */
}
</style>