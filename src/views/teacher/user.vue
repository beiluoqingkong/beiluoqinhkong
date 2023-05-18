<template>
  <el-card style="height: 590px;width: 1000px;margin-bottom: 20px;">
    <h2>个人信息</h2>
    <div class="teacher">
      <div class="teacher-avatar">
        <el-avatar id="avatar" class="photo" :src="IP + '/api/Attachment/getImage?file=' + loginForm.avatar"></el-avatar>
        <!-- 使用ref，可以在<script>中通过this.$refs['xxx']获取到dom对象 -->
        <el-upload ref="upload" class="upload-demo" :limit="1" :on-exceed="handleExceed" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :http-request="upload_Avatar" action="string">
          <el-button size="small" type="primary">修改头像</el-button>
          <div slot="tip" class="el-upload__tip">可以上传jpg/png/gif文件</div>
        </el-upload>
      </div>

      <el-card class="teacher-detail">
        <el-form label-position="left" label-width="80px" :rules="rules" status-icon ref="loginForm" :model="loginForm">
          <el-form-item label="学校代码">
            <el-input autocomplete="off" :placeholder="$store.state.teacherInfo.university.code" disabled></el-input>
          </el-form-item>
          <el-form-item label="入职院校">
            <el-input autocomplete="off" disabled :placeholder="$store.state.teacherInfo.university.name"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input autocomplete="off" disabled :placeholder="$store.state.teacherInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phonenum">
            <el-input v-model="loginForm.phonenum" autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldpassword">
            <el-input type="password" v-model="loginForm.oldpassword" autocomplete="off"
              placeholder="初始密码为admin"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-button type="primary" class="submit" style="margin-left: 42%;" @click="updateTeacher()">确 定</el-button>
          <!-- <el-button @click="resetForm()">取 消</el-button> -->
        </el-form>
      </el-card>

    </div>
  </el-card>
</template>

<script>
import { updateTeacher, teacherLogin } from '../../utils/api'
import API_CONFIG from '../../../vue.config';

export default {
  data() {
    // 手机号校验规则
    var checkPhonenum = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('手机号不应为空'));
      }
      else {
        let mPattern = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
        if (mPattern.test(value)) {
          callback();
        } else {
          callback(new Error('手机号应为11位数字!'));
        }
      }
    };
    // 旧密码不为空
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else {
        callback();
      }
    };
    // 新密码不能等于旧密码
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value === this.loginForm.oldpassword) {
        callback(new Error('两次输入密码不能一样!'));
      } else {
        callback();
      }
    };
    return {
      ideotypes: [],
      IP: '',
      loginForm: {
        phonenum: null,
        avatar: null,
        password: null,
        oldpassword: null
      },
      rules: {
        // 与prop绑定的校验规则
        phonenum: [{
          validator: checkPhonenum,
          trigger: 'blur'
        }],
        oldpassword: [{
          validator: validateOldPass,
          trigger: 'blur'
        }],
        password: [{
          validator: validatePass,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.loginForm.avatar = this.$store.state.teacherInfo.avatar;
    this.loginForm.phonenum = this.$store.state.teacherInfo.phonenum;
    //获取devServer中'/api'对应的目标地址
    this.IP = API_CONFIG.devServer.proxy['/api'].target;
  },
  methods: {
    updateTeacher() {
      let params = {};
      params.phonenum = this.loginForm.phonenum;
      params.password = this.loginForm.oldpassword;

      teacherLogin(params).then(({ data }) => {
        //更新vuex中的教师信息
        this.$store.commit('updateTeacher', this.loginForm);
        console.log(this.$store.state.teacherInfo);
        updateTeacher(this.$store.state.teacherInfo).then(({ data }) => {
          // 刷新
          this.$router.go(0);
          this.$message({
            showClose: true,
            message: '修改成功!',
            type: 'success'
          });
        })

      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: '修改失败，旧密码输入不正确!',
          type: 'error'
        })
      });
    },
    beforeAvatarUpload(file) {
      const isRight = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isRight) {
        this.$notify.warning('图片只能是jpg/png/gif格式!');
        return false;
      }
      return true;
    },
    handleExceed() {
      this.$notify.warning('一次只能上传一张图片！')
    },
    upload_Avatar(param) {
      // 传递参数最好用let或const，否则容易出现参数为空或者其他问题
      const formData = new FormData();
      formData.append('file', param.file);
      this.axios.post('/api/Attachment/add', formData).then(({ data }) => {
        this.loginForm.avatar = data.data[0];
        //清空el-upload的上传列表
        this.$refs['upload'].clearFiles();
        // console.log(this.$refs['upload']);
        // 修改vuex中的教师信息
        this.$store.commit('updateTeacherAvatar', data.data[0]);
        //修改数据库中的教师信息
        updateTeacher(this.$store.state.teacherInfo).then(({ data }) => {
          //清空el-upload列表，通过this对象即可获得，this即为当前使用的el-upload
          this.$notify({
            showClose: true,
            message: '头像修改成功!',
            type: 'success'
          });
        })
      }).catch(err => {
        this.$notify.warning('头像修改失败！')
      })
    }
  },
}
</script>

<style scoped>
.teacher {
  display: flex;
}

.teacher-avatar {
  margin-left: 20%;
  margin-top: 14%;
  text-align: center;
}

.teacher-detail {
  float: right;
  margin-left: 18%;
  width: 50%;
}

.teacher-detail>.el-form{
  margin-right: 10px;
}

.upload-demo {
  margin-top: 110px;
}

.upload-demo>div {
  display: inline-flex;
}

#avatar {
  scale: 4.0;
  transition: 0.6s;
  position: relative;
}

#avatar:hover {
  scale: 6.0;
  transition: 0.6s;
}
</style>