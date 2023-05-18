<template>
  <el-card class="ideocaseDetail" v-loading="loading">
    <div class="r_head">
      <el-card class="frontcover" style="max-width: 600px;max-height: 500px;overflow-y: auto;border:">
        <el-image :src="ideocase.frontcover"></el-image>
      </el-card>

      <div class="detail">
        <div>案例标题：{{ ideocase.title }}</div>
        <div>教学方式：{{ ideocase.teachingWay }}</div>
        <div>教学方法：{{ ideocase.teachingMethod }}</div>
        <div><i class="el-icon-bell" />&nbsp;&nbsp;相关专业：<el-tag type="primary">{{
          ideocase.course.major.name }}</el-tag></div>
        <div><i class="el-icon-star-off" />&nbsp;&nbsp;关联课程：<el-tag type="primary">{{
          ideocase.course.name }}</el-tag></div>
        <div><i class="el-icon-user" />&nbsp;&nbsp;发布者：{{ ideocase.teacher.name }}</div>
        <div><i class="el-icon-school" />&nbsp;&nbsp;院校：{{ ideocase.teacher.university.name }}</div>
        <div><i class="el-icon-watch" />&nbsp;&nbsp;上传时间：{{ formatdate(ideocase.createTime) }}</div>
      </div>
    </div>

    <div>
      <div style="display: flex;margin-top: 80px;margin-left: 9%;">
        <i class="el-icon-film" style="font-size: 30px;"></i>
        <div style="font-size: 23px;margin-left: 10px;">素材预览</div>
      </div>

      <div class="show">
        <ideocase_resource :caseId="ideocase.id" :key="ideocase.id"></ideocase_resource>
      </div>
    </div>

    <el-card style="margin-top: 150px;border:2px solid gainsboro;border-radius: 20px;" v-loading="commentloading">
      <div style="display: flex;">
        <el-input placeholder="发一条友善的评论吧~" v-model="message" type="textarea" class="input-with-select" :rows="3">
        </el-input>
        <el-button slot="append" icon="el-icon-s-promotion" type="primary" plain
          style="padding-left: 20px;margin-left: 20px;font-size: 25px;" @click="addCaseComment"></el-button>
      </div>

      <div v-if="commentList.length === 0" style="margin-bottom: 60px;text-align: center;">
        <h3>暂时还没有评论哦，欢迎抢沙发~</h3>
      </div>

      <div v-else style="margin-bottom: 60px;">
        <!-- 子组件使用@getComment绑定父组件的getComment -->
        <comment v-for="(item) of commentList" :key="item.id" :comment="item" style="margin-bottom: 20px;"
          @getComment="getComment"></comment>
      </div>

      <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="totalcount"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" style="text-align: center"
        :key="4839">
      </el-pagination>
    </el-card>
  </el-card>
</template>

<script>
import { queryIdeocase, addComment, getCommentListByCaseId } from '../../utils/api'
import ideocase_resource from '../../components/ideocase/ideocase_resource.vue'
import { formatMinDate } from '../../utils/dateutils'
import comment from '../../components/comment/comment.vue'

export default {
  components: {
    ideocase_resource,
    comment
  },
  data() {
    return ({
      ideocase: {},
      resourceList: [],
      loading: false,
      commentloading: false,
      message: '',
      currentPage: 1,
      pageSize: 10,
      commentList: [],
      totalcount: 0,
    })
  },
  mounted() {
    let param = {};
    param.id = this.$route.params.ideocaseId;
    this.loading = true;
    queryIdeocase(param).then(({ data }) => {
      this.ideocase = data.data.data[0];
      this.loading = false;

      // if (!this.$store.state.teacherInfo) {
      //   this.$message.error('用户尚未登录，不予查看！');
      //   this.$router.push('/');
      // }
      if (this.ideocase.sharefield === 'school' &&
        this.ideocase.teacher.university.id !== this.$store.state.teacherInfo.university.id) {
        this.$message.error('当前用户与案例不属于同所院校，不具备查看权限！');
        this.$router.push('/');
      }
      else if (this.ideocase.sharefield === 'private' &&
        this.ideocase.teacher.id !== this.$store.state.teacherInfo.id) {
        this.$message.error('当前用户与案例发布者身份不符，不具备查看权限！');
        this.$router.push('/');
      }
      else this.getComment();
    });
  },
  methods: {
    //格式化日期
    formatdate(value) {
      return formatMinDate(value);
    },
    addCaseComment() {
      if (!this.$store.state.teacherInfo)
        this.$notify.warning('登录后才可评论哦!')
      else if (this.message.length === 0)
        this.$notify.warning('不允许发送空评论!')
      else {
        let teacherInfo = this.$store.state.teacherInfo;
        let param = {
          publisherID: teacherInfo.id,
          caseID: this.ideocase.id,
          information: this.message
        };
        addComment(param).then(res => {
          this.$notify.success('评论发送成功！');
          this.message = "";
          this.currentPage = 1;
          this.getComment();
        }).catch(err => {
          this.$notify.error('发送评论失败!请检查网络或评论是否超出长度！')
        })
      }
    },
    getComment() {
      this.commentloading = true;
      getCommentListByCaseId(this.ideocase.id, this.currentPage, this.pageSize).then(({ data }) => {
        this.commentList = data.data.data;
        this.totalcount = data.data.totalCount;
        this.commentloading = false;
      });
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getComment();
    }

  }
}
</script>

<style scoped>
.ideocaseDetail {
  margin-left: 12%;
  width: 75%;
}

.ideocaseDetail .r_head {
  display: flex;
}

.ideocaseDetail .r_head .frontcover>.el-image {
  scale: 1.2;
}

.ideocaseDetail .r_head .detail {
  margin-left: 15%;
  font-size: 17px;
  color: grey;
}

.ideocaseDetail .r_head .detail>div {
  margin-top: 20px;
}

.ideocaseDetail .r_head .detail>div>i {
  scale: 1.4;
}

.ideocaseDetail .show {
  /* margin-left: 150px; */
  margin-top: 40px;
  display: grid;
  place-items: center;
  /* text-align: center; */
}
</style>