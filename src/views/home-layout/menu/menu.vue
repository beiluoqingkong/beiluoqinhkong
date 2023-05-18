<template>
  <div>
    <!-- el-menu开启 router属性，即可搭配路由使用 -->
    <el-menu :default-active="$route.path"  class="menu_item_list"  :collapse="isCollapse" mode="horizontal"  router>
      <el-menu-item index="/">
        <i class="el-icon-location"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/announce">
        <i class="el-icon-menu"></i>
        <span slot="title">通知公告</span>
      </el-menu-item>
      <el-menu-item index="/caseBox">
        <i class="el-icon-document"></i>
        <span slot="title">案例库</span>
      </el-menu-item>
      <el-menu-item index="/resourceBox">
        <i class="el-icon-setting"></i>
        <span slot="title">素材库</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
export default {
  props:['isCollapse'],
  data() {
    return {
      
    };
  },
  methods: {
    changeShow() {
      // isCollapse属性由父组件index.vue传入，所以传出changeShow方法
      // 调用父组件的changeShow，才能修改isCollapse
      this.$emit('changeShow');
    }
  }
}
</script>

<style scoped>
.menu_item_list {
  padding-top: 17px;
  margin-left: 15px;
}
.menu_item_list .el-menu-item {
  margin-left: 12%;
  font-size: 20px;
}
</style>