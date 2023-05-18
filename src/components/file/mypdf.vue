<template>
  <div>
    <!-- pdf组件支持跨域访问，一样按照/api的设定来就可以了 -->
    <!-- <pdf :src="'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf'"></pdf> -->
    <el-card style="width:700px;height: 520px;overflow:auto;margin-bottom: 0px;">
      <pdf  v-for="i in numPages" :key="i" :src="url" :page="i" ></pdf>	
    </el-card>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  props:['url'],
  data() {
    return {
      numPages: 1,
    }
  },
  created() {
    // this.getNumPages(transUrl(this.url));
    this.getNumPages(this.url)
  },
  methods: {
    getNumPages(url) {
      let loadingTask = pdf.createLoadingTask(url);
      loadingTask.promise.then(pdf => {
        this.url = loadingTask
        this.numPages = pdf.numPages
      }).catch((err) => {
        console.error('pdf加载失败')
      })
    },
    
  }
}
</script>