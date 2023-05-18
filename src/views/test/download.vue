<template>
  <el-card>
    <el-button @click="save('/api/2010/05/sintel/trailer.mp4')">
      下载 downloadjs
    </el-button>
    <el-progress :percentage="percentage" style="width: 190px;"></el-progress>
  </el-card>
</template>

<script>
import { saveAs } from "file-saver";
import download from 'downloadjs';

export default {
  created() { },
  data() {
    return {
      loading: true,
      keywords: "",
      resources: [],
      addModule: false,
      addResource: false,
      resourceForm: {},
      percentage: 0
    };
  },
  methods: {
    save(url) {
      // saveAs(url, "qq.jpg");
      let fileName = url.split("/").pop().split("?")[0];
      download(url);
      this.percentage = 0;
      let timer = setInterval(() => {
        var total = Number(sessionStorage.getItem(fileName + '-total'));
        var present = Number(sessionStorage.getItem(fileName + '-present'));
        this.percentage = (present / total).toFixed(3) * 100;
        this.percentage = this.percentage > 100 || isNaN(this.percentage) ? 100 : this.percentage;
        // console.log('total=' + total + '      present=' + present + '     %' + this.percentage);
        if (present >= total) {
          sessionStorage.removeItem(fileName + '-total');
          sessionStorage.removeItem(fileName + '-present');
          clearInterval(timer);
        }
      }, 1000);
    },
  },
};
</script>
