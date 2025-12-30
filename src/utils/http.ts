import axios from 'axios';
import { notification } from 'antd';

interface ApiResult<T = any> {
  code: number;
  msg: string;
  data?: T;
}
const http = axios.create({
  baseURL: 'http://192.168.2.13:8899',
  timeout: 3000,
});
// 请求拦截器
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { code, msg } = response.data;
      if (code !== 200) {
        notification.error({
          title: '提示',
          description: msg,
        });
        return null;
      }
      return response.data;
    }
  },
  (error) => {
    if (!error.response) {
      notification.error({
        title: '网络错误',
        description: '无法连接服务器',
      });
    } else {
      const { status, data } = error.response;
      notification.error({
        title: `接口错误 ${status}`,
        description: data?.msg || '服务器异常',
      });
    }

    return Promise.reject(error);
  }
);
export const httpPost = <T = any>(url: string, data?: object) => http.post<ApiResult<T>>(url, data);
export const httpGet = <T = any>(url: string, params?: object) => http.get<ApiResult<T>>(url, { params });
