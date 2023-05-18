<template>
  <div>
    <el-button v-if="!isCollapse" icon="el-icon-s-fold" @click="changeShow"></el-button>
    <el-button v-else  icon="el-icon-s-unfold" @click="changeShow"></el-button>
    <!-- el-menu开启 router属性，即可搭配路由使用 -->
    <el-menu :default-active="$route.path" class="menu_item_list" background-color="#545c64" text-color="#fff"
      active-text-color="#ffd04b" :collapse="isCollapse"  router>
      <el-menu-item index="/teacher">
        <i class="el-icon-location"></i>
        <span slot="title">消息列表</span>
      </el-menu-item>
      <el-menu-item index="/teacher/ideocase">
        <i class="el-icon-menu"></i>
        <span slot="title">案例管理</span>
      </el-menu-item>
      <el-menu-item index="/teacher/resource">
        <i class="el-icon-document"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/teacher/user">
        <i class="el-icon-setting"></i>
        <span slot="title">个人信息</span>
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
 /* 当不折叠的时候宽度才是250 */
.menu_item_list:not(.el-menu--collapse){
  width: 250px;
}
.menu_item_list .el-menu-item {
  margin-top: 15px;
  font-size: 15px;
}
.el-button {
  background-color: #545c64;
  color: #fff;
  border-width: 0px;
   /* 修改图标大小用font-size即可 */
  font-size: 23px;
}
</style>