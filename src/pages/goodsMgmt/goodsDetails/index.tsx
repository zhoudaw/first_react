import React, { useState } from "react";
import { Form, Input, Row, Col, Button, Switch, Select } from 'antd';
import { useLocation } from 'react-router-dom';
import { goodsCreate } from '@/api/goods'
const GoodsDetails: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const type = params.get('type');

  const { TextArea } = Input;

  const createConfigs = {
    name: '',
    price: 0,
    stock: 0,
    images: '',
    category_id: 0,
    sort: 0,
    status: 1,
    description: 2,
  }


  //  提交按钮
  const handleSubmit = async (values: any) => {

    await goodsCreate(values)
  }
  return (

    <div className="wrap">
      <Form
        initialValues={createConfigs}
        onFinish={(values) => handleSubmit(values)}
        labelAlign="right"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal" >
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="商品名称" name='name'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="商品库存" name='stock'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="商品图片" name='images'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="商品规格" >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label="是否上架" name='status'>
              <Switch checkedChildren="已上架" unCheckedChildren="已下架" defaultChecked />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="商品价格" name='price'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="商品排序" name='sort'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="商品分类" name='category_id'>
              {/* <Select
                defaultValue="lucy"
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                  { value: 'disabled', label: 'Disabled' },
                ]}
              /> */}
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={24}>

          <Col span={6}>
            <Form.Item label="商品单位">
              <Input />
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="description"
              label="商品描述"
            >
              <TextArea

                rows={6}
                placeholder="请输入商品描述"
                maxLength={500}
                showCount
                autoSize={{ minRows: 3, maxRows: 10 }}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" >
            保存
          </Button>
          <Button>
            取消
          </Button>
        </Form.Item>
      </Form>
    </div >
  )
}

export default GoodsDetails