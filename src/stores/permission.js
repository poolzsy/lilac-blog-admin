import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import { constantRoutes } from '@/router'

const modules = import.meta.glob('../views/**/*.vue')
export const loadView = (view) => {
  if (!view) {
    return () => import('@/views/error/404.vue');
  }
  const path = `../views/${view}.vue`;
  if (modules[path]) {
    return modules[path];
  } else {
    return () => import('@/views/error/404.vue');
  }
}

function transformRoutes(backendRoutes, isTopLevel = true) {
  const newRoutes = [];

  backendRoutes.forEach(route => {
    if (!route.type || !['M', 'C'].includes(route.type)) {
      return;
    }

    const currentPath = isTopLevel ? (route.path.startsWith('/') ? route.path : `/${route.path}`) : route.path;
    let newRoute;

    if (isTopLevel) {
      newRoute = {
        path: currentPath,
        component: () => import('@/layouts/Layout.vue'),
        redirect: undefined,
        meta: {
          title: route.menuName,
          icon: route.icon,
        },
        children: []
      };

      if (route.type === 'M') {
        const children = transformRoutes(route.children, false);
        if (children.length > 0) {
          newRoute.children = children;
          newRoute.redirect = `${currentPath}/${children[0].path}`;
        }
      } else if (route.type === 'C') {
        const childRoute = {
          path: '',
          component: loadView(route.component),
          name: route.path.replace(/[\/:]/g, '-'),
          meta: {
            title: route.menuName,
            icon: route.icon,
            perms: route.perms
          }
        };
        newRoute.children.push(childRoute);
      }
    } else {
      newRoute = {
        path: currentPath,
        component: loadView(route.component),
        name: route.path.replace(/[\/:]/g, '-'),
        meta: {
          title: route.menuName,
          icon: route.icon,
          perms: route.perms
        }
      };
    }

    if (newRoute) {
      newRoutes.push(newRoute);
    }
  });

  return newRoutes;
}

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref([])
  const dynamicRoutes = ref([])

  async function generateRoutes() {
    try {
      const res = await request.get('/user/getRouters');
      const backendRoutes = res.data && res.data.menus ? res.data.menus : [];

      if (!Array.isArray(backendRoutes)) {
        console.error("后端返回的路由数据格式不正确，期望 'data.menus' 是一个数组!");
        return [];
      }

      const accessedRoutes = transformRoutes(backendRoutes);

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
