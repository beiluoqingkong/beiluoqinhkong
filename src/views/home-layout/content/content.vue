<template>
  <div class="router_views">
    <!-- 固定内容，在这里定义的标签会固定展示在Content组件中，固定展示的下面就是router-view（可变页面） -->

    <!-- 可变内容，router-view可以直接展示子路由页面，类似于html的嵌套展示 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  }
}
</script>
