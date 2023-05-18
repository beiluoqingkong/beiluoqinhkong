<template>
  <el-card v-loading="loading">
    <h3>请填写素材信息</h3>
    <el-form ref="resource" :model="resource" label-width="80px">
      <el-form-item label="素材名称">
        <el-input v-model="resource.name"></el-input>
      </el-form-item>

      <el-form-item label="素材介绍">
        <el-input type="textarea" rows="7" v-model="resource.intro"></el-input>
      </el-form-item>

      <div style="display: flex;margin-top: 50px;margin-bottom: -10px;">
        <el-form-item label="思政类别">
          <el-select ref="ideoType" v-model="resource.typeID" placeholder="请选择思政类别" @change="changeSelect">
            <el-option v-for="item in ideoTypeList" :key="item.id" :label="item.typeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="思政目标" style="margin-left: 12%;">
          <el-select ref="ideoTarget" v-model="resource.targetID" placeholder="请选择思政目标">
            <el-option v-for="item in ideoTargetList" :key="item.id" :label="item.targetName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="分享范围">
        <el-radio-group v-model="resource.shareField">
          <el-radio label="private">仅私人可见</el-radio>
          <el-radio label="school">校内公开</el-radio>
          <el-radio label="public">公开</el-radio>
        </el-radio-group>
      </el-form-item>

      <div>
        <el-image :src="require('@/assets/img/icon/uploadfile.png')" style="scale: 0.45;margin-left: -60px;"></el-image>
        <!-- 导入自定义文件上传组件，同步sync必须带，否则修改不成功 -->
        <myUpload :fileUrl.sync="resource.path" :suffix.sync="resource.suffix"
          style="scale: 1.25;margin-top: 4%;margin-left:30%;margin-bottom: 3%; ">
        </myUpload>
        <div class="tips">
          <div class="el-upload__tip" slot="tip">*支持图片格式:&nbsp; &nbsp; jpg/ png/ gif</div>
          <div class="el-upload__tip" slot="tip">*支持文档格式:&nbsp; &nbsp; pdf/ doc/ docx/ pptx/ ppt</div>
          <div class="el-upload__tip" slot="tip">*支持视频格式:&nbsp; &nbsp; mp4/ mkv</div>
        </div>
      </div>

      <el-form-item style="text-align: center;">
        <el-button @click="save_Resource" id="save">保存</el-button>
        <el-button type="primary" @click="add_Resource" id="submit">发布</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import myUpload from '../../../components/resource/upload.vue'
import { getAllIdeoType, getIdeoTargetListByTypeId, addResource, saveResource, queryResource } from '../../../utils/api.js'

export default {
  components: {
    myUpload
  },
  data() {
    return {
      routeId:null,
      ideoTypeList: [],
      ideoTargetList: [],
      loading: false,
      resource: {
        name: '',
        intro: '',
        suffix: '',
        path: '',
        teacherID: '',
        typeID: '',
        targetID: '',
        shareField: ''
      }
    }
  },
  created() {
    this.resource.teacherID = this.$store.state.teacherInfo.id;
    getAllIdeoType().then(({ data }) => {
      // console.log(data.data.data);
      this.ideoTypeList = data.data.data;
    })
    this.routeId = this.$route.params.resourceId;
    if (this.routeId) {
      let param = {};
      param.id = this.routeId;
      queryResource(param).then(({ data }) => {
        this.resource = data.data.data[0];
        this.resource.typeID = data.data.data[0].target.type.id;
        // 初试状态下，要根据类型的ID获取相应的思政目标，否则会显示异常
        this.changeSelect(this.resource.typeID);
        this.resource.targetID = data.data.data[0].target.id;
        console.log(this.resource);
      });
    }

  },
  methods: {
    // el-select自带方法，当选择项发生变化时就能触发，res为当前选择项的value
    changeSelect(res) {
      this.resource.targetID = null;
      getIdeoTargetListByTypeId(res).then(({ data }) => {
        this.ideoTargetList = data.data.data;
      })
    },
    save_Resource() {
      this.loading = true;
      saveResource(this.resource).then(({ data }) => {
        // console.log(data);
        this.$notify.success('素材保存成功！')
        this.$router.push({ path: '/teacher/resource' })
        this.loading = false;
      }).catch(err => {
        this.$notify.warning('素材保存失败！')
        this.loading = false;
      });
    },
    add_Resource() {
      this.loading = true;
      addResource(this.resource).then(({ data }) => {
        // console.log(data);
        this.$notify.success('素材添加成功！')
        this.loading = false;
        this.$router.push({ path: '/teacher/resource' })
      }).catch(err => {
        this.$notify.warning('素材添加失败！')
        this.loading = false;
      });
    }
  },
}
</script>

<style scoped>
.el-card {
  width: 900px;
  margin-bottom: 50px;
}

.el-form>.el-form-item {
  margin-top: 35px;
}

#save {
  margin-top: 20px;
  margin-right: 25%;
}

.tips>.el-upload__tip {
  margin-left: 25px;
  font-size: 15px;
  font-family: 'Microsoft YaHei', Tahoma, Geneva, Verdana, sans-serif;
}
</style>