import axios from 'axios'
import {Message} from 'element-ui'

//todo request 拦截器
// axios.interceptors.request.use(config => {
//   return config;
// }, err => {
//   Message.error({message: '请求超时!'});
//   // return Promise.resolve(err);
// })

//todo response 拦截器
// axios.interceptors.response.use(data => {
//   // if(data.status&&data.status==200)
//   if (data.message) {
//     Message.success({Message: data.message});
//   }
//   return data;
// }, err => {
//   if (err.response.message) {
//     Message.error({message: err.response.message});
//   } else {
//     Message.error({message: '未知错误!'});
//   }
// })
let base = 'http://localhost:8081';
export const postRequestWithToken = (url, params, success, error) => {
  axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    // transformRequest: [function (data) {
    //   let ret = ''
    //   for (let it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //   }
    //   return ret
    // }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': sessionStorage['token']
    }
  }).then(success).catch(error);
}
export const requestWithToken = (url, method, params, success, error) => {
  axios({
    method: method,
    url: `${base}${url}`,
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+sessionStorage['token']
      // 'token': sessionStorage['token']
    }
  }).then(success).catch(error);
}
export const requestWithoutToken = (url, method, params, success, error) => {
  axios({
    method: method,
    url: `${base}${url}`,
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(success).catch(error);
}
export const postRequest = (url, params, success, error) => {
  axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(success).catch(error);
}
export const postJSONRequest = (url, params, success, error) => {
  axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    // transformRequest: [function (data) {
    //   let ret = '';
    //   data.forEach(item => {
    //     ret += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
    //   });
    //   return ret
    // }],
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json;charset=utf-8'
    }
  }).then(success).catch(error);
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  });
}
