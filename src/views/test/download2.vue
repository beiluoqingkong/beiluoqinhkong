<template>
  <el-card>
    <el-button @click="download('/api/2010/05/sintel/trailer.mp4')">
      下载click
    </el-button>
  </el-card>
</template>

<script>
import streamSaver from 'streamsaver'

export default {
  created() { },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    download(url) {
      let filename = url.split('/')[url.split('/').length - 1];
      fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        // headers: {
        //   'xxxx': 'xxxx'
        // }
      }).then(res => {
        this.$notify.success({
          title: "开始下载",
          message: '正在下载' + filename + '......',
        })
        const fileStream = streamSaver.createWriteStream(filename, {
          size: res.headers.get("content-length")
        })
        const readableStream = res.body

        // more optimized
        if (window.WritableStream && readableStream.pipeTo) {
          return readableStream.pipeTo(fileStream)
            .then(() => {
              console.log('done writing')
              this.$notify.success({
                title: "下载成功",
                message: filename + '已下载完毕',
              })
            })
        }

        window.writer = fileStream.getWriter()

        const reader = res.body.getReader()
        const pump = () => {
          reader.read().then(res => {
            if (res.done) window.writer.close();
            else window.writer.write(res.value).then(pump)
          })
        }

      })
    },
  },
};
</script>
