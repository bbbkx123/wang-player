import Axios from "axios"
import config from "./config"

const axios = Axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
  transformRequest: [
    function (data: any) {
      return data
    }
  ],
  withCredentials: false
})

axios.interceptors.request.use((config: any) => {
  // console.log(config);
  return config
}, (err: any) => {
  return Promise.reject(err)
})

axios.interceptors.response.use((res: any) => {
  return res
}, (err: any) => {
  return Promise.reject(err)
})

export const get = (url: string, params: any) => {
  return axios.get(url, params).then((res: any) => {
    if (res.status === 200) {
      if (res.data.code === 200) {
        return Promise.resolve(res)
      }
    }
    return Promise.reject(res)
  })
}

// export const all = (promiseArr, cb) => {
//   return Axios.all(promiseArr).then(Axios.spread(cb))
// }