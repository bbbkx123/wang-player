import Axios from "axios"
import config from "./config"

let axios = Axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
  // headers: { Authorization: "Bear mytoken" },
  transformRequest: [
    function (data) {
      return data
    }
  ],
  withCredentials: false
})

axios.interceptors.request.use((config) => {
  // console.log(config);
  return config
}, (err) => {
  return Promise.reject(err)
})

axios.interceptors.response.use((res) => {
  return res
}, (err) => {
  return Promise.reject(err)
})

export const get = (url: string, params: any) => {
  return axios.get(url, params).then(res => {
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