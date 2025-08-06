import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import { usePermissionStore } from './permission'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})

  // 登录
  async function login(loginData) {
    const res = await request.post('/user/login', loginData)
    if (res.code === 200) {
      token.value = res.data.token
      localStorage.setItem('token', token.value)
      return 'ok'
    } else {
      return Promise.reject(new Error(res.message))
    }
  }

  // 获取用户信息
  async function getInfo() {
    const res = await request.get('/user/getInfo')
    userInfo.value = res.data
    return res.data
  }

  // 登出
  function logout() {
    const permissionStore = usePermissionStore();

    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')

    permissionStore.dynamicRoutes = []
    permissionStore.routes = []
  }

  return { token, userInfo, login, getInfo, logout }
});
