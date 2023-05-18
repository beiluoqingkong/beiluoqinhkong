<template>
  <div v-loading="loading" style="margin-bottom: 40px;min-height: 200px;">
    <h2 v-if="showList.length==0" style="margin-top: 100px;margin-left: 25%;">案例列表为空，快去发布吧~</h2>
    <el-row v-for="(r_list, index) of showList" :key="index" style="margin-left: -20px; margin-top: 20px;">
        <el-col :span="4" v-for="(item, innerindex) of r_list" :key="item.id" :offset="innerindex > 0 ? 2 : 1">
          <Ideocase :ideocase="item" style="width: 250px;" :modify="modify"></Ideocase>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import Ideocase from '../../components/ideocase/ideocase.vue'
export default {
  components: {
    Ideocase,
  },
  props: {
    showList: Array,
    loading: Boolean,
    modify: {
      type: Boolean,
      default:true
    }
  }
}
</script>

<style>

</style>