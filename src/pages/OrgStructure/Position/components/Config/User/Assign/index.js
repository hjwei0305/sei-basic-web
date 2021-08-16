/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-09-27 14:17:56
 */
import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Layout, Button, Input, Tooltip } from 'antd';
import { ListLoader, ListCard } from 'suid';
import { constants } from '@/utils';
import Organization from './Organization';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

class UserAssign extends Component {
  static listCardRef;

  static propTypes = {
    onBackAssigned: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      orgId: null,
      selectedKeys: [],
    };
  }

  handlerOrganizationChange = orgId => {
    this.setState({ orgId });
  };

  handerAssignUserSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  handlerOrganizationAfterLoaded = orgId => {
    this.setState({ orgId });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  assignedSave = () => {
    const { selectedKeys } = this.state;
    const { save, onBackAssigned } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success) {
          onBackAssigned && onBackAssigned();
        }
      });
    }
  };

  assignedCancel = () => {
    this.setState({ selectedKeys: [] });
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving } = this.props;
    const hasSelected = selectedKeys.length > 0;
    return (
      <>
        <Button type="danger" ghost disabled={!hasSelected} onClick={this.assignedCancel}>
          {formatMessage({id: 'basic_000131', defaultMessage: '取消'})}
        </Button>
        <Button type="primary" disabled={!hasSelected} loading={saving} onClick={this.assignedSave}>
          {`确定 (${selectedKeys.length})`}
        </Button>
        <div>
          <Tooltip title={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}>
            <Search
              allowClear
              placeholder={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerPressEnter}
              style={{ width: 132 }}
            />
          </Tooltip>
        </div>
      </>
    );
  };

  render() {
    const { orgId, selectedKeys } = this.state;
    const { currentPosition } = this.props;
    const listCardProps = {
      className: 'anyone-user-box',
      title: formatMessage({id: 'basic_000212', defaultMessage: '可选择的用户'}),
      bordered: false,
      searchPlaceHolder: formatMessage({id: 'basic_000164', defaultMessage: '输入代码或姓名关键字查询'}),
      searchProperties: ['code', 'userName'],
      checkbox: true,
      selectedKeys,
      itemField: {
        title: item => (
          <>
            {item.userName}
            <span style={{ color: '#999', marginLeft: 8 }}>{`(${item.code})`}</span>
          </>
        ),
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
        params: { excludePositionId: get(currentPosition, 'id', null), includeSubNode: true },
      },
      onListCardRef: ref => (this.listCardRef = ref),
      onSelectChange: this.handerAssignUserSelectChange,
      customTool: this.renderCustomTool,
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

export default UserAssign;
