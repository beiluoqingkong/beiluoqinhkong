<template>
  <div class="word-wrap" v-loading="loading">
    <el-card style="width: 90%;">
      <div style="height: 520px;overflow: auto;margin-bottom: 0px;">
        <div id="wordView" v-html="wordText" />
      </div>
    </el-card>

  </div>
</template>

<script>
// docx文档预览(只能转换.docx文档，转换过程中复杂样式被忽，居中、首行缩进等)
import mammoth from "mammoth";
export default {
  props: ['wordURL'],
  data() {
    return {
      wordText: "",
      loading: false,
    };
  },
  mounted() {
    this.getWordText();
  },
  methods: {
    getWordText() {
      this.loading = true;
      const xhr = new XMLHttpRequest();
      xhr.open("get", this.wordURL, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = () => {
        if (xhr.status == 200) {
          //使用xhr下载文件，然后使用mammoth将文件流转换为html用于预览
          mammoth.convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) }).then((resultObject) => {
            this.$nextTick(() => {
              this.wordText = resultObject.value;
              this.loading = false;
            });
          });
        }
      };
      xhr.send();
    }
  },
};
</script>

<style lang="less" scoped>
.word-wrap {
  padding: 15px;

  img {
    width: 60%;
  }
}
</style>
