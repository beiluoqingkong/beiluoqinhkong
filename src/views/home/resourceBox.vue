<template>
  <div>
    <div class="main_resource_head">
      <div class="left">
        <div class="ideotype">
          <span style="font-weight:bold;margin-top: 30px;">思政类别:</span>
          <ul>
            <li v-for="(item, index) of ideoTypeList" :key="item.id" :class="{ checked: item.id === ideoType.id }"
              @click="changeType(index)">
              {{ item.typeName }}
            </li>

          </ul>
        </div>

        <div class="ideotarget" style="margin-top: 30px;">
          <span style="font-weight:bold;margin-top: 30px;">思政目标:</span>
          <ul>
            <li v-for="(item, index) of ideoTargetList" :key="item.id" :class="{ checked: item.id === ideoTarget.id }"
              @click="changeTarget(index)">
              {{ item.targetName }}
            </li>
          </ul>
        </div>

        <div class="ideotarget" v-if="$store.state.teacherInfo" style="margin-top: 30px;">
          <span style="font-weight:bold;margin-top: 30px;">分享范围:</span>
          <el-radio-group v-model="shareField" style="margin-top: 35px;margin-left: 30px;">
            <el-radio label="public">公开</el-radio>
            <el-radio label="school">校内公开</el-radio>
            <el-radio label="private">仅私人可见</el-radio>
          </el-radio-group>
        </div>

        <div class="ideotarget" style="margin-top: 30px;">
          <span style="font-weight:bold;margin-top: 30px;">类别:</span>
          <el-tabs v-model="type" class="tab" @tab-click="ReQueryResource"
            style="margin-left: 50px;margin-top: 18px;width: 500px;">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="视频" name="视频"></el-tab-pane>
            <el-tab-pane label="电子课件" name="电子课件"></el-tab-pane>
            <el-tab-pane label="电子文稿" name="电子文稿"></el-tab-pane>
            <el-tab-pane label="图片" name="图片"></el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="right">
        <div id="head_search">
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchResource" type="primary"></el-button>
          </el-input>
        </div>
        <div id="order" style="margin-left: 40px;margin-top: 40px;">
          排序依据:&nbsp;&nbsp;
          <el-select v-model="orderby" style="width: 130px;" @change="ReQueryResource">
            <el-option label="名称" value="name" :key="1"></el-option>
            <el-option label="上传时间" value="createTime" :key="2"></el-option>
          </el-select>
        </div>

        <div id="order_" style="margin-left: 40px;margin-top: 30px;">
          排序方式:&nbsp;&nbsp;
          <el-select v-model="descend" style="width: 130px;" @change="ReQueryResource">
            <el-option label="升序" value="+" :key="1"></el-option>
            <el-option label="降序" value="-" :key="2"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="content" style="margin-left:11%;margin-bottom: 100px;margin-top: 30px;">
      <resource_grid :showList.sync="showList" :loading.sync="loading" :key="Math.random()"></resource_grid>
      <!-- 分页条 -->
      <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="totalcount"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" style="text-align: center"
        :key="4839">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import resource_grid from '../../components/resource/resource_grid.vue'
import { getAllIdeoType, getIdeoTargetListByTypeId, queryResource, searchResource } from '../../utils/api'

export default {
  components: {
    resource_grid
  },
  data() {
    return ({
      descend: '+',
      orderby: 'name',
      search: '',
      type: 'all',
      totalcount: 0,
      ideoType: {},
      loading: false,
      ideoTarget: {},
      shareField: 'public',
      ideoTypeList: [],
      ideoTargetList: [],
      resourceList: [],
      showList: [],
      currentPage: 1,
      pageSize: 12,
    })
  },
  mounted() {
    getAllIdeoType().then(({ data }) => {
      // console.log(data.data.data);
      this.ideoTypeList = data.data.data;
      this.ideoType = this.ideoTypeList[0];
      getIdeoTargetListByTypeId(this.ideoType.id).then(({ data }) => {
        this.ideoTargetList = data.data.data;
        // 初试查询
        this.getResourceList();
      })
    })
  },
  methods: {
    changeType(index) {
      //已选目标再次点击可取消
      if (this.ideoType == this.ideoTypeList[index]) {
        this.ideoType = {};
      } else {
        this.ideoType = this.ideoTypeList[index];
        this.ideoTarget = {};
        getIdeoTargetListByTypeId(this.ideoType.id).then(({ data }) => {
          this.ideoTargetList = data.data.data;
        })
      }
    },
    changeTarget(index) {
      //已选目标再次点击可取消
      if (this.ideoTarget == this.ideoTargetList[index]) {
        this.ideoTarget = {};
      } else {
        this.ideoTarget = this.ideoTargetList[index];
        // console.log(this.ideoTarget);
      }
    },

    // 查询参数预处理
    getParam() {
      let params = {
        page: this.currentPage,
        per: this.pageSize,
        'target.id': this.ideoTarget.id,
        'target.type.id': this.ideoType.id,
        shareField: this.shareField,
        orderBy: this.descend + this.orderby,
      };
      if (this.type !== 'all') params.type = this.type;
      if (params.shareField === 'school')
        params['teacher.universityID'] = this.$store.state.teacherInfo.universityID;
      else if (params.shareField === 'private')
        params['teacherID'] = this.$store.state.teacherInfo.id;
      return params;
    },

    searchResource() {
      let params = this.getParam();
      if (this.type !== 'all') params.type = this.type;
      params.keyword = this.search;
      this.loading = true;
      searchResource(params).then(({ data }) => {
        this.resourceList = data.data.data;
        this.totalcount = data.data.totalCount;
        this.loading = false;
      });
    },
    getResourceList() {
      let params = this.getParam();
      this.loading = true;
      queryResource(params).then(({ data }) => {
        this.resourceList = data.data.data;
        this.totalcount = data.data.totalCount;
        this.loading = false;
      })
    },
    //点击按钮切换页面
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
      if (this.search.length > 0) {
        this.searchResource();
      }
      else this.getResourceList();
    },

    ReQueryResource() {
      this.currentPage = 1;
      if (this.search.length > 0) {
        this.searchResource();
      }
      else this.getResourceList();
    }
  },
  watch: {
    // 监听器，字段改变时自动触发
    resourceList: function (newData, oldData) {
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

.ideotype,
.ideotarget {
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
  flex-wrap: wrap;
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