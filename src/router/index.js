import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/home-layout/index.vue'),
    children: [
      {
        path: '/',
        name: 'main',
        component: () => import('../views/home/main.vue')
      },
      {
        path: 'announce',
        name: 'announce',
        component: () => import('../views/home/announcementList.vue')
      },
      {
        path: 'caseBox',
        name: 'caseBox',
        component: () => import('../views/home/caseBox.vue')
      },
      {
        path: 'resourceBox',
        name: 'resourceBox',
        component: () => import('../views/home/resourceBox.vue'),
      },
    ]
  },
  {
    path: '/teacher',
    name: '用户信息页',
    component: () => import('../views/layout/index.vue'),
    children: [
      {
        path: '/',
        name: 'message',
        component: () => import('../views/teacher/messageList.vue')
      },
      {
        path: 'ideocase',
        name: 'ideocase',
        component: () => import('../views/teacher/ideocase/ideocaseList.vue')
      },
      {
        path: 'uploadIdeocase/:ideocaseId',
        name: 'uploadIdeocase',
        component: () => import('../views/teacher/ideocase/ideocase_upload.vue')
      },
      {
        path: 'uploadIdeocase',
        name: 'uploadIdeocase',
        component: () => import('../views/teacher/ideocase/ideocase_upload.vue')
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('../views/teacher/resource/resouceList.vue'),
      },
      {
        path: 'uploadResource/:resourceId',
        name: "uploadResource",
        component: () => import('../views/teacher/resource/resource_upload.vue')
      },
      {
        path: 'uploadResource',
        name: "uploadResource",
        component: () => import('../views/teacher/resource/resource_upload.vue')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('../views/teacher/user.vue')
      }
    ]
  },
  {
    path: '/resourceDetail/:resourceId',
    name: 'resourceDetail',
    component: () => import('../views/resource/resourceDetail.vue')
  },
  {
    path: '/ideocaseDetail/:ideocaseId',
    name: 'ideocaseDetail',
    component: () => import('../views/ideocase/ideocaseDetail.vue')
  },
  {
    path: '/announceDetail/:announcementId',
    name: 'announceDetail',
    component: () => import('../views/announcement/announcementDetail.vue')
  },
  {
    path: '/wordtest',
    name: 'wordtest',
    component: () => import('../views/test/pdf-test.vue')
  }
]
const createRouter = () =>
  new VueRouter({
    mode: 'history',
    routes: routes
  })
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
