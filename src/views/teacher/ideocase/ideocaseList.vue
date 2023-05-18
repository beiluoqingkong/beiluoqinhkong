<template>
  <el-card>
    <div id="head">
      <h3>案例管理</h3>
      <div id="upload_btn">
        <el-button class="el-icon-upload2" @click="goToUpload" type="info" circle></el-button>
        <h4>发布案例</h4>
      </div>
    </div>

    <div>
      <!-- 绑定一个key，防止重用 -->
      <ideocase_type :ideocaseList.sync="ideocaseList" :key="4399" :loading.sync="loading"
        style="margin-top: -40px;">
      </ideocase_type>
    </div>

    <ideocase_grid :showList.sync="showList" :loading.sync="loading" :key="Math.random()"></ideocase_grid>
    
    <!-- 分页条 -->
    <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="ideocaseList.length"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" style="text-align: center"
      :key="4399">
    </el-pagination>

  </el-card>
</template>

<script>
import ideocase_type from '../../../components/ideocase/ideocase_type.vue';
import ideocase_grid from '../../../components/ideocase/ideocase_grid.vue';

export default {
  components: {
    ideocase_type,
    ideocase_grid
  },
  data() {
    return {
      ideocaseList: [],
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
      this.$router.push('/teacher/uploadIdeocase');
    },
    //点击按钮切换页面
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
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

<style  scoped>
.el-card {
  width: 1100px;
  margin-bottom: 50px;
}

#head {
  display: flex;
}

#upload_btn>.el-button {
  font-size: 23px;
  border: 0px;
  width: 45px;
  height: 45px;
  margin-top: 10px;
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