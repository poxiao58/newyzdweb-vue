import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', name: 'login', component: resolve => require(['@/views/login/index'], resolve), hidden: true },
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: '首页', requireAuth: true },
        component: resolve => require(['@/views/home/index'], resolve)
      }
    ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/control',
  //       name: 'control',
  //       meta: { title: '智能控制', requireAuth: true },
  //       component: resolve => require(['@/views/control/index'], resolve)
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/group',
  //       name: 'group',
  //       meta: { title: '设备编组', requireAuth: true },
  //       component: resolve => require(['@/views/group/index'], resolve)
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/logs',
  //       name: 'logs',
  //       meta: { title: '操作日志', requireAuth: true },
  //       component: resolve => require(['@/views/logs/index'], resolve)
  //     }
  //   ]
  // },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/device',
        name: 'device',
        meta: { title: '设备管理', requireAuth: true },
        component: resolve => require(['@/views/device/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/optImageManager',
        name: 'optImageManager',
        meta: { title: '新任务', requireAuth: true },
        component: resolve => require(['@/views/optImageManager/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/imageManager',
        name: 'imageManager',
        meta: { title: '新任务', requireAuth: true },
        component: resolve => require(['@/views/imageManager/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/completeImage',
        name: 'completeImage',
        meta: { title: '已完成', requireAuth: true },
        component: resolve => require(['@/views/completeImage/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/delImageManager',
        name: 'delImageManager',
        meta: { title: '回收站', requireAuth: true },
        component: resolve => require(['@/views/delImageManager/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/dataShow',
        name: 'dataShow',
        meta: { title: '数据统计', requireAuth: true },
        component: resolve => require(['@/views/chart/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/hisDataShow',
        name: 'hisDataShow',
        meta: { title: '历史数据', requireAuth: true },
        component: resolve => require(['@/views/hisChart/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/user',
        name: 'user',
        meta: { title: '用户管理', requireAuth: true },
        component: resolve => require(['@/views/user/index'], resolve)
      }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/logs',
        name: 'logs',
        meta: { title: '操作日志', requireAuth: true },
        component: resolve => require(['@/views/logs/index'], resolve)
      }
    ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/chart',
  //       name: 'chart',
  //       meta: { title: '统计图表', requireAuth: true },
  //       component: resolve => require(['@/views/chart/index'], resolve)
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/data',
  //       name: 'data',
  //       meta: { title: '数据总览', requireAuth: true },
  //       component: resolve => require(['@/views/data/index'], resolve)
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/video',
  //       name: 'video',
  //       meta: { title: '视频中心', requireAuth: true },
  //       component: resolve => require(['@/views/video/index'], resolve)
  //     }
  //   ]
  // }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
