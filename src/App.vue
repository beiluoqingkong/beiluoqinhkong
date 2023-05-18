<template>
  <div id="app">
    <div class="app_head">

      <div id="icon">
        <el-image :src="require('@/assets/img/head/icon.png')" @click="backHome"></el-image>
      </div>

      <div id="title">
        <el-image :src="require('@/assets/img/head/title.png')"></el-image>
      </div>

      <div id="head_search">
        <!-- <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input> -->
      </div>

      <div id="notice">
        <el-badge :value="unread" class="item" type="primary">
          <div class="el-icon-bell"></div>
        </el-badge>
      </div>

      <!-- 头像显示 -->
      <el-dropdown v-if="$store.state.teacherInfo == null" class="avatar">
        <!-- el-dropdown默认为hover   el-dropdown-link为悬停展示的标签-->
        <span class="el-dropdown-link">
          <el-avatar style="scale: 1.65;" class="photo"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown" style="width: 250px;text-align: center;">
          <!-- el-dropdown-item点击事件要配置@click.native，这样可以阻止原生的点击事件 -->
          <el-dropdown-item @click.native="dialogVisible = true" icon="el-icon-user">欢迎登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>


      <!-- 头像显示 -->
      <el-dropdown v-else class="avatar">
        <!-- el-dropdown默认为hover   el-dropdown-link为悬停展示的标签-->
        <span class="el-dropdown-link">
          <el-avatar id="head-avatar" style="scale: 1.65;" class="photo"
            :src="'http://localhost:47581/api/Attachment/getImage?file=' + $store.state.teacherInfo.avatar"></el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown" style="width: 250px;text-align: center;">
          <!-- el-dropdown-item点击事件要配置@click.native，这样可以阻止原生的点击事件 -->
          <el-dropdown-item @click.native="routerJump('/teacher')" icon="el-icon-location">消息列表</el-dropdown-item>
          <el-dropdown-item @click.native="routerJump('/teacher/ideocase')" icon="el-icon-menu">案例管理</el-dropdown-item>
          <el-dropdown-item @click.native="routerJump('/teacher/resource')"
            icon="el-icon-document">素材管理</el-dropdown-item>
          <el-dropdown-item @click.native="routerJump('/teacher/user')" icon="el-icon-setting">个人信息</el-dropdown-item>
          <el-dropdown-item @click.native="logout()" icon="el-icon-setting">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>


      <!-- 登录对话框，输入手机号和密码即可完成登录 -->
      <el-dialog title="欢迎登录" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span slot="footer" class="dialog-footer">

          <el-form label-position="left" label-width="80px" :rules="rules" status-icon ref="loginForm" :model="loginForm">
            <el-form-item label="手机号" prop="phonenum">
              <el-input v-model="loginForm.phonenum" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <el-button type="primary" @click="login">确 定</el-button>
          <el-button @click="resetForm()">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 可变页面 -->
    <router-view />
  </div>
</template>

<script lang="js">
import { generaMenu } from '@/assets/js/menu'
import { teacherLogin, testLogin, queryUnreadMessage } from './utils/api'

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
    // 密码校验规则
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };

    return {
      search: '',
      dialogVisible: false,
      unread: 0,
      teacher: {},
      user: {},
      loginForm: {
        password: '',
        phonenum: '',
      },
      rules: {
        // 与prop绑定的校验规则
        phonenum: [{
          validator: checkPhonenum,
          trigger: 'blur'
        }],
        password: [{
          validator: validatePass,
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    if (this.$store.state.teacherInfo) {
      queryUnreadMessage(this.$store.state.teacherInfo.id).then(({ data }) => {
        this.unread = data.data.data.length;
      })
    }
  },
  methods: {
    //登录方法
    login() {
      teacherLogin(this.loginForm).then(({ data }) => {
        this.teacher = data.data;
        //使用test用户身份登录/user/login，拿到token
        testLogin().then((res) => {
          this.user = res.data.data;
          // console.log(this.user);
          //  保存到vuex，传递多个参数时需要在mutations定义数组
          this.$store.commit('login', [this.teacher, this.user]);
        });

        // 查询未读信息
        queryUnreadMessage(this.teacher.id).then(({ data }) => {
          this.unread = data.data.data.length;
        })

        this.$message({
          showClose: true,
          message: '登录成功!',
          type: 'success'
        });
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: '登录失败...',
          type: 'error'
        })
      });

      this.dialogVisible = false;
    },

    // 退出登录
    logout() {
      this.$store.commit('logout');
      this.$router.push('/');
    },

    // 清空表单
    resetForm() {
      this.$refs['loginForm'].resetFields();
      this.dialogVisible = false;
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },

    backHome() {
      this.$router.push('/');
    },

    // 路由跳转
    routerJump(url) {
      this.$router.push(url);
    }
  }
}
</script>
<style>
.app_head {
  position: relative;
  text-align: left;
  display: flex;
  width: 100%;
  background-color: #ED4A4A;
  height: 120px;
  margin-bottom: 40px;
}

#icon {
  width: 70px;
  position: relative;
  padding-left: 5%;
  padding-top: 20px;
}

#icon:hover{
  cursor: pointer;
}

#title {
  width: 350px;
  position: relative;
  padding-left: 5%;
  padding-top: 45px;
}

#head_search {
  width: 370px;
  padding-left: 3%;
  padding-top: 40px;
}

#notice {
  color: aliceblue;
  font-size: 35px;
  padding-left: 10%;
  padding-top: 31px;
}

.avatar {
  margin-left: 12%;
  padding-right: 7.2%;
  margin-top: 37px;
}
</style>