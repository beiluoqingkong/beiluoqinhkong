<template>
  <div class="comment">
    <div class="left">
      <el-avatar id="head-avatar" style="height: 90px; width:90px;" class="photo"
        :src="'http://localhost:47581/api/Attachment/getImage?file=' + comment.publisher.avatar"></el-avatar>
    </div>
    <div class="right">
      <div>
        <span>
          <i class="el-icon-user" />
          <span style="font-size: 13px;">&nbsp;&nbsp;{{ comment.publisher.name }}</span>
        </span>
        <span style="margin-left: 40px;">
          <i class="el-icon-school" />
          <span style="font-size: 13px;">&nbsp;&nbsp;{{ comment.publisher.university.name }}</span>
        </span>
      </div>

      <div class="comment_content">
        {{ comment.information }}
      </div>

      <div class="comment_time">
        {{ formatdate(comment.createTime) }}
      </div>
    </div>

    <!-- 如果是自己发的评论，可以删除 -->
    <div v-if="comment.publisher.id === $store.state.teacherInfo.id">
      <el-popconfirm title="确定删除这条评论吗？" @confirm="deleteComment(comment.id)">
        <el-button slot="reference" class="el-icon-delete" circle
          style="font-size: 20px;margin-top: 50px;margin-left: 15px;"></el-button>
      </el-popconfirm>
    </div>
  </div>
</template>

<script>
import { deleteComment } from '../../utils/api.js'
import { formatMinDate } from '../../utils/dateutils';
export default {
  props: ['comment'],
  mounted() {

  },
  methods: {
    deleteComment(id) {
      deleteComment(id).then(res => {
        this.$notify.success('评论已删除~');
        // 调用父组件的getComment方法
        this.$emit('getComment');
      });
    },
    formatdate(value) {
      return formatMinDate(value);
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  display: flex;
  transition: 0.4s;
  max-height: 450px;
  overflow-y: auto;

  .left {
    text-align: center;
    width: 120px;
    // border: 2px solid darksalmon;
  }

  .right {
    border-bottom: 1.5px solid rgb(227, 229, 231);
  }

  .left,
  .right {
    margin-top: 20px;
  }

  .comment_content {
    margin-top: 20px;
    margin-left: 20px;
    width: 850px;
    margin-bottom: 15px;
  }

  .comment_time{
    color: #A1A7C4;
    font-size: 13.5px;
    margin-left: 5px;
  }
}

.comment:hover {
  scale: 1.015;
  transition: 0.4s;
}
</style>