<template>
  <el-card class="resource" @click.native="goToDetail" v-loading="loading">
    <div class="resource_photo" style="text-align: center;">
      <el-image :src="require('@/assets/img/icon/type/picture.png')" style="height: 50px;"
        v-if="resource.type === '图片'"></el-image>
      <el-image :src="require('@/assets/img/icon/type/video.png')" v-else-if="resource.type === '视频'"
        style="height: 50px;"></el-image>
      <el-image :src="require('@/assets/img/icon/type/ppt.png')" v-else-if="resource.type === '电子课件'"
        style="height: 50px;"></el-image>
      <el-image :src="require('@/assets/img/icon/type/pdf.png')" v-else-if="resource.suffix === '.pdf'"
        style="height: 50px;"></el-image>
      <el-image :src="require('@/assets/img/icon/type/word.png')" v-else style="height: 50px;"></el-image>
    </div>

    <div v-if="detail" class="detail">
      <div>素材名：{{ resource.name }}</div>
      <!-- <div>素材介绍：{{ resource.intro }}</div> -->
      <div><i class="el-icon-bell" />&nbsp;&nbsp;思政类别：
        <el-tag type="success" style="scale: 0.8;">{{ resource.target.type.typeName }}</el-tag>
      </div>
      <div><i class="el-icon-star-off" />&nbsp;&nbsp;思政目标：
        <el-tag type="success" style="scale: 0.8;">{{ resource.target.targetName }}</el-tag>
      </div>
      <div><i class="el-icon-user" />&nbsp;&nbsp;发布者：{{ resource.teacher.name }}</div>
      <div><i class="el-icon-school" />&nbsp;&nbsp;院校：{{ resource.teacher.university.name }}</div>
      <div><i class="el-icon-watch" />&nbsp;&nbsp;上传时间：{{ formatdate(resource.createTime) }}</div>
    </div>

    <div v-else>
      <div style="margin-top: 60%;text-align: center;overflow: hidden;text-overflow: ellipsis;
      white-space: nowrap;">素材名：{{ resource.name }}</div>
    </div>

    <div v-if="modify == true">
      <el-dropdown>
        <div class="el-dropdown-link">
          <i class="el-icon-more-outline"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus"
            @click.native="routerJump('/teacher/uploadResource/' + resource.id)">编辑</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus" @click.native="deleteResource(resource.id)">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-card>
</template>

<script>
import { formatMinDate } from '../../utils/dateutils'
import { deleteResource } from '../../utils/api'

export default {
  props: {
    resource: Object,
    modify: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return ({
      loading: false,
    })
  },
  methods: {
    //格式化日期
    formatdate(value) {
      return formatMinDate(value);
    },
    goToDetail() {
      // this.$router.push('/resourceDetail/' + this.resource.id);
      // 打开新标签页
      let routeData = this.$router.resolve('/resourceDetail/' + this.resource.id);
      window.open(routeData.href, "_blank");
    },
    // 路由跳转
    routerJump(url) {
      this.$router.push(url);
    },
    deleteResource(id) {
      this.loading = true;
      deleteResource(id).then(res => {
        this.$notify.success('删除成功!');
        this.$router.go(0);
        this.loading = false;
      }).catch(err => {
        this.$notify.warning('删除失败!');
      });
    }
  }
}
</script>

<style scoped>
.resource {
  max-width: 250px;
  max-height: 400px;
  background-color: aliceblue;
  transition: 0.3s;
}

.resource:hover {
  scale: 1.03;
  transition: 0.3s;
}

.detail {
  font-size: 13px;
  color: darkgray;
}

.detail>div {
  margin-top: 5px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-more-outline {
  margin-top: 15px;
  float: right;
  font-size: 23px;
  margin-left: 5px;
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>