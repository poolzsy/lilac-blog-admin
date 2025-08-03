import axios from "axios";
import { ElMessage } from "element-plus";


const request = axios.create({
  baseURL: 'http://localhost:9696/',
  timeout: 10000,
});

// request拦截器
request.interceptors.request.use(config => { 
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    return config;
}, error => {
    ElMessage.error("请求失败");
    return Promise.reject(error);
});

request.interceptors.response.use(
  response => {
    let res = response.data;
    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res;
    }
    return res;
  },
  error => {
    if(error.response.status == 404){
      ElMessage.error("请求失败");
    } else if(error.response.status == 500){
      ElMessage.error("服务器错误");
    } else {
      ElMessage.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
