import React, { Component } from 'react';
import { Icon, Menu, Layout } from 'antd';
import Link from 'umi/link';
import cls from 'classnames';
import { ScrollBar } from 'suid';
import styles from './index.less';

const { Header, Content } = Layout;
const { SubMenu } = Menu;

const menuData = [
  {
    id: '10',
    name: formatMessage({id: 'basic_000248', defaultMessage: '后台配置'}),
    children: [
      {
        id: '100',
        name: formatMessage({id: 'basic_000108', defaultMessage: '应用模块'}),
        path: '/backConfig/appModule',
      },
      {
        id: '101',
        name: formatMessage({id: 'basic_000110', defaultMessage: '功能项'}),
        path: '/backConfig/feature',
      },
      {
        id: '102',
        name: formatMessage({id: 'basic_000249', defaultMessage: '应用菜单'}),
        path: '/backConfig/appMenu',
      },
      {
        id: '103',
        name: formatMessage({id: 'basic_000250', defaultMessage: '权限对象'}),
        path: '/backConfig/authorType',
      },
      {
        id: '104',
        name: formatMessage({id: 'basic_000119', defaultMessage: '数据权限类型'}),
        path: '/backConfig/dataAuthorType',
      },
      {
        id: '105',
        name: formatMessage({id: 'basic_000251', defaultMessage: '租户管理'}),
        path: '/backConfig/tenant',
      },
    ],
  },
  {
    id: '20',
    name: formatMessage({id: 'basic_000252', defaultMessage: '权限管理'}),
    children: [
      {
        id: '201',
        name: formatMessage({id: 'basic_000165', defaultMessage: '功能角色'}),
        path: '/author/featureRole',
      },
      {
        id: '202',
        name: formatMessage({id: 'basic_000167', defaultMessage: '数据角色'}),
        path: '/author/dataRole',
      },
      {
        id: '203',
        name: formatMessage({id: 'basic_000253', defaultMessage: '数据权限显示'}),
        path: '/author/dataView',
      },
    ],
  },
];

const getIcon = icon => {
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class Home extends Component {
  componentDidMount() {
    this.getNavMenuItems(menuData);
  }

  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  getSubMenuTitle = item => {
    const { name } = item;
    return item.icon ? (
      <span>
        {getIcon(item.icon)}
        <span>{name}</span>
      </span>
    ) : (
      name
    );
  };

  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <SubMenu title={this.getSubMenuTitle(item)} key={item.id}>
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.id}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getMenuItemPath = item => {
    const { name } = item;
    const { location } = this.props;
    return (
      <Link to={item.path} replace={item.path === location.pathname}>
        <span>{name}</span>
      </Link>
    );
  };

  render() {
    return (
      <Layout className={cls(styles['main-box'])}>
        <Header className={cls('menu-header')}>{formatMessage({id: 'basic_000254', defaultMessage: '应用路由列表'})}</Header>
        <Content className={cls('menu-box')}>
          <ScrollBar>
            <Menu key="Menu" mode="inline" theme="light">
              {this.getNavMenuItems(menuData)}
            </Menu>
          </ScrollBar>
        </Content>
      </Layout>
    );
  }
}
