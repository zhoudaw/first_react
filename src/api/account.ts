import { httpPost } from '@/utils/http';
export interface Registr {
  /*邮箱*/
  email?: string;
  /*账户*/
  account: string;
  /*密码*/
  password: string;
}

export interface PageParm {
  /*分页*/
  page: number;
  /*1页几条*/
  pageSize: number;
}

// 注册账户
export const register = (data: Registr) => {
  return httpPost('/api/user/register', data);
};

// 账户登录
export const login = (data: Registr) => {
  return httpPost('/api/user/login', data);
};

// 用户列表
export const queryUserList = (data: PageParm) => {
  return httpPost('/api/user/userList', data);
};
