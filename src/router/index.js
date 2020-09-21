import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '../utils/auth'
// import { component } from 'vue/types/umd'

Vue.use(VueRouter)

//  路由懒加载

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/home/Home'),
    children: [
      {
        path: '',
        redirect: 'welcome'
      },
      {
        path: 'welcome',
        component: () => import('@/views/main/Welcome')
      },
      {
        path: 'users',
        component: () => import('@/views/user/Users')
      },
      {
        path: 'roles',
        component: () => import('@/views/authority/Roles')
      },
      {
        path: 'rights',
        component: () => import('@/views/authority/Rights')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = getToken()
  // window.sessionStorage.getItem('Token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
