<template>
  <div>
    <!-- ppt的预览的两种方式：
    1、使用公网IP的话，直接使用微软接口预览即可
    2、使用局域网的话，只能尝试将ppt转换为pdf，前端再将pdf转为html
    这里使用kkFileView的接口对ppt进行解析 -->
    <iframe sandbox="allow-scripts allow-top-navigation allow-same-origin allow-popups" 
    :src="'http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url))" frameborder="0"
      style=" z-index: 1000;height:500px;width:790px;scale: 0.95;">
    </iframe>
  </div>
</template>

<script>
// 导入Base64
import { Base64 } from 'js-base64';
import md5 from 'js-md5';
export default {
  props: ['url'],
  data() {
    return ({
      Base64:Base64,
    })
  },
}
</script>

<style></style>