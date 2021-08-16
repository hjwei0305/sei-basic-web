import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { trim } from 'lodash';
import { Layout, Empty, Input, Tag } from 'antd';
import { message, ListCard } from 'suid';
import { EffectDate } from '@/components';
import empty from '@/assets/item_empty.svg';
import { formatMessage } from 'umi-plugin-react/locale';
import DataAuthorType from './components/DataAuthorType';
import styles from './index.less';

const { Sider, Content } = Layout;

const { Search } = Input;

@connect(({ dataView, loading }) => ({ dataView, loading }))
class DataView extends PureComponent {
  static account = '';

  handlerAccountChange = v => {
    this.account = trim(v);
  };

  getRoleList = e => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    if (this.account) {
      dispatch({
        type: 'dataView/getRoleList',
        payload: {
          account: this.account,
        },
      });
    } else {
      dispatch({
        type: 'dataView/updateState',
        payload: {
          roleList: [],
        },
      });
      message.destroy();
      message.warning('请输入用户账号');
    }
  };

  handlerRoleSelect = (keys, items) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataView/updateState',
      payload: {
        currentRoleId: keys[0],
        currentRoleName: items[0].name,
      },
    });
  };

  renderRoleName = item => {
    let tag;
    if (item.publicUserType && item.publicOrgId) {
      tag = (
        <Tag color="green" style={{ marginLeft: 8 }}>
          公共角色
        </Tag>
      );
    }
    return (
      <>
        {item.name}
        {tag}
      </>
    );
  };

  renderRoleDescription = item => {
    let pubUserType;
    let publicOrg;
    let roleGroup;
    let roleSource;
    if (item.publicUserType) {
      pubUserType = (
        <div className="field-item info">
          <span className="label">用户类型</span>
          <span className="value">{item.userTypeRemark}</span>
        </div>
      );
    }
    if (item.publicOrgId) {
      publicOrg = (
        <div className="field-item info">
          <span className="label">{formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})}</span>
          <span className="value">{item.publicOrgName}</span>
        </div>
      );
    }
    if (item.dataRoleGroupName) {
      roleGroup = (
        <div className="field-item info">
          <span className="label">角色组</span>
          <span className="value">{item.dataRoleGroupName}</span>
        </div>
      );
    }
    if (item.roleSourceType) {
      roleSource = (
        <div className="field-item info">
          <span className="label">角色来源</span>
          <span className="value">{item.roleSourceTypeRemark}</span>
        </div>
      );
    }
    return (
      <div className="desc-box">
        <div className="field-item">{item.code}</div>
        {roleGroup}
        {roleSource}
        {publicOrg || pubUserType ? (
          <div className="public-box">
            {pubUserType}
            {publicOrg}
          </div>
        ) : null}
        <EffectDate isView effectiveFrom={item.effectiveFrom} effectiveTo={item.effectiveTo} />
      </div>
    );
  };

  renderCustomTool = ({ total }) => {
    return (
      <>
        <span style={{ marginLeft: 8 }}>{`共 ${total} 项`}</span>
        <div>
          <Search
            style={{ width: 180, marginRight: 8 }}
            placeholder="请输入用户账号"
            onChange={e => this.handlerAccountChange(e.target.value)}
            onSearch={this.getRoleList}
            onPressEnter={this.getRoleList}
          />
        </div>
      </>
    );
  };

  render() {
    const { loading, dataView } = this.props;
    const { currentRoleId, currentRoleName, roleList } = dataView;
    const roleListLoading = loading.effects['dataView/getRoleList'];
    const roleListProps = {
      title: '用户的数据角色列表',
      dataSource: roleList,
      showSearch: false,
      loading: roleListLoading,
      onSelectChange: this.handlerRoleSelect,
      customTool: this.renderCustomTool,
      itemField: {
        title: this.renderRoleName,
        description: this.renderRoleDescription,
      },
    };
    return (
      <Layout className={cls(styles['role-box'])}>
        <Sider width={420} className={cls('left-content', 'auto-height')} theme="light">
          <ListCard {...roleListProps} />
        </Sider>
        <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
          {currentRoleId ? (
            <DataAuthorType currentRoleName={currentRoleName} currentRoleId={currentRoleId} />
          ) : (
            <div className="blank-empty">
              <Empty image={empty} description="选择相应的角色项显示权限" />
            </div>
          )}
        </Content>
      </Layout>
    );
  }
}

export default DataView;
