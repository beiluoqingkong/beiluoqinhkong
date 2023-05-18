<template>
  <div class="video-ali">
    <!-- 使用阿里云视频播放器，支持mp4,wmv等多种格式 -->
    <vue-aliplayer-v2 :source="videoUrl" ref="VueAliplayerV2" :options="options" />
  </div>
</template>

<script>
export default {
  props: ['videoUrl'],
  data() {
    return {
      options: {
        // source:'//player.alicdn.com/video/aliyunmedia.mp4',
        isLive: false, //切换为直播流的时候必填
        // format: 'm3u8'  //切换为直播流的时候必填
      },
      source: "http://127.0.0.1/ideo_resource/1651170112222265344.mp4",
      // source: '//ivi.bupt.edu.cn/hls/cctv1.m3u8',
    };
  },

  methods: {
    play() {
      this.$refs.VueAliplayerV2.play();
    },

    pause() {
      this.$refs.VueAliplayerV2.pause();
    },

    replay() {
      this.$refs.VueAliplayerV2.replay();
    },

    getStatus() {
      const status = this.$refs.VueAliplayerV2.getStatus();
      console.log(`getStatus:`, status);
      alert(`getStatus:${status}`);
    },

    showMultiple() {
      this.isShowMultiple = !this.isShowMultiple;
    },
  },
}
</script>

<style scope>
.video-ali {
  height: 400px;
  width: 540px;
}
</style>