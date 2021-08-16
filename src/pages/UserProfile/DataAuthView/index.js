import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { Layout, Empty, Tag } from 'antd';
import { ListCard } from 'suid';
import { EffectDate } from '@/components';
import empty from '@/assets/item_empty.svg';
import { constants, userUtils } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';
import DataAuthorType from './components/DataAuthorType';
import styles from './index.less';

const { Sider, Content } = Layout;
const { SERVER_PATH } = constants;

@connect(({ userDataAuthView, loading }) => ({ userDataAuthView, loading }))
class DataView extends PureComponent {
  static currentUser;

  constructor(props) {
    super(props);
    this.currentUser = userUtils.getCurrentUser();
  }

  handlerRoleSelect = (keys, items) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userDataAuthView/updateState',
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
    if (item.dataRoleGroupName) {
      roleGroup = (
        <div className="field-item info">
          <span className="label">{formatMessage({id: 'basic_000104', defaultMessage: '角色组'})}</span>
          <span className="value">{item.dataRoleGroupName}</span>
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

  renderCustomTool = () => {
    return null;
  };

  render() {
    const { userDataAuthView } = this.props;
    const { currentRoleId, currentRoleName } = userDataAuthView;
    const roleListProps = {
      title: formatMessage({id: 'basic_000113', defaultMessage: '我的数据角色'}),
      showSearch: false,
      onSelectChange: this.handlerRoleSelect,
      customTool: this.renderCustomTool,
      itemField: {
        title: this.renderRoleName,
        description: this.renderRoleDescription,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/user/getDataRolesByAccount`,
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
            <DataAuthorType currentRoleName={currentRoleName} currentRoleId={currentRoleId} />
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
