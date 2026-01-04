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

// 创建商品
export const goodsCreate = (data: any) => {
  return httpPost('/api/goods/create', data);
};
