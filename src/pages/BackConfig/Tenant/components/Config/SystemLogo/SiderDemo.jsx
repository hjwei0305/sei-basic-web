import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from './SiderDemo.less';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { menuLogoImg, collapsedMenuLogoImg } = this.props;

    return (
      <Layout className={cls(styles['components-layout-demo-side'])}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo">
            <img src={collapsed ? collapsedMenuLogoImg : menuLogoImg} alt="logo" />
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>User</span>
                </span>
              }
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="team" />
                  <span>Team</span>
                </span>
              }
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: '8px' }}>
            <div style={{ height: '100%', background: '#fff' }}>{formatMessage({id: 'basic_000302', defaultMessage: '内容'})}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default SiderDemo;
