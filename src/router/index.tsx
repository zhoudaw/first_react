import { createBrowserRouter, Navigate, IndexRouteObject, NonIndexRouteObject, Outlet } from 'react-router-dom';
import Layout from '@/layouts/adminLayout';
import Dashboard from '@/pages/dashboard';
import Order from '@/pages/order';
import Login from '@/pages/login';
import Register from '@/pages/register';
import User from '@/pages/userMgmt/user';
import Member from '@/pages/userMgmt/member';
import {
  HomeOutlined,
  BorderInnerOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
// 扩展类型
export type AppRoute = (IndexRouteObject | NonIndexRouteObject) & {
  label: string;
  children?: AppRoute[];
  icon?: React.ReactNode;
  hideInMenu?: Boolean;

};


export const routeConfig: AppRoute[] = [
  { path: 'login', element: <Login />, label: '登录页面' },
  { path: 'register', element: <Register />, label: '注册页面' },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        hideInMenu: true,
        index: true, element: <Navigate to="/dashboard" replace />, label: '首页',
      },
      { path: 'dashboard', element: <Dashboard />, label: '首页', icon: <HomeOutlined /> },
      {
        path: 'user',
        element: <Outlet />,
        icon: <UsergroupAddOutlined />,
        label: '用户管理',
        children: [
          { index: true, element: <User />, label: '用户列表', icon: <UserOutlined /> },
          { path: 'member', element: <Member />, label: '会员列表', icon: <UserSwitchOutlined /> },
        ],
      },
      { path: 'order', element: <Order />, label: '订单管理', icon: <BorderInnerOutlined /> },
    ],
  },
];


const router = createBrowserRouter(routeConfig);
export default router;
