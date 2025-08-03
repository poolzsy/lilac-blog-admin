import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('../views/editor/Edit.vue'),
      }
    ]
  },  
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
      path: '/:catchAll(.*)',
      name: '404',
      component: () => import('../views/404.vue')
    }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router