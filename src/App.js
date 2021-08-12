import React, { useState } from 'react';
import './style.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Input } from 'antd';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Dashboard from './dashboard.js';
import Video from './video.js';
const { Search } = Input;

import {
  DesktopOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  MenuOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function App() {
  const [collapsed, setcollapsed] = useState(false);

  const onCollapse = () => {
    setcollapsed(!collapsed);
  };

  const handlingSearch = (value, event) => {
    console.log('Search Value', value);
  };

  return (
    <Router>
      <Layout className="layout">
        <Header>
          <MenuOutlined className="hamburger" onClick={onCollapse} />
          <div className="logo">BRINKSHOME</div>
          <Menu
            className="menuWrapper"
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
          >
            <Search
              placeholder="input search text"
              onSearch={(value, event) => handlingSearch(value, event)}
              allowClear
              style={{ width: 300 }}
            />
          </Menu>
        </Header>
        <Layout>
          <Sider
            style={{ minHeight: '90vh' }}
            collapsible
            collapsed={collapsed}
            onCollapse={setcollapsed}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                Dashboard
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                Video
                <Link to="/video" />
              </Menu.Item>
              <SubMenu key="sub1" icon={<UserOutlined />} title="Automation">
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Notification">
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9" icon={<DesktopOutlined />}>
                <span>Activity</span>
              </Menu.Item>
              <Menu.Item key="10" icon={<UserOutlined />}>
                Users
              </Menu.Item>
              <Menu.Item key="11" icon={<SettingOutlined />}>
                Setting
              </Menu.Item>
            </Menu>
          </Sider>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280
            }}
          >
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/video" component={Video} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
