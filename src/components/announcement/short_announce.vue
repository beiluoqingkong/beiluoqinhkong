<template>
  <div class="short_announce">
    <div class="calendar">
      <div class="day">{{ day }}</div>
      <div class="month">{{ year_month }}</div>
    </div>
    <div class="message" style="padding-left: 30px;margin-top: 10px;width: 400px;">
      <a :href="'/announceDetail/' + announcement.id" style="text-decoration: none;color: #D43030;font-size: 19px;">{{ announcement.title
      }}</a>
      <div class="information"> {{
        announcement.information }} </div>
    </div>
  </div>
</template>

<script>
import { } from '../../utils/dateutils'

export default {
  data() {
    return ({
      year_month: '',
      day: '',
    })
  },
  props: ['announcement'],
  mounted() {
    var dt = new Date(this.announcement.createTime);
    this.year_month = dt.getFullYear().toString() + '.' + (dt.getMonth() + 1).toString();
    this.day = dt.getDate().toString();
  },
}
</script>

<style  scoped>
.short_announce {
  display: flex;
  height: 105px;
  width: 530px;
}

.calendar {
  width: 80px;
  margin-top: 10px;
  background-image: url('../../../src/assets/img/head/calendar.png');
  /* 不设置no-repeat背景图片会循环展示 */
  background-repeat: no-repeat;
  background-size: 80px 90px;
  background-position: 0px -5px;
}

.day {
  margin-left: 30px;
  margin-top: 13px;
  font-size: 27px;
  color: #000000;
}

.month {
  margin-left: 14px;
  margin-top: 7px;
  font-size: 16px;
  color: #808080;
}

.information {
  margin-top: 12px;
  overflow: hidden;
  color: #808080;
  /* 多行文本超限显示 */
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  width: 400px;
}
</style>