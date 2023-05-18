<template>
  <div class="layout">
    <!-- 左侧导航 -->
    <div v-if="isCollapse" style="width: 79px;transition: 0.7s;" class="menu">
      <Menu :isCollapse="isCollapse" @changeShow="changeShow"></Menu>
    </div>
    <div v-else style="width: 265px;transition: 0.3s;" class="menu">
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
  mounted() {
    if (!this.$store.state.teacherInfo) {
      this.$notify.error('用户尚未登录!')
      this.$router.push('/');
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
.layout {
  display: flex;
}

.menu {
  background: #545c64;
  /* height: 1000px; */
  /* width: 79px; */
  /* transition: 0.5s; */
  left: 0;
  top: 120px;
  bottom: 0;
}

.content {
  float: left;
  /* height: 900px; */
  overflow: hidden;
  /* padding-left: 250px; */
  margin-left: 6%;
}

.small {
   /* padding-left: 70px; */
  margin-left: 60px;
}
</style>