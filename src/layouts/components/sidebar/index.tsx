
import React, { useMemo } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { routeConfig, AppRoute } from '@/router';
import { useMenuStore } from '@/store';
type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC = () => {
  const { isCollapsed } = useMenuStore()
  const navigate = useNavigate();
  const location = useLocation();
  const generateMenuItems = (routes: AppRoute[], parentPath = ''): MenuItem[] => {
    return routes
      .filter(r => r.path || !r.hideInMenu)
      .map(route => {
        const fullPath = route.index
          ? parentPath
          : parentPath
            ? `${parentPath}/${route.path}`
            : `/${route.path}`;

        if (route.children && route.children.length > 0) {
          return {
            key: `menu-${fullPath}`,
            label: route.label,
            icon: route.icon,
            children: generateMenuItems(route.children, fullPath),
          };
        } else {
          return {
            key: fullPath,
            label: route.label,
            icon: route.icon,
          };
        }
      });
  };


  const items = useMemo<MenuItem[]>(() => {
    const layoutRoutes = routeConfig.find(r => r.path === '/')?.children || [];
    return generateMenuItems(layoutRoutes);
  }, []);

  const defaultOpenKeys = useMemo(() => {
    const layoutRoutes = routeConfig.find(r => r.path === '/')?.children || [];
    return layoutRoutes
      .filter(r => r.children && r.children.length > 0 && r.path)
      .map(r => `/${r.path}`);
  }, []);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <Menu
        mode="inline"
        items={items}
        inlineCollapsed={isCollapsed}
        selectedKeys={[location.pathname]}
        defaultOpenKeys={defaultOpenKeys}
        onClick={({ key }) => navigate(key)}
      />
    </aside>
  );
};

export default Sidebar;
