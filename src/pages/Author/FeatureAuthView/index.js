import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { trim } from 'lodash';
import { Layout, Empty, Input, Tag } from 'antd';
import { ListCard, message } from 'suid';
import { EffectDate } from '@/components';
import { constants } from '@/utils';
import empty from '@/assets/item_empty.svg';
import { formatMessage } from 'umi-plugin-react/locale';
import AssignedFeature from './components/AssignedFeature';
import styles from './index.less';

const { Sider, Content } = Layout;

const { Search } = Input;

const { ROLE_TYPE } = constants;

@connect(({ featureView, loading }) => ({ featureView, loading }))
class DataView extends PureComponent {
  static account = '';

  handlerAccountChange = v => {
    this.account = trim(v);
  };

  getRoleList = () => {
    const { dispatch } = this.props;
    if (this.account) {
      dispatch({
        type: 'featureView/getRoleList',
        payload: {
          account: this.account,
        },
      });
    } else {
      dispatch({
        type: 'featureView/updateState',
        payload: {
          roleList: [],
        },
      });
      message.destroy();
      message.warning(formatMessage({id: 'basic_000395', defaultMessage: '请输入用户账号'}));
    }
  };

  handlerRoleSelect = (keys, items) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureView/updateState',
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
          {formatMessage({id: 'basic_000103', defaultMessage: '公共角色'})}
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
          <span className="label">{formatMessage({id: 'basic_000058', defaultMessage: '用户类型'})}</span>
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
    if (item.featureRoleGroupName) {
      roleGroup = (
        <div className="field-item info">
          <span className="label">{formatMessage({id: 'basic_000104', defaultMessage: '角色组'})}</span>
          <span className="value">{item.featureRoleGroupName}</span>
        </div>
      );
    }
    if (item.roleSourceType) {
      roleSource = (
        <div className="field-item info">
          <span className="label">{formatMessage({id: 'basic_000105', defaultMessage: '角色来源'})}</span>
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

  renderRoleTypeRemark = item => {
    switch (item.roleType) {
      case ROLE_TYPE.CAN_USE:
        return <span style={{ color: '#52c41a' }}>{item.roleTypeRemark}</span>;
      case ROLE_TYPE.CAN_ASSIGN:
        return <span style={{ color: '#fa8c16' }}>{item.roleTypeRemark}</span>;
      default:
    }
  };

  renderCustomTool = ({ total }) => {
    return (
      <>
        <span style={{ marginLeft: 8 }}>{formatMessage({id:'basic_000115', defaultMessage:'共{total}项'}, {total: {total}})}</span>
        <div>
          <Search
            style={{ width: 180, marginRight: 8 }}
            placeholder={formatMessage({id: 'basic_000395', defaultMessage: '请输入用户账号'})}
            onChange={e => this.handlerAccountChange(e.target.value)}
            onSearch={this.getRoleList}
            onPressEnter={this.getRoleList}
          />
        </div>
      </>
    );
  };

  render() {
    const { loading, featureView } = this.props;
    const { currentRoleId, currentRoleName, roleList } = featureView;
    const roleListLoading = loading.effects['featureView/getRoleList'];
    const roleListProps = {
      title: formatMessage({id: 'basic_000396', defaultMessage: '用户的功能角色列表'}),
      dataSource: roleList,
      showSearch: false,
      loading: roleListLoading,
      onSelectChange: this.handlerRoleSelect,
      customTool: this.renderCustomTool,
      itemField: {
        title: this.renderRoleName,
        description: this.renderRoleDescription,
        extra: this.renderRoleTypeRemark,
      },
    };
    return (
      <Layout className={cls(styles['role-box'])}>
        <Sider width={420} className={cls('left-content', 'auto-height')} theme="light">
          <ListCard {...roleListProps} />
        </Sider>
        <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
          {currentRoleId ? (
            <AssignedFeature currentRoleName={currentRoleName} currentRoleId={currentRoleId} />
          ) : (
            <div className="blank-empty">
              <Empty image={empty} description={formatMessage({id: 'basic_000107', defaultMessage: '选择相应的角色项显示权限'})} />
            </div>
          )}
        </Content>
      </Layout>
    );
  }
}

export default DataView;
