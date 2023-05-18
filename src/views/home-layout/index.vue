<template>
  <div class="layout">
    <!-- 左侧导航 -->
    <div style="transition: 0.3s;" class="menu">
      <Menu :isCollapse="isCollapse" @changeShow="changeShow"></Menu>
    </div>
    <!-- 右侧内容 -->
    <!-- 动态绑定一个class -->
    <div class="content" :class="{ small: isCollapse }">
      <Content></Content>
    </div>
  </div>
</template>

<script>
import Content from './content/content.vue'
import Menu from './menu/menu.vue'
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  // 导入组件，可在标签中使用
  components: {
    Menu,
    Content
  },
  methods: {
    changeShow() {
      this.isCollapse = !this.isCollapse;
    }
  }
}
</script>

<style scoped>
.menu {
  width: 100%;
  /* transition: 0.5s; */
  left: 0;
  bottom: 0;
  margin-top:-35px;
}

.content {
  float: left;
  /* height: 900px; */
  overflow: hidden;
  margin-left: 6%;
}

.small {
   /* padding-left: 70px; */
  margin-left: 60px;
}
</style>