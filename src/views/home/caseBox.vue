<template>
  <div>
    <div class="main_resource_head">
      <div class="left">
        <div class="course"  style="margin-top: 30px;margin-bottom: 30px;">
          <span style="font-weight:bold;margin-top: 30px;">选择筛选标准:</span>
          <el-radio-group v-model="choose" style="margin-top: 35px;margin-left: 30px;" @input="ResetChoose">
            <el-radio label="major">按专业筛选</el-radio>
            <el-radio label="knowledge_point">按知识点筛选</el-radio>
          </el-radio-group>
        </div>

        <div v-if="choose === 'major'" class="major">
          <span style="font-weight:bold;margin-top: 30px;">选择专业:</span>
          <ul>
            <li v-for="(item, index) of majorList" :key="item.id" :class="{ checked: item.id === major.id }"
              @click="changeMajor(index)">
              {{ item.name }}
            </li>
          </ul>
        </div>

        <div v-else class="knowledge_point">
          <span style="font-weight:bold;margin-top: 30px;">选择知识点:</span>
          <ul>
            <li v-for="(item, index) of knowledge_pointList" :key="item.id"
              :class="{ checked: item.id === knowledge_point.id }" @click="changeKnowLedgePoint(index)">
              {{ item.pointName }}
            </li>
          </ul>
        </div>

        <div class="course" style="margin-top: 30px;" v-loading="course_loading">
          <span style="font-weight:bold;margin-top: 30px;">选择课程:</span>
          <ul>
            <li v-for="(item, index) of courseList" :key="item.id" :class="{ checked: item.id === course.id }"
              @click="changeCourse(index)">
              {{ item.name }}
            </li>
          </ul>
        </div>

        <div class="course" v-if="$store.state.teacherInfo" style="margin-top: 30px;">
          <span style="font-weight:bold;margin-top: 30px;">分享范围:</span>
          <el-radio-group v-model="sharefield" style="margin-top: 35px;margin-left: 30px;" @input="ReQueryIdeocase">
            <el-radio label="public">公开</el-radio>
            <el-radio label="school">校内公开</el-radio>
            <el-radio label="private">仅私人可见</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="right">
        <div id="head_search">
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchIdeocase" type="primary"></el-button>
          </el-input>
        </div>
        <div id="order" style="margin-left: 40px;margin-top: 40px;">
          排序依据:&nbsp;&nbsp;
          <el-select v-model="orderby" style="width: 130px;" @change="ReQueryIdeocase">
            <el-option label="名称" value="title" :key="1"></el-option>
            <el-option label="发布时间" value="createTime" :key="2"></el-option>
          </el-select>
        </div>

        <div id="order_" style="margin-left: 40px;margin-top: 30px;">
          排序方式:&nbsp;&nbsp;
          <el-select v-model="descend" style="width: 130px;" @change="ReQueryIdeocase">
            <el-option label="升序" value="+" :key="1"></el-option>
            <el-option label="降序" value="-" :key="2"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="content" style="margin-left:8%;margin-bottom: 100px;margin-top: 30px; width: 1080px;">
      <ideocase_grid :showList.sync="showList" :loading.sync="loading" :modify="false" :key="Math.random()">
      </ideocase_grid>
      <!-- 分页条 -->
      <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="totalcount"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" style="text-align: center"
        :key="4839">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ideocase_grid from '../../components/ideocase/ideocase_grid.vue'
import axios from 'axios'
import Vue from 'vue'

let apiUrl = '/api';
import {
  getAllMajor, getCourseListByMajorId, queryIdeocase,
  searchIdeocase, queryKnowledgePoint, getCourseListByKnowId
} from '../../utils/api'

export default {
  components: {
    ideocase_grid
  },
  data() {
    return ({
      descend: '+',
      orderby: 'title',
      search: '',
      totalcount: 0,
      choose: 'major',
      knowledge_point: {},
      major: {},
      loading: false,
      course_loading: false,
      course: {},
      sharefield: 'public',
      majorList: [],
      knowledge_pointList: [],
      courseList: [],
      ideocaseList: [],
      showList: [],
      currentPage: 1,
      pageSize: 12,
    })
  },
  mounted() {
    this.getMajorDetail();
  },
  methods: {
    getMajorDetail() {
      getAllMajor().then(({ data }) => {
        // console.log(data.data.data);
        this.majorList = data.data.data;
        this.major = this.majorList[0];
        this.course_loading = true;
        getCourseListByMajorId(this.major.id).then(({ data }) => {
          this.courseList = data.data.data;
          this.course_loading = false;
          // 初试查询
          this.getIdeocaseList();
        })
      })
    },

    getKnowledgeDetail() {
      queryKnowledgePoint({}).then(({ data }) => {
        this.knowledge_pointList = data.data.data;
        this.knowledge_point = this.knowledge_pointList[0];
        this.course_loading = true;
        getCourseListByKnowId(this.knowledge_point.id).then(({ data }) => {
          var list = data.data.data;
          this.courseList = [];
          this.course_loading = false;
          list.forEach(e => {
            this.courseList.push(e.course);
          })
          this.getIdeocaseList();
        })
      })
    },

    changeMajor(index) {
      //已选目标再次点击可取消
      if (this.major == this.majorList[index]) {
        this.major = {};
      } else {
        this.major = this.majorList[index];
        this.course = {};
        this.course_loading = true;
        getCourseListByMajorId(this.major.id).then(({ data }) => {
          this.courseList = data.data.data;
          this.course_loading = false;
        })
      }
    },

    changeKnowLedgePoint(index) {
      //已选目标再次点击可取消
      if (this.knowledge_point == this.knowledge_pointList[index]) {
        this.knowledge_point = {};
      } else {
        this.knowledge_point = this.knowledge_pointList[index];
        this.course = {};
        this.course_loading = true;
        getCourseListByKnowId(this.knowledge_point.id).then(({ data }) => {
          var list = data.data.data;
          this.courseList = [];
          list.forEach(e => {
            this.courseList.push(e.course);
          })
          this.course_loading = false;
        })
      }
    },

    changeCourse(index) {
      //已选目标再次点击可取消
      if (this.course == this.courseList[index]) {
        this.course = {};
      } else {
        this.course = this.courseList[index];
        // console.log(this.course);
      }
    },

    // 查询参数预处理
    getParam() {
      let params = {
        page: this.currentPage,
        per: this.pageSize,
        'course.major.id': this.major.id,
        'course.id': this.course.id,
        sharefield: this.sharefield,
        orderBy: this.descend + this.orderby,
      };
      if (typeof this.knowledge_point.id !== 'undefined' && typeof this.course.id === 'undefined') {
        params['courseList'] = this.courseList;
      }
      if (params.shareField === 'school')
        params['teacher.universityID'] = this.$store.state.teacherInfo.universityID;
      else if (params.shareField === 'private')
        params['teacherID'] = this.$store.state.teacherInfo.id;
      return params;
    },

    searchIdeocase() {
      let params = this.getParam();
      params.keyword = this.search;
      this.loading = true;
      searchIdeocase(params).then(({ data }) => {
        this.ideocaseList = data.data.data;
        this.totalcount = data.data.totalCount;
        this.loading = false;
      });

    },

    getIdeocaseList() {
      let params = this.getParam();
      this.loading = true;
      queryIdeocase(params).then(({ data }) => {
        this.ideocaseList = data.data.data;
        this.totalcount = data.data.totalCount;
        this.loading = false;
      });
    },
    //点击按钮切换页面
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
      if (this.search.length > 0) {
        this.searchIdeocase();
      }
      else this.getIdeocaseList();
    },

    ReQueryIdeocase() {
      this.currentPage = 1;
      if (this.search.length > 0) {
        this.searchIdeocase();
      }
      else this.getIdeocaseList();
    },

    ResetChoose() {
      if (this.choose === 'major') {
        this.knowledge_point = {};
        this.getMajorDetail();
      }
      else {
        this.major = {};
        this.getKnowledgeDetail();
      }
    },

  },
  watch: {
    // 监听器，字段改变时自动触发
    ideocaseList: function (newData, oldData) {
      this.showList = [];
      //吧resourceList切成4个一行的二维数组
      newData.forEach((item, index) => {
        const i = Math.floor(index / 4);
        if (!this.showList[i]) this.showList[i] = [];
        this.showList[i].push(item);
      })
      // console.log(this.showList);
    }
  }
}
</script>

<style lang="less" scoped>
#head_search {
  margin-left: 30px;
  width: 300px;
  margin-top: -15px;
}

.main_resource_head {
  margin-top: 40px;
  margin-left: 100px;
  display: flex;
}

.major,
.course,
.knowledge_point {
  display: flex;
  font-size: 18px;
}

.typelist,
.targetlist {
  width: 900px;
}

ul {
  display: flex;
  list-style: none;
  max-width: 870px;
  margin-left: 30px;
  flex-wrap: wrap; //开启多行
  padding: 0;
  margin: 0;
}

ul>li {
  // border: 1px solid #000;
  border-radius: 10px;
  margin-left: 30px;
  max-width: 140px;
  min-width: 80px;
  height: 30px;
  font-size: 15px;
  text-align: center;
  line-height: 30px;
  margin-top: 30px;
  // margin-top: 7px;
  list-style-type: none;
  cursor: pointer;
  transition: all 0.3s linear;
}

ul>li.checked {
  border: 1px solid #fff;
  color: #fff;
  background-color: #D43030;
}

ul>li:hover {
  border: 1px solid #fff;
  color: #fff;
  background-color: rgb(253, 226, 226);
}
</style>