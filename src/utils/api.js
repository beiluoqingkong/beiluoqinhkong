import axios from 'axios'
import Vue from 'vue'

let apiUrl = '/api';

// 教师登录接口
export function teacherLogin(loginForm) {
  //等效于/api/Teacher/login?phonenum=xxx&password=xxx
  return axios.get(apiUrl + '/Teacher/login',
    {
      params: {
        phonenum: loginForm.phonenum,
        password: loginForm.password
      }
    });
}

//test用户登录接口
export function testLogin() {
  var params = {};
  //使用test用户登录，可以拿到token
  params.account = 'test';
  params.password = 'admin'

  return axios.post(apiUrl + '/User/login', params);
}

// 修改教师信息
export function updateTeacher(teacher) {
  return axios.put(apiUrl + '/Teacher/update', teacher);
}


// 上传文件(工具接口)，上传文件可以拿到url
export function uploadFile(data) {
  return axios.post(apiUrl + '/Resource/upload', data);
}

// 保存素材
export function saveResource(data) {
  return axios.post(apiUrl + '/Resource/save', data);
}

// 添加素材
export function addResource(data) {
  return axios.post(apiUrl + '/Resource/add', data);
}

// 获取所有思政类别
export function getAllIdeoType() {
  var params = {};
  // params.page = 1;
  // params.per = 70;
  params.orderBy = null;
  return axios.post(apiUrl + '/Ideotype/query', params);
}

// 根据思政类别ID获取当前类别下的所有思政目标
export function getIdeoTargetListByTypeId(typeId) {
  var params = {};
  params.typeID = typeId;
  return axios.post(apiUrl + '/IdeoTarget/query', params);
}

// 获取所有专业信息
export function getAllMajor() {
  var params = {};
  // params.page = 1;
  // params.per = 300;
  params.orderBy = null;
  return axios.post(apiUrl + '/Major/query', params);
}

//查询某个专业下的课程
export function getCourseListByMajorId(majorId) {
  var params = {};
  params.majorID = majorId;
  return axios.post(apiUrl + '/Course/query', params);
}

// 查询某个知识点的课程
export function getCourseListByKnowId(knowId) {
  var params = {};
  params.knowledgePointID= knowId;
  return axios.post(apiUrl + '/CourseKonwledgePoint/query', params);
}

// 获取某个课程包含的知识点
export function getKnowLedgeListByCourseId(courseId) {
  var params = {};
  params.courseID = courseId;
  return axios.post(apiUrl + '/CourseKonwledgePoint/query', params);
}

// 保存案例
export function saveIdeocase(data) {
  return axios.post(apiUrl + '/Ideocase/save', data);
}

//发布案例
export function addIdeocase(data) {
  return axios.post(apiUrl + '/Ideocase/add', data);
}

// 给案例添加资源
export function addResourceForIdeocase(case_id, id_list) {
  return axios.post(apiUrl + '/IdeocaseResource/addList?case_id=' + case_id, id_list)
}
// 删除案例的资源
export function deleteResourceForIdeocase(id_list) {
  return axios.delete(apiUrl + '/IdeocaseResource/deleteList', {
    data: id_list
  });
}

//查找素材
export function queryResource(params) {
  return axios.post(apiUrl + '/Resource/query', params);
}

//查找案例
export function queryIdeocase(param) {
  return axios.post(apiUrl + '/Ideocase/query', param);
}

//查找案例的素材
export function queryResourceForIdeocase(param) {
  return axios.post(apiUrl + '/IdeocaseResource/query', param);
}

// 查询案例的素材
export function getResourceListByCaseId(caseId, type) {
  let param = {
    'resource.type': type,
    caseID: caseId,
  };
  return axios.post(apiUrl + '/IdeocaseResource/query', param)
}


// 查找个人消息
export function queryMessage(param) {
  return axios.post(apiUrl + '/Message/query', param);
}

// 获取个人未读信息
export function queryUnreadMessage(teacher_id) {
  let param = {};
  param.receiverID = teacher_id;
  param.state = 'unread';
  return axios.post(apiUrl + '/Message/query', param);
}

//更新信息读取状态
export function updateMessageState(message) {
  message.state = 'readed';
  return axios.put(apiUrl + '/Message/update', message);
}

//修改素材
export function updateResource(resource) {
  return axios.put(apiUrl + '/Resource/update', resource);
}

//删除素材
export function deleteResource(id) {
  return axios.delete(apiUrl + '/Resource/remove?id=' + id);
}

// 修改案例
export function updateIdeocase(ideocase) {
  return axios.put(apiUrl + '/Ideocase/update', resource);
}

// 删除案例
export function deleteIdeocase(id) {
  return axios.delete(apiUrl + '/Ideocase/remove?id=' + id);
}

//根据搜索内容搜索素材，包含公开、校内、个人三类素材
export function searchResource(params) {
  params.keywordColumns = "name,target.targetName,target.type.typeName";
  return queryResource(params);
}

//根据搜索内容搜索案例，包含公开、校内、个人三类案例
export function searchIdeocase(params) {
  params.keywordColumns = "title,intro,teachingWay,course.name,course.major.name";
  return queryIdeocase(params);
}


// 查找案例的评价
export function getCommentListByCaseId(caseId,page,per) {
  let param = {
    caseID: caseId,
    orderBy: '-createTime',
    per: per,
    page:page
  }
  return axios.post(apiUrl + '/Comment/query', param);
}
// 增加评价信息
export function addComment(param) {
  return axios.post(apiUrl + '/Comment/add', param);
}
// 删除评价信息
export function deleteComment(commentId) {
  return axios.delete(apiUrl + '/Comment/remove?id=' + commentId);
}

// 批量删除评价
export function deleteCommentList(commentIdList) {
  return axios.delete(apiUrl + '/Comment/deleteList', {
    data: commentIdList
  });
}

// 根据类型查找通知公告
export function queryAnnouncement(param) {
  return axios.post(apiUrl + '/Announcement/query', param);
}

//根据Id获取通知公告的详细信息
export function getAnnouncementDetail(id) {
  return axios.get(apiUrl + '/Announcement/get?id=' + id);
}

// 获取首页轮播图信息
export function queryScroll(param) {
  return axios.post(apiUrl + '/Scroll/query', param);
}

// 查询所有课程信息
export function queryCourse(param) {
  return axios.post(apiUrl + '/Course/query', param);
}

// 查询所有知识点信息
export function queryKnowledgePoint(param) {
  return axios.post(apiUrl + '/KnowledgePoint/query', param);
}