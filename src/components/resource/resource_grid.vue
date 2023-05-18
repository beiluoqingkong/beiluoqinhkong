<template>
  <div v-loading="loading" style="margin-bottom: 40px;min-height: 200px;">
    <h2 v-if="showList.length==0" style="margin-top: 100px;margin-left: 25%;">素材列表为空，快去上传吧~</h2>
    <el-row v-for="(r_list, index) of showList" :key="index" style="margin-left: -20px; margin-top: 20px;">
      <el-col :span="4" v-for="(item, innerindex) of r_list" :key="item.id" :offset="innerindex > 0 ? 2 : 1">
        <Resource :resource="item" :modify="modify" style="width: 250px;"></Resource>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '../../components/resource/resource.vue'
export default {
  components: {
    Resource,
  },
  props: {
    showList: Array,
    loading: Boolean,
    modify: {
      type: Boolean,
      default: false
    },
  }
}
</script>

<style></style>