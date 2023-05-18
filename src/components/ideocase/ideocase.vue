<template>
  <el-card class="ideocase" @click.native="goToDetail" v-loading="loading">
    <div class="ideocase_photo" style="height: 190px;display: flex;align-items: center;">
      <!-- 父元素使用flex布局后，父元素align-items: center为垂直居中，子元素margin 0 auto为水平居中 -->
      <el-image :src="ideocase.frontcover" style="width: 190px;margin: 0 auto;"></el-image>
    </div>

    <div v-if="detail" class="detail">
      <div>案例标题：{{ ideocase.title }}</div>
      <div>教学方式：{{ ideocase.teachingWay }}</div>
      <div><i class="el-icon-bell" />&nbsp;&nbsp;相关专业：<el-tag type="primary" style="scale: 0.8;">{{
        ideocase.course.major.name }}</el-tag></div>
      <div><i class="el-icon-star-off" />&nbsp;&nbsp;关联课程：<el-tag type="primary" style="scale: 0.8;">{{
        ideocase.course.name }}</el-tag></div>

      <div><i class="el-icon-user" />&nbsp;&nbsp;发布者：{{ ideocase.teacher.name }}</div>
      <div><i class="el-icon-school" />&nbsp;&nbsp;院校：{{ ideocase.teacher.university.name }}</div>
      <div><i class="el-icon-watch" />&nbsp;&nbsp;发布时间：{{ formatdate(ideocase.createTime) }}</div>
    </div>

    <div v-else>
      <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">案例标题：{{ ideocase.title }}</div>
      <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">教学方式：{{ ideocase.teachingWay }}</div>
    </div>

    <div v-if="modify">
      <el-dropdown>
        <div class="el-dropdown-link">
          <i class="el-icon-more-outline"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus"
            @click.native="routerJump('/teacher/uploadIdeocase/' + ideocase.id)">编辑</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus" @click.native="deleteIdeocase(ideocase.id)">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-card>
</template>

<script>
import { formatMinDate } from '../../utils/dateutils'
import {
  deleteIdeocase, queryResourceForIdeocase, deleteResourceForIdeocase,
  getCommentListByCaseId
} from '../../utils/api'

export default {
  props: {
    ideocase: Object,
    modify: {
      type: Boolean,
      default: true
    },
    detail: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return ({
      loading:false,
    })
  },
  methods: {
    //格式化日期
    formatdate(value) {
      return formatMinDate(value);
    },
    goToDetail() {
      // this.$router.push('/ideocaseDetail/' + this.ideocase.id);
      let routeData = this.$router.resolve('/ideocaseDetail/' + this.ideocase.id);
      window.open(routeData.href, "_blank");
    },
    // 路由跳转
    routerJump(url) {
      this.$router.push(url);
    },
    deleteIdeocase(id) {
      this.loading = true;
      deleteIdeocase(id).then(res => {
        this.$notify.success('删除成功!');
        this.loading = false;
        this.$router.go(0);
      }).catch(err => {
        this.$notify.warning('删除失败!');
      });
    }
  }
}
</script>

<style scoped>
.ideocase {
  max-width: 250px;
  max-height: 450px;
  background-color: rgb(240, 249, 235);
  transition: 0.3s;
}

.ideocase:hover {
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