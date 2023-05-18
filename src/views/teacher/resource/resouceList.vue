<template>
  <el-card>
    <div id="head">
      <h3>素材管理</h3>
      <div id="upload_btn">
        <span @click="goToUpload"><i class="el-icon-upload"></i></span>
        <h4>上传素材</h4>
      </div>
    </div>

    <div>
      <!-- 绑定一个key，防止重用 -->
      <resource_type :personal="true" :resourceList.sync="resourceList" :key="4399" :loading.sync="loading" style="margin-top: -40px;">
      </resource_type>
    </div>

    <resource_grid :showList.sync="showList" :loading.sync="loading" :modify="true" :key="Math.random()"></resource_grid>

    <!-- 分页条 -->
    <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="resourceList.length"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" style="text-align: center"
      :key="4399">
    </el-pagination>
  </el-card>
</template>

<script>
import resource_type from '../../../components/resource/resource_type'
import resource_grid from '../../../components/resource/resource_grid';

export default {
  components: {
    resource_type,
    resource_grid
  },
  data() {
    return {
      resourceList: [],
      showList: [],
      loading: false,
      currentPage: 1,
      pageSize: 12,
    }
  },
  created() {

  },
  methods: {
    goToUpload() {
      this.$router.push('/teacher/uploadResource');
    },
    //点击按钮切换页面
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
    },
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

<style  scoped>
.el-card {
  width: 1150px;
  margin-bottom: 50px;
}

#head {
  display: flex;
}

#upload_btn>span {
  font-size: 42px;
  border: 0px;
  margin-right: 15px;
}

#upload_btn {
  display: flex;
  float: right;
  position: relative;
  margin-left: 67%;
  padding-bottom: 5%;
}
</style>