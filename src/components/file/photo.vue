<template>
  <el-image :src="img_url" id="photo" :preview-src-list="preview_list"></el-image>
</template>

<script>
export default {
  props: ['img_url','preview_list']
}
</script>

<style >
#photo {
  width: 200px;
  transition: 0.5s;
}
</style>