import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar'
import Header from './components/header';
const AdminLayout: React.FC = () => {
  return (
    <div className='admin-layout'>
      <Sidebar />
      <div className='admin-main'>
        <Header />
        <div className='admin-content'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
export default AdminLayout


