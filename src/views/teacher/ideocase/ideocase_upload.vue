<template>
  <el-card v-loading="loading">
    <h3>请填写案例信息</h3>
    <el-form ref="ideocase" :model="ideocase" label-width="100px">
      <el-form-item label="案例标题">
        <el-input v-model="ideocase.title"></el-input>
      </el-form-item>

      <el-form-item label="案例介绍">
        <el-input type="textarea" rows="7" v-model="ideocase.intro"></el-input>
      </el-form-item>

      <div>
        <el-image :src="require('@/assets/img/icon/uploadfoster.png')" style="scale: 0.5;margin-left: -30px;"></el-image>
        <!-- 导入自定义文件上传组件，同步sync必须带，否则修改不成功 -->
        <div style="display: flex;">
          <Uploadfoster :fileUrl.sync="ideocase.frontcover" style="scale: 1.15;margin-top: 3%;margin-left:5%;">
          </Uploadfoster>
          <el-card style="margin-left: 5%;height:250px;overflow:auto">
            <div v-if="ideocase.frontcover">
              <div style="margin-left: 38%;margin-bottom: 10px;">封面预览</div>
              <el-image :src.sync="ideocase.frontcover" style="" fit="contain"></el-image>
            </div>
            <div v-else>
              <div style="margin-top: 10%;text-align: center;">
                <div><i class="el-icon-picture" style="font-size: 46px;"></i></div>
                <br />请上传封面~<br /><br />上传之后的封面可在此预览
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <div style="display: flex;margin-top:3px;margin-bottom: -10px;">
        <el-form-item label="选择专业">
          <el-select ref="major" v-model="ideocase.course.major.id" placeholder="请选择专业" @change="changeSelect">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择课程" style="margin-left: 12%;">
          <el-select ref="course" v-model="ideocase.courseID" placeholder="请选择课程" @change="getKnowLedgeList">
            <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item v-if="ideocase.courseID" label="课程知识点 :" style="margin-top:10px;margin-left: 2%;">
        <el-tag v-for="item in knowledgeList" :key="item.id" type="success" :value="item.id"
          style="margin-left: 50px;font-size: 14px;">{{ item.knowledgePoint.pointName }}</el-tag>
      </el-form-item>

      <el-form-item label="教学方式">
        <el-input v-model="ideocase.teachingWay"></el-input>
      </el-form-item>

      <el-form-item label="教学方法">
        <el-input type="textarea" rows="7" v-model="ideocase.teachingMethod"></el-input>
      </el-form-item>

      <div>
        <el-image :src="require('@/assets/img/icon/uploadcase.png')" style="scale: 0.5;margin-left: -30px;"
          @click="opendialog = true"></el-image>
        <!-- 加上一个key，因为这个页面用了两次resourceTable，防止出错。不过不能用随机数，
        因为全局只用了两个resourceTable，每个key对应一个，使用随机数就会就是每打开一次，就创建一个新的resourceTable -->
        <resourseTable :currentPage="1" :pageSize="200" :resourceList.sync="bigList" :key="111"
          style="overflow: auto;max-height: 500px;margin-bottom: 60px;">
        </resourseTable>
      </div>

      <el-form-item label="分享范围">
        <el-radio-group v-model="ideocase.sharefield">
          <el-radio label="private">仅私人可见</el-radio>
          <el-radio label="school">校内公开</el-radio>
          <el-radio label="public">公开</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="text-align: center;">
        <el-button @click="save_Ideocase" id="save">保存</el-button>
        <el-button type="primary" @click="add_Ideocase" id="submit">发布</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="选择素材" :visible.sync="opendialog" width="65%">
      <!-- 使用自定义组件 -->
      <resource_type :resourceList.sync="resourceList" style="margin-top: -20px;" :key="$store.state.teacherInfo.id"
        :loading.sync="loading" :currentPage.sync="currentPage">
      </resource_type>
      <resourseTable :currentPage.sync="currentPage" :pageSize.sync="pageSize" :resourceList.sync="resourceList"
        :select="true" :loading.sync="loading" :resourceIDList.sync="resourceIDList" :min_shareField.sync="min_ShareField"
        :key="222" :bigList.sync="bigList" :opendialog.sync="opendialog"></resourseTable>
      <!-- 分页条 -->
      <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="resourceList.length"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
        style="text-align: center">
      </el-pagination>
    </el-dialog>

  </el-card>
</template>

<script>
import Uploadfoster from '../../../components/ideocase/uploadfoster.vue'
import resource_type from '../../../components/resource/resource_type.vue'
import resourseTable from '../../../components/resource/resourceTable.vue'
import {
  getAllMajor, getCourseListByMajorId, getKnowLedgeListByCourseId,
  saveIdeocase, addIdeocase, addResourceForIdeocase, queryIdeocase, queryResourceForIdeocase, deleteResourceForIdeocase
} from '../../../utils/api.js'

export default {
  components: {
    Uploadfoster,
    resource_type,
    resourseTable,
  },
  data() {
    return {
      routeId: null,
      majorList: [],
      courseList: [],
      knowledgeList: [],
      resourceList: [],
      min_ShareField: '',
      resourceIDList: [],
      bigList: [],
      // oldIdList为案例曾经已绑定的案例-素材项的ID
      oldIdList: [],
      loading: false,
      opendialog: false,
      currentPage: 1,
      pageSize: 7,
      loading: false,
      ideocase: {
        title: '',
        intro: '',
        teacherID: '',
        courseID: '',
        teachingWay: '',
        teachingMethod: '',
        frontcover: '',
        sharefield: '',
        course: {
          major: {
            id: ''
          }
        }
      },
      map: {
        'private': 1,
        'school': 2,
        'public': 3,
      },
    }
  },
  mounted() {
    this.ideocase.teacherID = this.$store.state.teacherInfo.id;
    getAllMajor().then(({ data }) => {
      this.majorList = data.data.data;
    })

    //获取路由中的变量
    this.routeId = this.$route.params.ideocaseId;
    if (this.routeId) {
      let param = {};
      param.id = this.routeId;
      // 显示正在加载...
      this.loading = true;
      queryIdeocase(param).then(({ data }) => {
        this.ideocase = data.data.data[0];
        //初始化的时候，获取一次课程信息和知识点信息，否则显示异常
        this.changeSelect(this.ideocase.course.major.id);

        //changeSelect中重置了caseID，所以这里重新获取一下
        this.ideocase.courseID = this.ideocase.course.id;
        this.getKnowLedgeList(this.ideocase.courseID);

        // 查找当前案例所携带的资源
        let search = {};
        search.caseID = this.ideocase.id;
        queryResourceForIdeocase(search).then(({ data }) => {
          this.bigList = [];
          let list = data.data.data;
          list.forEach(element => {
            this.oldIdList.push(element.id);
            this.bigList.push(element.resource);
          });
          this.loading = false;
        })
      });
    }
  },
  methods: {
    // el-select自带方法，当选择项发生变化时就能触发，res为当前选择项的value
    changeSelect(res) {
      this.ideocase.courseID = null;
      getCourseListByMajorId(res).then(({ data }) => {
        this.courseList = data.data.data;
      })
    },
    getKnowLedgeList(res) {
      // console.log('courseID'+this.ideocase.courseID);
      this.ideocase.knowledgeList = null;
      getKnowLedgeListByCourseId(res).then(({ data }) => {
        this.knowledgeList = data.data.data;
      })
    },
    save_Ideocase() {
      let istrue = this.judgeField();;
      if (!istrue) return false;
      this.loading = true;
      saveIdeocase(this.ideocase).then(({ data }) => {
        console.log(this.oldIdList);
        deleteResourceForIdeocase(this.oldIdList).then(res => {
          addResourceForIdeocase(data.data.id, this.resourceIDList).then(({ data }) => {
            this.$notify.success('案例保存成功！')
            this.$router.push({ path: '/teacher/ideocase' })
            this.loading = false;
          });
        })

      }).catch(err => {
        this.$notify.warning('案例保存失败！')
        this.loading = false;
      });
    },
    add_Ideocase() {
      let istrue = this.judgeField();;
      if (!istrue) return false;
      this.loading = true;
      addIdeocase(this.ideocase).then(({ data }) => {
        deleteResourceForIdeocase(this.oldIdList).then(res => {
          addResourceForIdeocase(data.data.id, this.resourceIDList).then(({ data }) => {
            this.$notify.success('案例发布成功！')
            this.$router.push({ path: '/teacher/ideocase' })
            this.loading = false;
          });
        })
      }).catch(err => {
        this.$notify.warning('案例发布失败！')
        this.loading = false;
      });
    },
    //点击按钮切换页面
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
    },

    // 素材的最小分享范围不能小于案例的分享范围
    judgeField() {
      if (this.map[this.min_ShareField] < this.map[this.ideocase.sharefield]) {
        this.$notify.warning('素材的最小分享范围不能小于案例的分享范围');
        return false;
      }
      return true;
    }
  },
}
</script>

<style scoped>
.el-card {
  width: 900px;
  margin-bottom: 50px;
}

.el-form>.el-form-item {
  margin-top: 35px;
}

#save {
  margin-top: 20px;
  margin-right: 25%;
}
</style>