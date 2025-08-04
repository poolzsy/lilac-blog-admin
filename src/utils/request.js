import axios from "axios";
import { ElMessage } from "element-plus";

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 基础路径，会拼接在 url 前面
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    return config;
  },
  error => {
    // 请求错误时，直接抛出
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data;


    if (res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      });

      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.error('Response Error:' + error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error("未授权，请重新登录");
          // 跳转到登录页等操作
          break;
        case 403:
          ElMessage.error("禁止访问");
          break;
        case 404:
          ElMessage.error("请求的资源未找到");
          break;
        case 500:
          ElMessage.error("服务器内部错误，请联系管理员");
          break;
        default:
          ElMessage.error(`连接错误: ${error.response.status}`);
      }
    } else if (error.request) {
      ElMessage.error("网络错误，请检查您的网络连接");
    } else {
      ElMessage.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

export default request;
