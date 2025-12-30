import React from "react";
import { Button, } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMenuStore } from '@/store';
const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isCollapsed, toggleCollapsed } = useMenuStore()
  return (
    <header className="header">
      <Button type="primary" onClick={toggleCollapsed} icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}  >
        {isCollapsed ? '打开' : '折叠'}
      </Button>
      <Button onClick={() => navigate('/login')} type="primary">账号退出</Button>
    </header>
  )
}


export default Header