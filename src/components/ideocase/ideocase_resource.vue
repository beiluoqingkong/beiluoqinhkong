<template>
  <div id="ideo_tabs">
    <div>
      <el-tabs v-model="type" @tab-click="getCaseResourceList" class="ideo_tab">
        <el-tab-pane name="视频" label="视频"> </el-tab-pane>
        <el-tab-pane name="电子课件" label="电子课件"> </el-tab-pane>
        <el-tab-pane name="电子文稿" label="电子文稿"> </el-tab-pane>
        <el-tab-pane name="图片">
          <template slot="label">
            <div class="tab-pane">图片</div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="resourceList.length == 0 && loading == false">
      <div style="text-align: center;height: 280px;">
        <h2 style="margin-top: 140px;">案例没有当前类型的资源哦~</h2>
      </div>
    </div>

    <div v-loading="loading" v-else-if="type === '图片'">
      <Photo v-for="(item) of resourceList" :img_url="item.path" :preview_list="[item.path]" :key="item.id"
        style="width: 25%;"></Photo>
    </div>  

    <div v-else v-loading="loading" style="display: flex;margin-top: 40px;max-height: 500px;min-height: 300px;">
      <div style="width: 650px;">
        <span>
          <Video v-if="type === '视频'" :videoUrl="checkedResource.path" :key="checkedResource.id" style="margin-left: 60px;"></Video>
          <Mypdf v-else-if="checkedResource.suffix === '.pdf'" :url="checkedResource.path" style="margin-left: 60px;"></Mypdf>
          <Myppt v-else :url="checkedResource.path" style="margin-left: -40px;"></Myppt>
          <!-- <Word v-if="checkedResource.suffix === '.docx'" :wordURL="checkedResource.path" :key="checkedResource.id">
          </Word> -->
          <!-- <h2 v-if="checkedResource.suffix === '.doc'">素材暂不支持预览，请下载后观看！</h2> -->
        </span>
      </div>

      <el-card style="max-height: 480px;width: 300px;margin-left: 110px;overflow: auto;border:2px solid darkgray;border-radius: 20px;">
        <div style="display: flex;margin-left: 70px;width: 180px;">
          <i class="el-icon-film" style="font-size: 30px;"></i>
          <div style="font-size: 18px;margin-left: 10px;">素材列表</div>
        </div>
        <ul>
          <li v-for="(item, index) of resourceList" :key="item.id" :class="{ checked: index === checkedIndex }"
            @click="changChecked(index)">
            <div style="display: flex;">
              <div style="max-width: 130px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin-left: 25px;">{{ item.name }}
              </div>
              <div style="font-size: 20px;margin-left: 10px;">
                <i class="el-icon-download" circle  @click="downloadFile(item.path)"/>
              </div>
            </div>
          </li>
        </ul>
      </el-card>
    </div>

  </div>
</template>

<script>
import { getResourceListByCaseId } from '../../utils/api'
import { download } from '../../utils/download.js'
import Video from '../../components/file/video.vue'
import Myppt from '../file/myppt.vue'
import Mypdf from '../../components/file/mypdf.vue'
import Word from '../../components/file/word.vue'
import Photo from '../../components/file/photo.vue'

export default {
  //personal为true用于检索个人上传的素材，为false检索所有资源
  props: {
    caseId: String,
  },
  components: {
    Video,
    Mypdf,
    Word,
    Photo,
    Myppt
  },
  data() {
    return ({
      type: '视频',
      loading: false,
      resourceList: [],
      checkedResource: {},
      checkedIndex: 0
    });
  },

  mounted() {
    this.getCaseResourceList();
  },

  methods: {
    //查找公开或可用的资源
    getCaseResourceList(tab) {
      this.resourceList = [];
      this.loading = true;
      //查询案例中某个类型的资源
      getResourceListByCaseId(this.caseId, this.type).then(({ data }) => {
        let list = data.data.data;
        list.forEach(e => {
          this.resourceList.push(e.resource);
        });
        this.checkedIndex = 0;
        if (this.resourceList.length > 0) this.checkedResource = this.resourceList[this.checkedIndex];
        this.loading = false;
      })
    },

    downloadFile(url) {
      if (!this.$store.state.teacherInfo)
        this.$notify.warning('登录后才可下载~')
      else  download(url);
    },

    changChecked(index) {
      this.checkedIndex = index;
      this.checkedResource = this.resourceList[this.checkedIndex];
      // console.log(this.checkedResource);
    }
  }
}
</script>

<style scoped>
#ideo_tabs,
.ideo_tab {
  width: 1100px;
}


ul>li {
  border: 1px solid #000;
  border-radius: 8px;
  margin-left: 5px;
  width: 190px;
  height: 50px;
  font-size: 13px;
  text-align: center;
  line-height: 50px;
  margin-top: 7px;
  list-style-type: none;
  cursor: pointer;
  transition: all 0.3s linear;
}

ul>li.checked {
  border: 1px solid #fff;
  color: #fff;
  background-color: #F56C6C;
}

ul>li:hover {
  border: 1px solid #fff;
  color: #fff;
  background-color: rgb(253, 226, 226);
}
</style>