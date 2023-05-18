import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    teacherInfo: null,
    userInfo: null,
  },
  mutations: {
    login(state, [teacher, user]) {
      // console.log(user);
      // console.log(teacher);
      sessionStorage.setItem('token', user.token)
      state.teacherInfo = teacher;
      state.userInfo = user
    },
    logout(state) {
      state.userInfo = null
      state.teacherInfo = null
      sessionStorage.removeItem('token')
    },
    updateTeacher(state, teacher) {
      state.teacherInfo.password = teacher.password ? teacher.password : state.teacherInfo.password;
      state.teacherInfo.phonenum = teacher.phonenum ? teacher.phonenum : state.teacherInfo.phonenum;
    },
    updateTeacherAvatar(state, avatar) {
      state.teacherInfo.avatar = avatar ? avatar : state.teacherInfo.avatar;
    }
    // updateUserPageState(state, current) {
    //   state.pageState.user = current
    // },
    // updateOnlinePageState(state, current) {
    //   state.pageState.online = current
    // },
    // updateRolePageState(state, current) {
    //   state.pageState.role = current
    // },
    // updateQuartzPageState(state, current) {
    //   state.pageState.quartz = current
    // },
    // updateFriendLinkPageState(state, current) {
    //   state.pageState.current = current
    // }
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
