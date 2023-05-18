<template>
  <div style="width: 100%;">
    <!-- <img :src="'http://localhost:47581/api/Attachment/getImage?file=202304\\1649020756517978112.jpg'"> -->
    <myppt :url="'http://127.0.0.1/ideo_resource/1651872182613049344.pptx'"></myppt>
    <h2 style="position: absolute;top: 200px;">山水美景</h2>
  </div>
</template>

<script>
import myppt from '../file/myppt.vue';
import md5 from 'js-md5';

export default {
  components: {
    myppt
  },
  data() {
    return ({
      Base64:require('js-base64').Base64,
    })
  },
  created() {
    // let Base64 = require('js-base64').Base64;
  }
}
</script>

<style></style>