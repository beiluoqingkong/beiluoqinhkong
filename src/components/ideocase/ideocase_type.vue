<template>
  <div id="tabs" style="display: flex;">
    <div>
      <el-tabs v-model="state" class="tab" @tab-click="getPersonalideocaseList">
        <el-tab-pane label="已上传" name="success"></el-tab-pane>
        <el-tab-pane label="审核中" name="published"></el-tab-pane>
        <el-tab-pane label="草稿箱" name="saved"></el-tab-pane>
        <el-tab-pane label="审核退回" name="wrong"></el-tab-pane>
      </el-tabs>
    </div>

    <div style="margin-left: 230px;">
      <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchPersonalideocaseList" type="primary"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import { queryIdeocase, searchIdeocase } from '../../utils/api'

export default {
  //personal为true用于检索个人上传的素材，为false检索所有资源
  props: {
    ideocaseList: Array,
    loading: Boolean,
    currentPage: Number,
  },
  data() {
    return ({
      type: '视频',
      state: 'success',
      search: '',
    });
  },

  mounted() {
    this.getPersonalideocaseList();
  },

  methods: {
    //查找个人案例
    getPersonalideocaseList(tab) {
      let list1 = [];
      this.$emit('update:loading', true);
      // 找到个人上传成功的资源
      let personal_param = {
        type: this.type,
        state: this.state,
        teacherID: this.$store.state.teacherInfo.id,
        orderBy:'-createTime'
      };
      queryIdeocase(personal_param).then(({ data }) => {
        list1 = data.data.data;
        if (this.state === 'published') {
          personal_param.state = 'first';
          queryIdeocase(personal_param).then(({ data }) => {
            list1 = list1.concat(data.data.data);
            this.$emit('update:ideocaseList', list1);
            this.$emit('update:currentPage', 1);
            this.$emit('update:loading', false);
          })
        }
        else {
          // console.log('personal-caselist');
          // console.log(list1);
          this.$emit('update:ideocaseList', list1);
          this.$emit('update:currentPage', 1);
          this.$emit('update:loading', false);
        }
      })
    },

    searchPersonalideocaseList() {
      let list1 = [];
      this.$emit('update:loading', true);
      // 找到个人上传成功的资源
      let personal_param = {
        type: this.type,
        state: this.state,
        keyword: this.search,
        teacherID: this.$store.state.teacherInfo.id,
      };
      searchIdeocase(personal_param).then(({ data }) => {
        list1 = data.data.data;
        if (this.state === 'published') {
          personal_param.state = 'first';
          searchIdeocase(personal_param).then(({ data }) => {
            list1 = list1.concat(data.data.data);
            this.$emit('update:ideocaseList', list1);
            this.$emit('update:currentPage', 1);
            this.$emit('update:loading', false);
          })
        }
        else {
          // console.log('personal-caselist');
          // console.log(list1);
          this.$emit('update:ideocaseList', list1);
          this.$emit('update:currentPage', 1);
          this.$emit('update:loading', false);
        }
      })
    }
  }
}
</script>

<style scoped>
.tab {
  width: 500px;
}
</style>