import React from "react";
import { Form, Input, Button, Card, notification } from "antd";
import { login } from '@/api/account'
import { useNavigate } from 'react-router-dom';
import {
  EyeOutlined,
  EyeInvisibleOutlined,

} from '@ant-design/icons';
const Login: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate()
  const formConfigs = [
    { name: "account", label: "账号", placeholder: "请输入账号", type: "text" },
    { name: "password", label: "密码", placeholder: "请输入密码", type: "password" },
  ];

  const handleFinish = async (valuses: any) => {
    const { password, account } = valuses
    try {
      const res = await login({ password, account })
      if (res.code === 200) {
        api.success({
          title: '提示',
          description: res.msg
        });
        navigate('/dashboard')
      }
    } catch (e) { }
  }

  const wrapStyle: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #b9e9ff 0%, #c8f8dd 100%)",

  };

  const cardStyle: React.CSSProperties = {
    width: 600,
    padding: 10,
    borderRadius: 20,
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
  };

  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: 26,
    marginBottom: 30,
    fontWeight: 700,
    color: "#2c3e50",
    letterSpacing: "1px",
  };

  return (
    <div className="wrap" style={wrapStyle}>
      {contextHolder}
      <Card style={cardStyle}>
        <h2 style={titleStyle}>账户登录</h2>
        <Form
          onFinish={handleFinish}
          labelCol={{ style: { width: 120 } }}
          wrapperCol={{ style: { width: 320 } }}
          style={{ rowGap: "18px" }}
        >
          {formConfigs.map((item) => (
            <Form.Item key={item.name} name={item.name} label={item.label} rules={[{ required: true, message: item.placeholder }]} normalize={(value) => (value ? value.trim() : "")}>
              {item.type === "password" ? (
                <Input.Password
                  placeholder={item.placeholder}
                  allowClear
                  style={{ height: 42, borderRadius: 8 }}
                  iconRender={(visible) =>
                    visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
                  }
                />
              ) : (
                <Input
                  placeholder={item.placeholder}
                  type={item.type}
                  allowClear
                  style={{ height: 42, borderRadius: 8 }}
                />
              )}
            </Form.Item>
          ))}
          <Form.Item wrapperCol={{ style: { width: 320, marginLeft: 120 } }}>
            <Button
              type="primary"
              htmlType="submit"
              color="default" variant="outlined"
              block
              style={{
                height: 45,
                borderRadius: 8,
                fontSize: 16,
                letterSpacing: 1,
              }}
            >
              登录
            </Button>

            <Button
              type="primary"
              block
              onClick={() => navigate('/register')}
              style={{
                height: 45,
                borderRadius: 8,
                fontSize: 16,
                letterSpacing: 1,
                marginTop: "10px"
              }}
            >
              去注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
