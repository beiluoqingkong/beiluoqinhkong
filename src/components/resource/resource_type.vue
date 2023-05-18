<template>
  <div id="tabs" style="display: flex;">
    <div>
      <el-tabs v-if="personal" v-model="state" class="tab" @tab-click="handleStateChange">
        <el-tab-pane label="已上传" name="success"></el-tab-pane>
        <el-tab-pane label="审核中" name="published"></el-tab-pane>
        <el-tab-pane label="草稿箱" name="saved"></el-tab-pane>
        <el-tab-pane label="审核退回" name="wrong"></el-tab-pane>
      </el-tabs>
      <el-tabs v-if="!personal" v-model="type" @tab-click="getAllResourceList" class="tab">
        <el-tab-pane label="视频" name="视频"></el-tab-pane>
        <el-tab-pane label="电子课件" name="电子课件"></el-tab-pane>
        <el-tab-pane label="电子文稿" name="电子文稿"></el-tab-pane>
        <el-tab-pane label="图片" name="图片"></el-tab-pane>
      </el-tabs>
      <el-tabs v-else v-model="type" @tab-click="getPersonalResourceList" class="tab">
        <el-tab-pane label="视频" name="视频"></el-tab-pane>
        <el-tab-pane label="电子课件" name="电子课件"></el-tab-pane>
        <el-tab-pane label="电子文稿" name="电子文稿"></el-tab-pane>
        <el-tab-pane label="图片" name="图片"></el-tab-pane>
      </el-tabs>
    </div>

    <div style="margin-left: 230px;">
      <el-input placeholder="请输入内容" v-if="!personal" v-model="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchAllResourceList" type="primary"></el-button>
      </el-input>

      <el-input placeholder="请输入内容" v-else v-model="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchPersonalResourceList" type="primary"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import { queryResource, searchResource } from '../../utils/api'

export default {
  //personal为true用于检索个人上传的素材，为false检索所有资源
  props: {
    resourceList: Array,
    loading: Boolean,
    currentPage: Number,
    personal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return ({
      type: '视频',
      state: 'success',
      search: '',
    });
  },

  created() {
    if (!this.personal) {
      this.getAllResourceList();
    }
    else {
      this.getPersonalResourceList();
    }
  },

  methods: {
    //查找公开或可用的资源
    getAllResourceList(tab) {
      let list1 = [];
      this.$emit('update:loading', true);
      // 首先找到公开且上传成功的资源
      let public_param = {
        type: this.type,
        shareField: 'public',
        state: 'success'
      };
      //再查找与登录用户属于同一所院校的资源
      let school_param = {
        type: this.type,
        shareField: 'school',
        state: 'success',
        'teacher.universityID': this.$store.state.teacherInfo.universityID,
      };
      let private_param = {
        type: this.type,
        shareField: 'private',
        teacherID: this.$store.state.teacherInfo.id,
        state: 'success',
      }
      //必须嵌套查询，异步请求的反应时间可能不一致，造成数组合并失败
      // 查找公开资源
      queryResource(public_param).then(({ data }) => {
        list1 = data.data.data;
        // 查找校内资源
        queryResource(school_param).then(({ data }) => {
          let list2 = list1.concat(data.data.data);
          // 查找个人资源
          queryResource(private_param).then(({ data }) => {
            let list3 = list2.concat(data.data.data);
            this.$emit('update:resourceList', list3);
            this.$emit('update:currentPage', 1);
            this.$emit('update:loading', false);
          })
        })
      })
    },

    //查找个人资源
    getPersonalResourceList(tab) {
      let list1 = [];
      this.$emit('update:loading', true);
      // 找到个人上传成功的资源
      let personal_param = {
        type: this.type,
        state: this.state,
        teacherID: this.$store.state.teacherInfo.id,
        orderBy:'-createTime'
      };
      queryResource(personal_param).then(({ data }) => {
        list1 = data.data.data;
        //审核中包含published和first两个状态，需要查询两次
        if (this.state === 'published') {
          personal_param.state = 'first';
          queryResource(personal_param).then(({ data }) => {
            list1 = list1.concat(data.data.data);
            this.$emit('update:resourceList', list1);
            this.$emit('update:currentPage', 1);
            this.$emit('update:loading', false);
          })
        }
        else {
          this.$emit('update:resourceList', list1);
          this.$emit('update:currentPage', 1);
          this.$emit('update:loading', false);
        }
      })
    },
    handleStateChange(tab) {
      this.type = null;
    },

    searchAllResourceList() {
      let list1 = [];
      this.$emit('update:loading', true);
      // 首先找到公开且上传成功的资源
      let public_param = {
        type: this.type,
        keyword: this.search,
        shareField: 'public',
        state: 'success'
      };
      //再查找与登录用户属于同一所院校的资源
      let school_param = {
        type: this.type,
        keyword: this.search,
        shareField: 'school',
        state: 'success',
        'teacher.universityID': this.$store.state.teacherInfo.universityID,
      };
      let private_param = {
        type: this.type,
        keyword: this.search,
        shareField: 'private',
        teacherID: this.$store.state.teacherInfo.id,
        state: 'success',
      }
      //必须嵌套查询，异步请求的反应时间可能不一致，造成数组合并失败
      // 查找公开资源
      searchResource(public_param).then(({ data }) => {
        list1 = data.data.data;
        // 查找校内资源
        searchResource(school_param).then(({ data }) => {
          let list2 = list1.concat(data.data.data);
          // 查找个人资源
          searchResource(private_param).then(({ data }) => {
            let list3 = list2.concat(data.data.data);
            this.$emit('update:resourceList', list3);
            this.$emit('update:currentPage', 1);
            this.$emit('update:loading', false);
          })
        })
      })
    },

    searchPersonalResourceList() {
      let list1 = [];
      this.$emit('update:loading', true);
      // 找到个人上传成功的资源
      let personal_param = {
        type: this.type,
        state: this.state,
        keyword: this.search,
        teacherID: this.$store.state.teacherInfo.id,
      };
      searchResource(personal_param).then(({ data }) => {
        list1 = data.data.data;
        //审核中包含published和first两个状态，需要查询两次
        if (this.state === 'published') {
          personal_param.state = 'first';
          searchResource(personal_param).then(({ data }) => {
            list1 = list1.concat(data.data.data);
            this.$emit('update:resourceList', list1);
            this.$emit('update:currentPage', 1);
            this.$emit('update:loading', false);
          })
        }
        else {
          this.$emit('update:resourceList', list1);
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