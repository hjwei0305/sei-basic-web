/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-05-27 13:31:02
 */
import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Layout, Input, Tooltip } from 'antd';
import { ListLoader, ListCard } from 'suid';
import { constants } from '@/utils';
import Organization from './Organization';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

class UserSelect extends PureComponent {
  static listCardRef = null;

  static propTypes = {
    onUserSelectChange: PropTypes.func,
    currentEmployee: PropTypes.object,
    userSelectedKeys: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      orgId: null,
    };
  }

  handlerOrganizationChange = orgId => {
    this.setState({ orgId });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  handerUserSelectChange = (keys, items) => {
    const { onUserSelectChange } = this.props;
    if (onUserSelectChange) {
      onUserSelectChange(keys, items);
    }
  };

  handlerOrganizationAfterLoaded = orgId => {
    this.setState({ orgId });
  };

  renderTitle = item => {
    const { currentEmployee } = this.props;
    return (
      <>
        {currentEmployee.id === item.id ? (
          <span style={{ color: '#f5222d' }}>{item.userName}</span>
        ) : (
          item.userName
        )}
        <span style={{ color: '#999', marginLeft: 8 }}>{`(${item.code})`}</span>
      </>
    );
  };

  renderCustomTool = ({ total }) => {
    return (
      <>
        <Tooltip title="输入代码或姓名关键字查询">
          <Search
            placeholder="输入代码或姓名关键字查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: 172 }}
          />
        </Tooltip>
        <span style={{ marginLeft: 8 }}>{`共 ${total} 项`}</span>
      </>
    );
  };

  render() {
    const { orgId } = this.state;
    const { userSelectedKeys } = this.props;
    const listCardProps = {
      bordered: false,
      searchProperties: ['code', 'userName'],
      checkbox: true,
      selectedKeys: userSelectedKeys,
      itemField: {
        title: this.renderTitle,
        description: item => item.organizationNamePath,
      },
      remotePaging: true,
      showArrow: false,
      showSearch: false,
      cascadeParams: {
        organizationId: orgId,
      },
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
        params: { includeSubNode: true },
      },
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      onSelectChange: this.handerUserSelectChange,
    };
    return (
      <Layout className={cls(styles['user-panel-box'])}>
        <Sider width={320} className={cls('auto-height')} theme="light">
          <Organization
            onSelectChange={this.handlerOrganizationChange}
            onAfterLoaded={this.handlerOrganizationAfterLoaded}
          />
        </Sider>
        <Content className={cls('auto-height')} style={{ paddingLeft: 4 }}>
          {orgId ? <ListCard {...listCardProps} /> : <ListLoader />}
        </Content>
      </Layout>
    );
  }
}

export default UserSelect;
