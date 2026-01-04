import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { QuestionCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  Row,
  Statistic,
  Tabs,
  Select,
  DatePicker,
  Button,
  message,
  Tooltip,
  Spin,
  Radio,
} from 'antd';
import { Line } from '@ant-design/plots';
import { getCommonCountryList, getCommonAppList } from '@/services/common/api';
import {
  queryStatBoardDailyData,
  queryStatBoardLabelType,
  queryStatBoardLineData,
} from '@/services/common/welcome';
import moment from 'moment';
const { RangePicker } = DatePicker;
// 添加主题监听hook
const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('navTheme') || 'light');

  useEffect(() => {
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('navTheme') || 'light';
      setTheme(currentTheme);
    };

    // 监听storage变化
    window.addEventListener('storage', handleStorageChange);

    // 监听自定义事件（Ant Design Pro主题切换时会触发）
    window.addEventListener('themeChange', handleStorageChange);

    // 轮询检查主题变化（备用方案）
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('navTheme') || 'light';
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleStorageChange);
      clearInterval(interval);
    };
  }, [theme]);

  return theme;
};
const Welcome: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<number>(1);
  const [appId, setAppId] = React.useState<number>(0);
  const [countryId, setCountryId] = React.useState<number>(0);
  const [appList, setAppList] = React.useState<{ label: string; value: string }[]>([]);
  const [countryList, setCountryList] = React.useState<{ label: string; value: string }[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [tabData, setTabData] = useState({
    user: [],
    anchor: [],
  });
  // 存储两个时间范围
  const [dateRange1, setDateRange1] = useState([moment().subtract(7, 'day'), moment()]);
  const [dateRange2, setDateRange2] = useState([]); // 第二个范围默认空
  const [showCompare, setShowCompare] = useState(false); // 控制是否显示第二个选择器
  const [labelTypeList, setLabelTypeList] = useState<
    { label: number; desc: string; tip: string[]; unit: string }[]
  >([]);
  const [labelType, setLabelType] = useState<number>(labelTypeList[0]?.label);
  const [chartConfig, setChartConfig] = useState<
    { date1: string; date2?: string; values1: string[]; values2?: string[] }[]
  >([]);
  const [chooseVal, setChooseVal] = useState<number>(1);
  const [chartAppId, setChartAppId] = useState<number>(0);
  const [labelList, setLabelList] = useState<{ label: number; value: number }[]>([]);

  // 使用主题hook
  const currentTheme = useTheme();
  useEffect(() => {
    console.log('当前主题:', currentTheme);
    // 当主题变化时，强制重新获取图表数据
    getStatBoardLineData();
  }, [currentTheme]);
  // 计算时间范围的天数（返回毫秒差对应的天数，向下取整）
  const getDays = (range) => {
    if (!range || range.length !== 2 || !range[0] || !range[1]) {
      return 0; // 范围不完整时返回0
    }
    const start = range[0].startOf('day'); // 忽略时分秒，从当天0点计算
    const end = range[1].startOf('day');
    return Math.abs(end.diff(start, 'days')) + 1; // 包含起止日期，+1
  };
  // 第一个时间范围变化
  const handleDateRange1Change = (dates) => {
    if (!dates) {
      setDateRange1([]);
      return;
    }
    setDateRange1(dates);
    // 若已显示第二个范围，校验天数
    if (showCompare && dateRange2.length === 2) {
      validateDays();
    }
  };

  // 第二个时间范围变化
  const handleDateRange2Change = (dates) => {
    if (!dates) {
      setDateRange2([]);
      return;
    }
    setDateRange2(dates);
    validateDays(); // 变化时立即校验
  };
  // 校验两个范围的天数是否一致
  const validateDays = () => {
    const days1 = getDays(dateRange1);
    const days2 = getDays(dateRange2);
    if (days1 > 0 && days2 > 0 && days1 !== days2) {
      message.error(`两个时间范围天数必须一致（当前分别为 ${days1} 天和 ${days2} 天）`);
      // 可选：清除第二个范围的选择，强制重新选择
      // setDateRange2([]);
    }
  };
  const onChange = (key: string) => {
    const tabKey = parseInt(key);
    setActiveTabKey(tabKey);
    getStatBoardDailyData(tabKey);
  };
  useEffect(() => {
    getCountryList();
    getAppList();
    // getStatBoardDailyData(activeTabKey);
    getStatBoardLabelType();
    // getStatBoardLineData();
  }, []);
  useEffect(() => {
    getStatBoardDailyData(activeTabKey);
  }, [appId, countryId]);

  useEffect(() => {
    console.log('看板标题下拉', labelTypeList);
    if (labelTypeList.length > 0) {
      setLabelType(labelTypeList[0]?.label);
    }
  }, [labelTypeList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getStatBoardLineData();
    }, 300); // 300ms防抖

    return () => clearTimeout(timer);
  }, [labelType, showCompare, dateRange1, dateRange2, chooseVal, chartAppId]);

  const getAppList = async () => {
    try {
      const res = await getCommonAppList();
      console.log('app列表', res);
      setAppList(
        res.data.map((item: any) => ({
          label: `${item.app_name}(${item.app_id})`,
          value: item.app_id,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };
  const getCountryList = async () => {
    try {
      const res = await getCommonCountryList();
      console.log('国家列表', res);
      setCountryList(
        res.data.map((item: any) => ({
          label: `${item.country_name}(${item.country_id})`,
          value: item.country_id,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };
  const getStatBoardDailyData = async (tabKey: number) => {
    setLoading1(true);
    try {
      const res = await queryStatBoardDailyData({
        user_type: tabKey,
        filter_id: tabKey == 2 ? countryId : appId,
      });
      console.log(`看板数据 - ${tabKey === 1 ? '用户' : '主播'}`, res);
      if (res.code == 0) {
        const originalList = res.data.list || [];
        const groupSize = 2;
        const groupedData = [];
        for (let i = 0; i < originalList.length; i += groupSize) {
          groupedData.push(originalList.slice(i, i + groupSize));
        }

        // 直接更新对应的标签页数据
        setTabData((prev) => ({
          ...prev,
          [tabKey === 1 ? 'user' : 'anchor']: groupedData,
        }));
      }
    } catch (error) {
      console.error(error);
      message.error('数据加载失败');
    } finally {
      setLoading1(false);
    }
  };
  const getStatBoardLabelType = async () => {
    try {
      const res = await queryStatBoardLabelType();
      console.log('看板标题下拉', res);
      if (res.code == 0) {
        setLabelTypeList(res.data.list || []);
      }
    } catch (error) {
      console.error(error);
      message.error('数据加载失败');
    }
  };
  const getStatBoardLineData = async () => {
    setLoading2(true);
    let date1;
    let date2;
    if (dateRange1 && dateRange1.length > 0) {
      date1 = dateRange1[0].format('YYYY-MM-DD') + ' - ' + dateRange1[1].format('YYYY-MM-DD');
    }
    if (dateRange2 && dateRange2.length > 0) {
      date2 = dateRange2[0].format('YYYY-MM-DD') + ' - ' + dateRange2[1].format('YYYY-MM-DD');
    }
    try {
      const res = await queryStatBoardLineData({
        label_type: labelType || 16,
        app_id: chartAppId || 0,
        date1: date1,
        date2: date2,
      });
      console.log('看板线性数据', res);
      if (res.code == 0) {
        // setLineList(res.data.list || []);
        const labelList = res.data.label.split('/');
        setLabelList(
          labelList.map((item: string, index: number) => ({ label: item, value: index + 1 })),
        );
        const lineList = res.data.list || [];
        let chartData: any[] = [];
        lineList.forEach(
          (item: { date1: string; date2?: string; values1: string[]; values2?: string[] }) => {
            if (!showCompare) {
              // 不对比的时候的数据处理
              if (!item.values1 || item.values1.length == 0) return;
              item.values1.forEach((val: string, index: number) => {
                chartData.push({
                  date1: item.date1,
                  date2: item.date2,
                  val1: parseFloat(val) || 0,
                  label: labelList[index],
                });
              });
            } else {
              // 对比的时候的数据处理
              if (!item.values2 || item.values2.length == 0) return;

              chartData.push(
                ...[
                  {
                    date1: item.date1 + 'VS' + item.date2,
                    date2: item.date2,
                    val1: parseFloat(item.values1[chooseVal - 1]) || 0,
                    label: '当前期',
                  },
                  {
                    date1: item.date1 + 'VS' + item.date2,
                    date2: item.date2,
                    val1: parseFloat(item.values2[chooseVal - 1]) || 0,
                    label: '对比期',
                  },
                ],
              );
            }
          },
        );
        console.log('看板线性数据', labelList);
        const sortData = [...chartData].sort((a, b) => {
          return labelList.indexOf(a.label) - labelList.indexOf(b.label);
        });
        const jsonData = [
          { date1: '2025-11-18', date2: '', val1: 2.97, label: '付费率' },
          { date1: '2025-11-18', date2: '', val1: 2.73, label: '老客付费率' },
          { date1: '2025-11-18', date2: '', val1: 9.88, label: '老客复购率' },
          { date1: '2025-11-18', date2: '', val1: 3.82, label: '新客付费率' },
          { date1: '2025-11-18', date2: '', val1: 35.48, label: '新客复购率' },
          { date1: '2025-11-18', date2: '', val1: 6.45, label: '新客3次及以上付费率' },

          { date1: '2025-11-19', date2: '', val1: 2.68, label: '付费率' },
          { date1: '2025-11-19', date2: '', val1: 2.6, label: '老客付费率' },
          { date1: '2025-11-19', date2: '', val1: 9.59, label: '老客复购率' },
          { date1: '2025-11-19', date2: '', val1: 3.01, label: '新客付费率' },
          { date1: '2025-11-19', date2: '', val1: 40.91, label: '新客复购率' },
          { date1: '2025-11-19', date2: '', val1: 4.55, label: '新客3次及以上付费率' },

          { date1: '2025-11-20', date2: '', val1: 2.32, label: '付费率' },
          { date1: '2025-11-20', date2: '', val1: 2.22, label: '老客付费率' },
          { date1: '2025-11-20', date2: '', val1: 13.85, label: '老客复购率' },
          { date1: '2025-11-20', date2: '', val1: 2.76, label: '新客付费率' },
          { date1: '2025-11-20', date2: '', val1: 31.58, label: '新客复购率' },
          { date1: '2025-11-20', date2: '', val1: 15.79, label: '新客3次及以上付费率' },

          { date1: '2025-11-21', date2: '', val1: 2.06, label: '付费率' },
          { date1: '2025-11-21', date2: '', val1: 1.55, label: '老客付费率' },
          { date1: '2025-11-21', date2: '', val1: 23.21, label: '老客复购率' },
          { date1: '2025-11-21', date2: '', val1: 5.07, label: '新客付费率' },
          { date1: '2025-11-21', date2: '', val1: 35.48, label: '新客复购率' },
          { date1: '2025-11-21', date2: '', val1: 12.9, label: '新客3次及以上付费率' },

          { date1: '2025-11-22', date2: '', val1: 2.67, label: '付费率' },
          { date1: '2025-11-22', date2: '', val1: 2.55, label: '老客付费率' },
          { date1: '2025-11-22', date2: '', val1: 11.59, label: '老客复购率' },
          { date1: '2025-11-22', date2: '', val1: 3.08, label: '新客付费率' },
          { date1: '2025-11-22', date2: '', val1: 29.17, label: '新客复购率' },
          { date1: '2025-11-22', date2: '', val1: 8.33, label: '新客3次及以上付费率' },

          { date1: '', date2: '', val1: 0, label: '付费率' },
          { date1: '', date2: '', val1: 0, label: '老客付费率' },
          { date1: '', date2: '', val1: 0, label: '老客复购率' },
          { date1: '', date2: '', val1: 0, label: '新客付费率' },
          { date1: '', date2: '', val1: 0, label: '新客复购率' },
          { date1: '', date2: '', val1: 0, label: '新客3次及以上付费率' },

          { date1: '', date2: '', val1: 0, label: '付费率' },
          { date1: '', date2: '', val1: 0, label: '老客付费率' },
          { date1: '', date2: '', val1: 0, label: '老客复购率' },
          { date1: '', date2: '', val1: 0, label: '新客付费率' },
          { date1: '', date2: '', val1: 0, label: '新客复购率' },
          { date1: '', date2: '', val1: 0, label: '新客3次及以上付费率' },

          { date1: '', date2: '', val1: 0, label: '付费率' },
          { date1: '', date2: '', val1: 0, label: '老客付费率' },
          { date1: '', date2: '', val1: 0, label: '老客复购率' },
          { date1: '', date2: '', val1: 0, label: '新客付费率' },
          { date1: '', date2: '', val1: 0, label: '新客复购率' },
          { date1: '', date2: '', val1: 0, label: '新客3次及以上付费率' },
        ];
        const config = {
          title: 'xxxs',
          data: jsonData,
          xField: 'date1',
          yField: 'val1',
          seriesField: 'label',
          smooth: true,
          height: 400,
          autoFit: true,
          animation: true,
          shapeField: 'smooth',
          xAxis: {
            tickInterval: 1,
          },
          yAxis: {
            nice: true,
          },
          legend: { size: false, color: { position: 'right', itemMarker: 'point' } },
          style: {
            lineWidth: 3,
            paddingTop: 10,
          },
          axis: {
            // y: { title: res.data.unit },
            y: { line: true },
            x: { line: true },
          },
        };
        console.log('看板线性数据', chartData);
        // 强制重新渲染图表
        setChartConfig(config);
      }
    } catch (error) {
      console.error(error);
      message.error('数据加载失败');
    } finally {
      setLoading2(false);
    }
  };
  const tabItems = [
    {
      label: '用户',
      key: '1',
      children: (
        <Row gutter={8}>
          {tabData.user.length > 0 ? (
            tabData.user.map((group: any[], colIndex: number) => (
              <Col span={6} key={colIndex}>
                <Card
                  bordered={false}
                  hoverable
                  bodyStyle={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {group.map((item: any, statIndex: number) =>
                    item.rate != 0 ? (
                      <Statistic
                        key={statIndex}
                        title={
                          <>
                            <div>{item.label}</div>
                            <div style={{ color: '#343a40', fontSize: '18px' }}>{item.value}</div>
                          </>
                        }
                        value={item.rate}
                        precision={2}
                        valueStyle={{ color: item.rate >= 0 ? '#3f8600' : '#cf1322' }}
                        prefix={item.rate >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix="%"
                      />
                    ) : (
                      <Statistic key={statIndex} title={item.label} value={item.value} />
                    ),
                  )}
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
              {loading1 ? <Spin size="large" /> : '暂无数据'}
            </Col>
          )}
        </Row>
      ),
    },
    {
      label: '主播',
      key: '2',
      children: (
        <Row gutter={8}>
          {tabData.anchor.length > 0 ? (
            tabData.anchor.map((group: any[], colIndex: number) => (
              <Col span={6} key={colIndex}>
                <Card
                  bordered={false}
                  hoverable
                  bodyStyle={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {group.map((item: any, statIndex: number) =>
                    item.rate != 0 ? (
                      <Statistic
                        key={statIndex}
                        title={
                          <>
                            <div>{item.label}</div>
                            <div style={{ color: '#343a40', fontSize: '18px' }}>{item.value}</div>
                          </>
                        }
                        value={item.rate}
                        precision={2}
                        valueStyle={{ color: item.rate >= 0 ? '#3f8600' : '#cf1322' }}
                        prefix={item.rate >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix="%"
                      />
                    ) : (
                      <Statistic key={statIndex} title={item.label} value={item.value} />
                    ),
                  )}
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
              {loading1 ? <Spin size="large" /> : '暂无数据'}
            </Col>
          )}
        </Row>
      ),
    },
  ];
  return (
    <PageContainer>
      <Tabs
        key={JSON.stringify(tabData)} // 当 tabData 变化时，整个 Tabs 组件会重新渲染
        activeKey={String(activeTabKey)}
        onChange={onChange}
        type="card"
        tabBarExtraContent={
          activeTabKey == 2 ? (
            <Select
              id="country_id"
              style={{ width: '255px' }}
              options={countryList}
              allowClear
              showSearch
              placeholder={'全部国家'}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(val) => {
                setCountryId(val);
              }}
            />
          ) : (
            <Select
              id="app_id"
              style={{ width: '255px' }}
              options={appList}
              allowClear
              placeholder={'全部APP'}
              onChange={(val) => {
                setAppId(val);
              }}
            />
          )
        }
        items={tabItems}
      />

      <Row style={{ marginTop: 10 }}></Row>
      <Card bodyStyle={{ height: 800 }}>
        <Tabs
          key={labelType}
          activeKey={String(labelType)}
          tabPosition={'top'}
          style={{ height: 220 }}
          onChange={(key) => {
            setLabelType(Number(key));
          }}
          items={labelTypeList.map((_, i) => {
            return {
              label: (
                <span>
                  {_.desc}
                  {_.tip && (
                    <Tooltip
                      placement="topRight"
                      title={
                        <div style={{ maxWidth: 400 }}>
                          <ol
                            style={{ margin: 0, paddingLeft: 16, lineHeight: 1.4, color: '#fff' }}
                          >
                            {_.tip.map((tip, index) => (
                              <li
                                key={index}
                                style={{ marginBottom: 2, color: '#fff', listStyle: 'decimal' }}
                              >
                                {tip}
                              </li>
                            ))}
                          </ol>
                        </div>
                      }
                      overlayInnerStyle={{ width: 'max-content' }}
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  )}
                </span>
              ),
              key: String(_.label),
              children: (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Select
                      id="app_id"
                      style={{ width: '255px' }}
                      options={appList}
                      allowClear
                      placeholder={'全部APP'}
                      onChange={(val) => {
                        setChartAppId(val);
                      }}
                    />
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <RangePicker
                        allowClear={false}
                        value={dateRange1} // 用value而非defaultValue，实现受控组件
                        onChange={handleDateRange1Change}
                      />
                      {showCompare && <span>VS</span>}
                      {showCompare && (
                        <RangePicker
                          allowClear={false}
                          value={dateRange2}
                          onChange={handleDateRange2Change}
                        />
                      )}
                      <Button
                        type="primary"
                        onClick={() => {
                          setShowCompare(!showCompare);
                          if (!showCompare) {
                            // 显示时默认给一个与第一个范围天数相同的历史范围
                            const days = getDays(dateRange1);
                            if (days > 0) {
                              const [start1, end1] = dateRange1;
                              const start2 = start1.clone().subtract(days, 'day');
                              const end2 = end1.clone().subtract(days, 'day');
                              setDateRange2([start2, end2]);
                            }
                          } else {
                            setDateRange2([]); // 隐藏时清空
                          }
                        }}
                      >
                        {showCompare ? '取消对比' : '新增对比'}
                      </Button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 30,
                    }}
                  >
                    {showCompare && (
                      <Radio.Group onChange={(e) => setChooseVal(e.target.value)} value={chooseVal}>
                        {labelList.map((item) => (
                          <Radio key={item.value} value={item.value}>
                            {item.label}
                          </Radio>
                        ))}
                      </Radio.Group>
                    )}
                  </div>
                  <Line {...chartConfig} key={`line-chart-${currentTheme}`} />

                  {/* <DualAxes {...chartConfig} /> */}
                </>
              ),
            };
          })}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
