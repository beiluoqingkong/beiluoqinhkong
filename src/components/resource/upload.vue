<template>
  <div class="upload-demo">
    <el-upload ref="upload" drag :limit="1" :on-exceed="handleExceed" :show-file-list="true"
      :on-remove="removeFile" :before-upload="beforeFileUpload" :http-request="upload_File" action="string">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

    </el-upload>
    <div v-if="uploading" class="progress">
      <!-- 不使用sync，数据会出现不同步的情况，使用sync可以动态变化 -->
      <el-progress :percentage="progressPercent" :stroke-width="10" style="width: 400px;"> </el-progress>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '../../utils/api.js'
import axios from 'axios';

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
      const list = ['.jpg', '.png', '.gif', '.pdf', '.doc', '.docx', '.pptx', '.ppt', '.mp4', '.m3u8', '.mkv'];
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

    upload_File(param) {
      // 使用局部变量that，因为在onUploadProgress中无法改变this变量的值
      var that = this;
      this.uploading = true;
      const form = new FormData();
      form.append('formFile', param.file);
      // 使用xhr记录下载进度条
      axios({
        method: "post",
        url: "/api/Resource/upload",
        data: form,
        onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
          if (progressEvent.lengthComputable) {
            // 局部函数无法改变全局变量this，只能通过that进行修改
            that.progressPercent = parseInt(progressEvent.loaded / progressEvent.total * 100); // 动态获取文件上传进度
            if (that.progressPercent >= 100) {
              that.progressPercent = 100;
            }
          }
        },
      }).then(({ data }) => {
        // this.fileUrl = data.data;  props是父组件传的值，不能直接修改
        // this.progressPercent = 100;
        this.$notify.success('文件已成功上传！');
        this.$emit('update:fileUrl', data.data);
        console.log(data.data);
      })
    },
    removeFile(file) {
      this.uploading = false;
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