import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { queryUserList } from "@/api/account";

const GoodsCategory: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const getList = async () => {
    // 获取列表
    const res = await queryUserList({ page: 1, pageSize: 10 });
    const list = res.data?.list.map((item: any) => ({ ...item, key: item.id }));
    setDataSource(list);
  };

  useEffect(() => {
    getList();
  }, []);

  const handlerClick = () => {
    navigate(`/goods/goodsCategory/details`);
  };

  const columns = [
    {
      title: "分类名称",
      dataIndex: "id",
    },
    {
      title: "是否上架",
      dataIndex: "username",
    },
    {
      title: "排序",
      dataIndex: "email",
    },
    {
      title: "是否开启",
      dataIndex: "account",
    },
    {
      title: "关联物品个数",
      dataIndex: "account",
    },
  ];
  return (
    <div className="wrap">
      <div>
        <Button onClick={handlerClick} type="primary">
          添加商品
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} bordered rowKey="id" />
    </div>
  );
};

export default GoodsCategory;
