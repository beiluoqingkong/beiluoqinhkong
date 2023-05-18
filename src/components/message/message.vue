<template>
  <div class="message">
    <el-badge :value="message.state === 'unread' ? 'new' : ''" class="item">
      <div style="width: 770px;">
        <h3 style="margin-left: 30px;">
          <!-- 案例《新时代新思想》发布成功~ -->
          {{ message.title }}
        </h3>
        <div class="content">
          <!-- 您发布的案例《新时代新思想》已经通过审核，并且在服务器中成功保存，您可以在<案例管理>模块中查看，或者修改后再次发布~ -->
          {{ message.content }}
        </div>
        <div class="time-div">{{ formatdate(message.createTime) }}
        </div>
      </div>
    </el-badge>
  </div>
</template>

<script>
import { formatMinDate } from '../../utils/dateutils'
export default {
  props: ['message'],
  methods: {
    formatdate(value) {
      return formatMinDate(value);
    },
  }
}
</script>
<style scoped>
.message {
  padding-top: 10px;
  width: 780px;
  border-bottom: 1px #D7DBEC solid;
  margin-left: 20px;
  background-color: #EBEEF5;
  border-radius: 20px 20px 20px 20px;
}

/* css实现悬停放大效果 */
.message:hover {
  transform: scale(1.009);
}

.message .content {
  width: 92%;
  height: 65px;
  color: #5A607F;
  font-size: 14px;
  line-height: 190%;
  margin-left: 4%;
}

.message .time-div {
  text-align: right;
  color: #5A607F;
  font-size: 13px;
  margin-bottom: 10px;
  margin-right: 15px;
}
</style>