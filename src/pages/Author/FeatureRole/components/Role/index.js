import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Empty, Input, List, Skeleton, Popconfirm, Tag, Layout } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import RoleAdd from './Form/Add';
import RoleEdit from './Form/Edit';
import ExtAction from './ExtAction';
import AssignedFeature from './AssignedFeature';
import StationModal from '../Config/Station';
import UserModal from '../Config/User';
import styles from './index.less';

const { Search } = Input;
const { Sider, Content } = Layout;
const { ROLE_VIEW, ROLE_TYPE } = constants;

@connect(({ featureRole, featureRoleGroup, loading }) => ({
  featureRole,
  featureRoleGroup,
  loading,
}))
class Role extends Component {
  static allValue = '';

  static data = [];

  static configRole = null;

  constructor(props) {
    super(props);
    const { featureRoleGroup } = this.props;
    this.state = {
      listData: [],
      delRoleId: null,
      currentRoleGroup: featureRoleGroup.currentRoleGroup,
    };
  }

  componentDidMount() {
    this.loadRoleList();
  }

  componentDidUpdate() {
    const { featureRole, featureRoleGroup, dispatch } = this.props;
    const { currentRoleGroup: stateCurrentRoleGroup } = this.state;
    if (!isEqual(stateCurrentRoleGroup, featureRoleGroup.currentRoleGroup)) {
      const { currentRoleGroup } = featureRoleGroup;
      this.setState(
        {
          currentRoleGroup,
        },
        () => {
          this.loadRoleList();
          dispatch({
            type: 'featureRole/updateState',
            payload: {
              currentRole: null,
              showAssignFeature: false,
            },
          });
        },
      );
    }
    if (!isEqual(this.data, featureRole.listData)) {
      const { listData } = featureRole;
      this.data = [...listData];
      this.setState({
        listData,
      });
    }
  }

  loadRoleList = () => {
    const { currentRoleGroup } = this.state;
    if (currentRoleGroup) {
      const { dispatch } = this.props;
      dispatch({
        type: 'featureRole/getFeatureRoleList',
        payload: {
          roleGroupId: currentRoleGroup.id,
        },
      });
    }
  };

  handlerSearchChange = v => {
    this.allValue = v;
  };

  handleCfg = role => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        currCfgRole: role,
      },
    });
  };

  handlerSearch = () => {
    let listData = [];
    if (this.allValue) {
      const valueKey = this.allValue.toLowerCase();
      listData = this.data.filter(
        ds =>
          ds.name.toLowerCase().indexOf(valueKey) > -1 ||
          ds.code.toLowerCase().indexOf(valueKey) > -1,
      );
    } else {
      listData = [...this.data];
    }
    this.setState({
      listData,
    });
  };

  saveFeatureRole = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/saveFeatureRole',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.loadRoleList();
          handlerPopoverHide && handlerPopoverHide();
        }
      },
    });
  };

  delFeatureRole = (data, e) => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delRoleId: data.id,
      },
      () => {
        dispatch({
          type: 'featureRole/delFeatureRole',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delRoleId: null,
              });
              this.loadRoleList();
            }
          },
        });
      },
    );
  };

  handlerRoleSelect = (currentRole, e) => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        currentRole,
        showAssignFeature: false,
      },
    });
  };

  handlerAction = (key, roleData) => {
    const { dispatch } = this.props;
    this.configRole = roleData;
    switch (key) {
      case ROLE_VIEW.CONFIG_STATION:
        dispatch({
          type: 'featureRole/updateState',
          payload: {
            showConfigStation: true,
          },
        });
        break;
      case ROLE_VIEW.CONFIG_USER:
        dispatch({
          type: 'featureRole/updateState',
          payload: {
            showConfigUser: true,
          },
        });
        break;
      default:
    }
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        showConfigUser: false,
        showConfigStation: false,
      },
    });
  };

  renderName = row => {
    let tag;
    if (row.publicUserType && row.publicOrgId) {
      tag = (
        <Tag color="green" style={{ marginLeft: 8 }}>
          {formatMessage({id: 'basic_000103', defaultMessage: '公共角色'})}
        </Tag>
      );
    }
    return (
      <>
        {row.name}
        {tag}
      </>
    );
  };

  renderDescription = row => {
    let pubUserType;
    let publicOrg;
    if (row.publicUserType) {
      pubUserType = (
        <div className="field-item info">
          <span className="label">{formatMessage({id: 'basic_000058', defaultMessage: '用户类型'})}</span>
          <span className="value">{row.userTypeRemark}</span>
        </div>
      );
    }
    if (row.publicOrgId) {
      publicOrg = (
        <div className="field-item info">
          <span className="label">{formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})}</span>
          <span className="value">{row.publicOrgName}</span>
        </div>
      );
    }
    return (
      <div className="desc-box">
        <div className="field-item">{row.code}</div>
        {publicOrg || pubUserType ? (
          <div className="public-box">
            {pubUserType}
            {publicOrg}
          </div>
        ) : null}
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

  render() {
    const { loading, featureRole, featureRoleGroup } = this.props;
    const { currentRole, showConfigStation, showConfigUser } = featureRole;
    const { listData, delRoleId } = this.state;
    const listLoading = loading.effects['featureRole/getFeatureRoleList'];
    const saving = loading.effects['featureRole/saveFeatureRole'];
    const { currentRoleGroup } = featureRoleGroup;
    const assignedFeatureProps = {
      currentRole,
    };
    const stationModalProps = {
      rowData: this.configRole,
      showModal: showConfigStation,
      closeFormModal: this.closeFormModal,
    };
    const userModalProps = {
      rowData: this.configRole,
      showModal: showConfigUser,
      closeFormModal: this.closeFormModal,
    };
    return (
      <div className={cls(styles['role-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className={cls('left-content', 'auto-height')} theme="light">
            <Card
              title={<BannerTitle title={currentRoleGroup.name} subTitle={formatMessage({id: 'basic_000379', defaultMessage: '角色列表'})} />}
              bordered={false}
              className={cls('list-box', 'auto-height')}
            >
              <div className="header-tool-box">
                <RoleAdd
                  currentRoleGroup={currentRoleGroup}
                  saving={saving}
                  saveFeatureRole={this.saveFeatureRole}
                />
                <Search
                  placeholder={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}
                  onChange={e => this.handlerSearchChange(e.target.value)}
                  onSearch={this.handlerSearch}
                  onPressEnter={this.handlerSearch}
                  style={{ width: 172 }}
                />
              </div>
              <div className="role-list-body">
                <ScrollBar>
                  <List
                    dataSource={listData}
                    loading={listLoading}
                    renderItem={item => (
                      <List.Item
                        key={item.id}
                        onClick={e => this.handlerRoleSelect(item, e)}
                        className={cls({
                          [cls('row-selected')]: currentRole && item.id === currentRole.id,
                        })}
                      >
                        <Skeleton avatar loading={listLoading} active>
                          <List.Item.Meta
                            title={this.renderName(item)}
                            description={this.renderDescription(item)}
                          />
                          <div className="desc">{this.renderRoleTypeRemark(item)}</div>
                          <div className="arrow-box">
                            <ExtIcon type="right" antd />
                          </div>
                        </Skeleton>
                        <div className="tool-action" onClick={e => e.stopPropagation()}>
                          <RoleEdit
                            currentRoleGroup={currentRoleGroup}
                            saving={saving}
                            saveFeatureRole={this.saveFeatureRole}
                            roleData={item}
                          />
                          <Popconfirm
                            title={formatMessage({
                              id: 'global.delete.confirm',
                              defaultMessage: formatMessage({id: 'basic_000021', defaultMessage: '确定要删除吗？提示：删除后不可恢复'}),
                            })}
                            onConfirm={e => this.delFeatureRole(item, e)}
                          >
                            {loading.effects['featureRole/delFeatureRole'] &&
                            delRoleId === item.id ? (
                              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
                            ) : (
                              <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
                            )}
                          </Popconfirm>
                          <ExtAction roleData={item} onAction={this.handlerAction} />
                        </div>
                      </List.Item>
                    )}
                  />
                </ScrollBar>
              </div>
            </Card>
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 4 }}>
            {currentRole ? (
              <AssignedFeature {...assignedFeatureProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description={formatMessage({id: 'basic_000380', defaultMessage: '选择角色列表项进行功能项配置'})} />
              </div>
            )}
          </Content>
        </Layout>
        <StationModal {...stationModalProps} />
        <UserModal {...userModalProps} />
      </div>
    );
  }
}

export default Role;
