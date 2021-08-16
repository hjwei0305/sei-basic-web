import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Layout, Empty, Tag } from 'antd';
import { ListCard } from 'suid';
import { EffectDate } from '@/components';
import empty from '@/assets/item_empty.svg';
import { constants, userUtils } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';
import AssignedFeature from './components/AssignedFeature';
import styles from './index.less';

const { Sider, Content } = Layout;
const { SERVER_PATH, ROLE_TYPE } = constants;

@connect(({ userFeatureAuthView, loading }) => ({ userFeatureAuthView, loading }))
class UserDataAuthView extends PureComponent {
  static currentUser;

  constructor(props) {
    super(props);
    this.currentUser = userUtils.getCurrentUser();
  }

  handlerRoleSelect = (keys, items) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userFeatureAuthView/updateState',
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
    let publicOrg;
    let roleGroup;
    let roleSource;
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
        {publicOrg ? <div className="public-box">{publicOrg}</div> : null}
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

  renderCustomTool = () => {
    return null;
  };

  render() {
    const { userFeatureAuthView } = this.props;
    const { currentRoleId, currentRoleName } = userFeatureAuthView;
    const roleListProps = {
      title: formatMessage({id: 'basic_000106', defaultMessage: '我的功能角色'}),
      showSearch: false,
      onSelectChange: this.handlerRoleSelect,
      customTool: this.renderCustomTool,
      itemField: {
        title: this.renderRoleName,
        description: this.renderRoleDescription,
        extra: this.renderRoleTypeRemark,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/user/getFeatureRolesByAccount`,
        params: {
          account: this.currentUser.account,
        },
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

export default UserDataAuthView;
