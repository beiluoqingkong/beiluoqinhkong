<template>
  <div class="upload-demo">
    <el-upload ref="upload" drag :limit="1" :on-exceed="handleExceed" :show-file-list="true" :on-progress="handleProgress"
      :on-remove="removeFile" :before-upload="beforeFileUpload" :http-request="upload_File" action="string">
      <div style="margin-top: 50px;"><i class="el-icon-picture-outline" style="font-size: 32px;"></i></div>
      <div class="el-upload__text">将封面拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__text"> <br/> (&nbsp;支持图片格式:&nbsp; &nbsp; jpg/ png/ gif &nbsp;)</div>
    </el-upload>
    <div v-if="uploading" class="progress">
      <el-progress :percentage="progressPercent" :stroke-width="10" style="width: 400px;"> </el-progress>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '../../utils/api.js'
export default {
  props: ['fileUrl', 'suffix'],
  data() {
    return {
      uploading: false,
      progressPercent: 0,
    }
  },
  methods: {
    beforeFileUpload(file) {
      let filename = file.name;
      let file_suffix = '.' + filename.split('.')[filename.split('.').length - 1];
      const list = ['.jpg', '.png', '.gif'];
      // console.log(list.indexOf(file_suffix));
      if (list.indexOf(file_suffix) < 0) {
        this.$notify.warning('文件格式不规范！');
        return false;
      }
      this.$emit('update:suffix', file_suffix);
      return true;
    },
    handleExceed() {
      this.$notify.warning('一次只能上传一个文件！')
    },
    handleProgress(event) {
      console.log(event)
      if (this.progressPercent < 99) {
        this.progressPercent = parseInt(event.percent)
      }
    },
    upload_File(param) {
      this.uploading = true;
      const form = new FormData();
      form.append('formFile', param.file);
      uploadFile(form).then(({ data }) => {
        // this.fileUrl = data.data;  props是父组件传的值，不能直接修改
        this.progressPercent = 100;
        this.$notify.success('文件已成功上传！');
        this.$emit('update:fileUrl', data.data);
        console.log(data.data);
      })
    },
    removeFile(file) {
      this.uploading = false;
      this.$emit('update:fileUrl', null);
      this.progressPercent = 0;
    }
  }
}
</script>

<style scoped>
.upload-demo {
  width: 390px;
  height: 255px;
}

.progress {
  display: flex;
}
</style>