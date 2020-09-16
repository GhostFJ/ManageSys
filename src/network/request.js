import axios from 'axios'
import { getToken } from '../utils/auth'

// 1.创建axios的实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000
})

// 2.axios的拦截器
// 2.1.请求拦截的作用
service.interceptors.request.use(config => {
  // 需要授权的api使用，使用Authorization字段提供token令牌
  config.headers.Authorization = getToken()
  // window.sessionStorage.getItem('token')
  return config
}, err => {
  console.log(err)
})

// 2.2.响应拦截
service.interceptors.response.use(res => {
  return res.data
}, err => {
  console.log(err)
})

export default service
