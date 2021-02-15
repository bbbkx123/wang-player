import Axios from 'axios'
import conf from '../config'

let axios = Axios.create({
  baseURL: conf.baseURL,
  timeout: 10000,
  transformRequest: [function (data) {
    // console.log('transformRequest');
    return data;
  }],
  // 请求后的数据处理
  transformResponse: [function (data) {
    // console.log('transformResponse');
    data = JSON.parse(data)
    return data;
  }],
  onUploadProgress: (res) => {
    // console.log('onUploadProgress: ', res);
  },
  onDownloadProgress: (res) => {
    // console.log('onDownloadProgress: ', res);
  },
  // 跨域请求 需要打开, 否则 可能会因为没带上 cookie 导致 301 ??? 后续设置false未出现问题
  withCredentials: false
})

axios.interceptors.request.use((config) => {
  // console.log('interceptors.request', config);
  return config
}, (err) => {
  return new Promise.reject(err)
})


axios.interceptors.response.use((res) => {
  // console.log('interceptors.response', res);
  return res
}, (err) => {
  return new Promise.reject(err)
})


export default axios