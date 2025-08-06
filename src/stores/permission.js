import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import { constantRoutes } from '@/router'

const modules = import.meta.glob('../views/**/*.vue')
export const loadView = (view) => {
  return modules[`../views/${view}.vue`]
}

function transformRoutes(backendRoutes, parentPath = '') {
  return backendRoutes.map(route => {
    let currentPath;

    if (parentPath) {
      currentPath = `${parentPath}/${route.path}`;
    } else {
      currentPath = route.path.startsWith('/') ? route.path : `/${route.path}`;
    }

    const newRoute = {
      path: currentPath,
      name: route.name || currentPath.replace(/\//g, '-').substring(1) || 'default-name-' + Math.random(),
      component: route.component === 'Layout'
        ? () => import('@/layouts/Layout.vue')
        : route.component ? loadView(route.component) : null,
      meta: {
        title: route.menuName,
        icon: route.icon,
      },
      children: []
    }

    // 如果 component 为空，可能是个目录，不需要添加到路由中，但需要处理其子节点
    if (!newRoute.component && route.type === 'M') {
      console.warn(`目录 '${route.menuName}' (path: '${route.path}') 没有设置 component，将只作为菜单分组显示。`)
      // 在一些UI库中，没有 component 的路由可能无法正常工作。
      // 一个常见的做法是给它一个空的或通用的父路由组件。
      // 但这里我们暂时跳过，只处理子路由。
    }

    if (route.children && route.children.length > 0) {
      newRoute.children = transformRoutes(route.children, newRoute.path);
    }

    return newRoute
  })
}

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref([])
  const dynamicRoutes = ref([])

  async function generateRoutes() {
    try {
      const res = await request.get('/user/getRouters');

      console.log(res.data);

      const backendRoutes = res.data && res.data.menus ? res.data.menus : [];
      if (!Array.isArray(backendRoutes)) {
        console.error("后端返回的路由数据格式不正确，期望 'data.menus' 是一个数组!");
        return [];
      }

      const accessedRoutes = transformRoutes(backendRoutes);

      console.log(accessedRoutes);

      dynamicRoutes.value = accessedRoutes;
      routes.value = constantRoutes.concat(accessedRoutes);
      return accessedRoutes;
    } catch (error) {
      console.error('获取或处理路由时出错:', error);
      // 出错时也应该有处理，比如登出
      // const userStore = useUserStore();
      // userStore.logout();
      return Promise.reject(error);
    }
  }

  return { routes, dynamicRoutes, generateRoutes }
})
