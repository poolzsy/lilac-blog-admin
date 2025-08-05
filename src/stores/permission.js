import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import { constantRoutes } from '@/router'

// 将后端返回的字符串组件路径转换为真正的组件
const modules = import.meta.glob('../views/**/*.vue')
export const loadView = (view) => {
  return modules[`../views/${view}.vue`]
}

function transformRoutes(backendRoutes) {
  return backendRoutes.map(route => {
    const newRoute = {
      path: route.path,
      name: route.name,
      component: route.component === 'Layout' ? () => import('@/layouts/Layout.vue') : loadView(route.component),
      meta: route.meta,
      children: []
    }
    if (route.children && route.children.length > 0) {
      newRoute.children = transformRoutes(route.children)
    }
    return newRoute
  })
}

export const usePermissionStore = defineStore('permission', () => {
    const routes = ref([])
    const dynamicRoutes = ref([])

    async function generateRoutes() {
        const res = await request.get('/user/getRouters')
        const accessedRoutes = transformRoutes(res.data)
        
        dynamicRoutes.value = accessedRoutes
        routes.value = constantRoutes.concat(accessedRoutes)
        return accessedRoutes
    }

    return { routes, dynamicRoutes, generateRoutes }
})
