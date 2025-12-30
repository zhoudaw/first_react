import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { queryUserList } from '@/api/account'
const User: React.FC = () => {
  const [dataSource, setDataSource] = useState([])
  const getList = async () => {
    const res = await queryUserList({ page: 1, pageSize: 10 })
    const list = res.data?.list.map((item: any) => ({ ...item, key: item.id }));
    setDataSource(list)
  }

  useEffect(() => {
    getList();
  }, []);


  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '登录账户',
      dataIndex: 'account',
    },
    {
      title: '电话号码',
      dataIndex: 'phone_number',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
    },
  ];
  return <div className="wrap">
    <Table dataSource={dataSource} columns={columns} bordered rowKey="id" />
  </div>
}

export default User;
