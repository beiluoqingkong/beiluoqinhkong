<template>
  <div>
    <Video :videoUrl="videourl"></Video>
  </div>
</template>
<script>
import Video from '../../components/file/video.vue'
export default {
  components: {
    Video
  },
  data() {
    return {
      videourl:'http://127.0.0.1/ideo_resource/1651849318312706048.mkv',
    }
  }
};
</script>
