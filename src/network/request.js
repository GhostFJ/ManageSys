import axios from 'axios'

// 1.创建axios的实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000
})

// 2.axios的拦截器
// 2.1.请求拦截的作用
service.interceptors.request.use(config => {
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
