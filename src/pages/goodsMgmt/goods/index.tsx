import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { queryUserList } from '@/api/account'

const Goods: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([])
  const getList = async () => {
    // 获取列表
    const res = await queryUserList({ page: 1, pageSize: 10 })
    const list = res.data?.list.map((item: any) => ({ ...item, key: item.id }));
    setDataSource(list)
  }

  useEffect(() => {
    getList();
  }, []);

  const handlerClick = () => {
    navigate(`/goods/goodsDetails?type=add`)
  }

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'id',
    },
    {
      title: '是否上架',
      dataIndex: 'username',
    },
    {
      title: '商品图片',
      dataIndex: 'email',
    },
    {
      title: '商品库存',
      dataIndex: 'account',
    },
    {
      title: '商品价格',
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
    <div >
      <Button onClick={handlerClick} type="primary" >添加商品</Button>
    </div>
    <Table dataSource={dataSource} columns={columns} bordered rowKey="id" />
  </div>
}

export default Goods;
