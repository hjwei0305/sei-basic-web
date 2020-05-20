import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Avatar, Card, Empty, Input, List, Skeleton, Popconfirm, Tag, Layout } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import { constants } from '@/utils';
import RoleAdd from './Form/Add';
import RoleEdit from './Form/Edit';
import ExtAction from './ExtAction';
import DataAuthorType from './DataAuthorType';
import StationModal from '../Config/Station';
import UserModal from '../Config/User';
import styles from './index.less';

const { Search } = Input;
const { Sider, Content } = Layout;
const { ROLE_VIEW } = constants;

@connect(({ dataRole, dataRoleGroup, loading }) => ({ dataRole, dataRoleGroup, loading }))
class Role extends Component {
  static allValue = '';

  static data = [];

  static configRole = null;

  constructor(props) {
    super(props);
    const { dataRoleGroup } = this.props;
    this.state = {
      listData: [],
      delRoleId: null,
      currentRoleGroup: dataRoleGroup.currentRoleGroup,
    };
  }

  componentDidMount() {
    this.loadRoleList();
  }

  componentDidUpdate() {
    const { dataRole, dataRoleGroup } = this.props;
    const { currentRoleGroup: stateCurrentRoleGroup } = this.state;
    if (!isEqual(stateCurrentRoleGroup, dataRoleGroup.currentRoleGroup)) {
      const { currentRoleGroup } = dataRoleGroup;
      this.setState(
        {
          currentRoleGroup,
        },
        this.loadRoleList,
      );
    }
    if (!isEqual(this.data, dataRole.listData)) {
      const { listData } = dataRole;
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
        type: 'dataRole/getDataRoleList',
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
      type: 'dataRole/updateState',
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

  saveDataRole = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataRole/saveDataRole',
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

  delDataRole = (data, e) => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delRoleId: data.id,
      },
      () => {
        dispatch({
          type: 'dataRole/delDataRole',
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
      type: 'dataRole/updateState',
      payload: {
        currentRole,
      },
    });
  };

  handlerAction = (key, roleData) => {
    const { dispatch } = this.props;
    this.configRole = roleData;
    switch (key) {
      case ROLE_VIEW.CONFIG_STATION:
        dispatch({
          type: 'dataRole/updateState',
          payload: {
            showConfigStation: true,
          },
        });
        break;
      case ROLE_VIEW.CONFIG_USER:
        dispatch({
          type: 'dataRole/updateState',
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
      type: 'dataRole/updateState',
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
          公共角色
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
          <span className="label">用户类型</span>
          <span className="value">{row.userTypeRemark}</span>
        </div>
      );
    }
    if (row.publicOrgId) {
      publicOrg = (
        <div className="field-item info">
          <span className="label">组织机构</span>
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

  renderTitle = () => {
    const { dataRoleGroup } = this.props;
    const { currentRoleGroup } = dataRoleGroup;
    return (
      <>
        {currentRoleGroup.name}
        <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>角色列表</span>
      </>
    );
  };

  render() {
    const { loading, dataRole, dataRoleGroup } = this.props;
    const { currentRole, showConfigStation, showConfigUser } = dataRole;
    const { listData, delRoleId } = this.state;
    const listLoading = loading.effects['dataRole/getDataRoleList'];
    const saving = loading.effects['dataRole/saveDataRole'];
    const { currentRoleGroup } = dataRoleGroup;
    const dataAuthorTypeProps = {
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
          <Sider width={360} className={cls('left-content', 'auto-height')}>
            <Card
              title={this.renderTitle()}
              bordered={false}
              className={cls('list-box', 'auto-height')}
            >
              <div className="header-tool-box">
                <RoleAdd
                  currentRoleGroup={currentRoleGroup}
                  saving={saving}
                  saveDataRole={this.saveDataRole}
                />
                <Search
                  placeholder="输入名称关键字查询"
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
                            avatar={<Avatar icon="user" shape="square" />}
                            title={this.renderName(item)}
                            description={this.renderDescription(item)}
                          />
                          <div className="desc">{item.roleTypeRemark}</div>
                          <div className="arrow-box">
                            <ExtIcon type="right" antd />
                          </div>
                        </Skeleton>
                        <div className="tool-action" onClick={e => e.stopPropagation()}>
                          <RoleEdit
                            currentRoleGroup={currentRoleGroup}
                            saving={saving}
                            saveDataRole={this.saveDataRole}
                            roleData={item}
                          />
                          <Popconfirm
                            title={formatMessage({
                              id: 'global.delete.confirm',
                              defaultMessage: '确定要删除吗？提示：删除后不可恢复',
                            })}
                            onConfirm={e => this.delDataRole(item, e)}
                          >
                            {loading.effects['dataRole/delDataRole'] && delRoleId === item.id ? (
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
              <DataAuthorType {...dataAuthorTypeProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择角色项进行权限配置" />
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
