import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import Layout from '@/layouts/Layout.vue'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/login/Register.vue'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error/404.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('../views/dashboard/index.vue'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

// 白名单：不需要登录即可访问的路径
const whiteList = ['/login', '/register']


router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，访问登录页则重定向到主页
      next({ path: '/' })
    } else {
      // 检查是否已有用户信息（和路由）
      const hasRoutes = permissionStore.dynamicRoutes.length > 0
      if (hasRoutes) {
        next()
      } else {
        try {
          // 异步获取用户信息和路由
          await userStore.getInfo()
          const accessRoutes = await permissionStore.generateRoutes()

          // 动态添加路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          // 添加 404 页面，必须放在最后
           router.addRoute({ path: '/:catchAll(.*)', redirect: '/404', hidden: true });

          // 重新进入导航，此时就能匹配到新添加的路由
          next({ ...to, replace: true })
        } catch (error) {
          // 如果获取信息失败（例如token失效），则登出
          userStore.logout()
          next('/login?redirect=' + to.path)
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单内，直接放行
      next()
    } else {
      // 不在白名单内，全部重定向到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
