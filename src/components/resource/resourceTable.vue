<template>
  <div>
    <!-- el-table展示数据 -->
    <el-table :data="resourceList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe border
      style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" row-key="id" ref="multipleTable">

      <!-- 是否带选择框,带上reserve-selection可以防止跨页丢失 -->
      <el-table-column v-if="select" align="center" type="selection" :reserve-selection="true" width="55" />

      <el-table-column prop="name" label="素材名" width="160" align="center"></el-table-column>

      <!-- 必须增加一个key，否则显示可能不正常 -->
      <el-table-column prop="path" label="素材类型" width="100" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.path" v-if="scope.row.type === '图片'"></el-image>
          <el-image :src="require('@/assets/img/icon/type/video.png')" v-else-if="scope.row.type === '视频'"
            style="scale: 0.6;"></el-image>
          <el-image :src="require('@/assets/img/icon/type/ppt.png')" v-else-if="scope.row.type === '电子课件'"
            style="scale: 0.6;"></el-image>
          <el-image :src="require('@/assets/img/icon/type/pdf.png')" v-else-if="scope.row.suffix === '.pdf'"
            style="scale: 0.6;"></el-image>
          <el-image :src="require('@/assets/img/icon/type/word.png')" v-else style="scale: 0.6;"></el-image>
        </template>
      </el-table-column>

      <!-- 思政目标标签展示 -->
      <el-table-column prop="target.targetName" label="思政目标" width="160" align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.target.targetName }}</el-tag>
        </template>
      </el-table-column>

      <!-- 分享范围标签展示 -->
      <el-table-column prop="shareField" label="分享范围" align="center">
        <template slot-scope="scope">
          <!-- 三种不同的范围使用不同的风格展示 -->
          <el-tag v-if="scope.row.shareField === 'public'" type="primary">公开</el-tag>
          <el-tag v-else-if="scope.row.shareField === 'school'" type="warning">校内公开</el-tag>
          <el-tag v-else>仅私人可见</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" align="center">
        <template slot-scope="scope">
          {{ formatdate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="teacher.university.name" label="来源" align="center"></el-table-column>
    </el-table>

    <el-button v-if="select" type="primary" style="margin-top: 30px; margin-left: 5%;margin-bottom: 20px;"
      @click="submit">批量添加</el-button>
  </div>
</template>

<script>
import { watch } from 'vue';
import { formatMinDate } from '../../utils/dateutils'
export default {
  props: {
    resourceList: Array,
    resourceIDList: Array,
    currentPage: Number,
    pageSize: Number,
    loading: Boolean,
    min_shareField: String,
    opendialog: Boolean,
    select: {
      type: Boolean,
      default: false,
    },
    bigList: Array,
  },

  // mounted有时来不及获取props，所以要加nextTick
  mounted() {

  },

  data() {
    return ({
      r_list: [],
      map: {
        'private': 1,
        'school': 2,
        'public': 3,
      }
    });
  },

  methods: {
    // 处理多选事件
    handleSelectionChange(list) {
      // console.log(list);
      this.r_list = list;
    },
    //格式化日期
    formatdate(value) {
      return formatMinDate(value);
    },

    submit() {
      let min = this.r_list[0].shareField;
      let id_list = []

      // 遍历出所选素材的最小分享范围
      this.r_list.forEach(e => {
        if (this.map[e.shareField] < this.map[min]) min = e.shareField;
        id_list.push(e.id);
      })

      // 因为在mounted中进行了默认选中模式，所以这里不用去重了
      // this.r_list = this.unique(this.r_list.concat(this.bigList));
      // id_list = this.unique(id_list.concat(this.resourceIDList));
      // console.log(this.r_list);
      // console.log(id_list);
      console.log(min);
      this.$emit('update:bigList', this.r_list);
      this.$emit('update:min_shareField', min);
      this.$emit('update:resourceIDList', id_list);
      this.$emit('update:opendialog', false);
    },
  },

  // 监听器，每当resourceList发生变化的时候就会自动调用
  watch: {
    resourceList: function (newData, oldData) {
      this.$nextTick(function () {
        // console.log('resourcelist');
        console.log(this.bigList);
        this.resourceList.forEach(row => {
          // indexOf查找的是对象的引用而不是对象，所以出错，还是用findIndex
          if (this.bigList.findIndex(item => item.id === row.id) >= 0) {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        })
      })
    }
  }
}
</script>

<style></style>