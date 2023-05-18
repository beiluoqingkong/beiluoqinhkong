<template>
  <div>
    <h2 style="margin-left: 15px;">消息列表</h2>
    <!-- <el-scrollbar></el-scrollbar> 是滚动条组件，当在固定高度放置多行内容时可以使用，比较稳定-->
    <el-card style="width: 900px;" class="messageList" v-loading="loading">
      <Message v-for="(item) of messageList" :message="item" :key="item.id"></Message>
      <!-- 分页条 -->
      <el-pagination background layout="prev, pager, next,jumper, ->, total, slot" :total="totalcount"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" style="text-align: center; margin-top: 40px;"
        :key="4399">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Message from '../../components/message/message.vue';
import { queryMessage,queryUnreadMessage,updateMessageState } from '../../utils/api'

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      loading: false,
      messageList: [],
      totalcount:0
    }
  },
  mounted() {
    this.getMessageList();
    // 获取未读信息并更新状态
    queryUnreadMessage( this.$store.state.teacherInfo.id).then(({ data }) => {
      let list = data.data.data;
      list.forEach(message => {
        updateMessageState(message);
      });
    })
    // 不能直接串行执行，必须获取到全部的消息之后才可以给数组切片，
    // 否则切片时可能尚未获取到消息队列
    // this.getMessageList(this.currentPage);
  },
  components: {
    Message
  },
  methods: {
    //点击按钮切换页面
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
      this.getMessageList();
    },
    getMessageList(){
      let param = {};
      param.receiverID = this.$store.state.teacherInfo.id;
      param.per = this.pageSize;
      param.page = this.currentPage;
      // mooho低代码平台，降序直接在字段前加-即可
      param.orderBy ='-createTime';
      this.loading = true;
      queryMessage(param).then(({ data }) => {
        this.messageList = data.data.data;
        this.totalcount = data.data.totalCount;
        this.loading = false;
      })
    },
      // this.messageList = this.allMessageList.slice((page - 1) * this.pageSize, page * this.pageSize);
  },

  // watch: {
  //   currentPage: function (newData, oldData) {
  //     this.getMessageList(newData);
  //   }
  // }
}
</script>

<style scoped>
.messageList {
  /* height: 815px; */
  border: 1px solid #D7DBEC;
  border-radius: 20px 20px 20px 20px;
  overflow-x: hidden;
}

.message {
  margin-top: 17px;
}
</style>