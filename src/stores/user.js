import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})
  const router = useRouter()

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
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    // 登出后重定向到登录页
    router.push('/login')
  }

  return { token, userInfo, login, getInfo, logout }
});
