<template>
  <div>
    <el-button @click="start()">预览</el-button>
    <!-- pdf组件支持跨域访问，一样按照/api的设定来就可以了 -->
    <!-- <pdf :src="'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf'"></pdf> -->
    <el-card style="width: 50%;height: 600px;overflow:auto;">
      <!-- <pdf  v-for="i in numPages" :key="i"  :src="url" :page="i" ></pdf>	 -->
      <el-upload class="upload-demo" :limit="1" :on-exceed="handleOnExceed" drag :http-request="uploadFile" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">单个文件大小不超过500Mb</div>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  components: {
    pdf
  },
  data() {
    return {
      url: '',
      numPages: 1,
    }
  },
  methods: {
    start() {
      // this.getNumPages("/api/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf");
      this.axios.get('/api/Resource/get', {
        params: {
          id: '1648502758665355264'
        }
      }).then(({ data }) => {
        console.log(data);
      })
    },
    getNumPages(url) {
      let loadingTask = pdf.createLoadingTask(url);
      loadingTask.promise.then(pdf => {
        this.url = loadingTask
        this.numPages = pdf.numPages
      }).catch((err) => {
        console.error('pdf加载失败')
      })
    },
    handleOnExceed() {
      this.$notify.warning('一次只能上传一个文件！');
    },
    uploadFile(params) {
      const file = params.file;
      // 使用FormData传参数和文件
      var form = new FormData();
      // 文件
      form.append("formFile", file);
      let param = {
        name: 'fz 测试文件4',
        intro: 'fz 测试文件上传',
        type_id: '1631218862445821952',
        target_id: '1631219067815723008',
        share_field: 'everyone',
        teacher_id: '1'
      }
      this.axios.post('/api/Resource/add?name='+param.name+'&intro='+param.intro+"&type_id="+param.type_id+"&target_id="+param.target_id+"&share_field="+param.share_field+"&teacher_id="+param.teacher_id, form).then(({ res }) => {
        console.log(res);
      })
    }
  }
}
</script>