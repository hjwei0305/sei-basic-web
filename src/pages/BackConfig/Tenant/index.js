import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { omit, isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Input, Empty, Pagination, List, Skeleton, Popconfirm, Tag, Layout } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import empty from '@/assets/item_empty.svg';
import TenantAdd from './components/TenantForm/Add';
import TenantEdit from './components/TenantForm/Edit';
import AdminAdd from './components/AdminForm/Add';
import AdminEdit from './components/AdminForm/Edit';
import AssignedAppModuleItem from './components/AssignedAppModuleItem';
import UnAssignAppModuleItem from './components/UnAssignAppModuleItem';
import styles from './index.less';

const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ tenant, loading }) => ({ tenant, loading }))
class Tenant extends Component {
  static allValue = '';

  static data = [];

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      delTenantId: null,
      pagination: {
        current: 1,
        pageSize: 30,
        total: 0,
      },
    };
  }

  componentDidUpdate() {
    const { tenant } = this.props;
    if (!isEqual(this.data, tenant.listData)) {
      const { pagination } = this.state;
      const { listData } = tenant;
      this.data = [...listData];
      this.setState({
        listData,
        pagination: {
          ...pagination,
          total: listData.length,
        },
      });
    }
  }

  handlerSearchChange = v => {
    this.allValue = v;
  };

  handlerSearch = () => {
    const { pagination } = this.state;
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
      pagination: {
        ...pagination,
        total: listData.length,
      },
    });
  };

  reloadTenantData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/getTenantList',
    });
  };

  saveTenant = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/saveTenant',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'tenant/getTenantList',
          });
          handlerPopoverHide && handlerPopoverHide();
        }
      },
    });
  };

  delTenant = (data, e) => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    this.setState(
      {
        delTenantId: data.id,
      },
      () => {
        dispatch({
          type: 'tenant/delTenant',
          payload: {
            id: data.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delTenantId: null,
              });
              this.reloadTenantData();
            }
          },
        });
      },
    );
  };

  handlerPageChange = (current, pageSize) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          current,
          pageSize,
        },
      },
      () => {
        const newData = this.getLocalFilterData();
        const listData = newData.slice((current - 1) * pageSize, current * pageSize);
        this.setState({
          listData,
        });
      },
    );
  };

  handlerGroupSelect = (currentTenant, e) => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/updateState',
      payload: {
        currentTenant,
      },
    });
    dispatch({
      type: 'feature/updateState',
      payload: {
        showFeatureItem: false,
        currentPageRow: null,
      },
    });
  };

  saveTenantAdmin = (data, handlerPopoverHide) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/saveTenantAdmin',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'tenant/getTenantList',
          });
          handlerPopoverHide && handlerPopoverHide();
        }
      },
    });
  };

  closeAssignAppModuleItem = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/updateState',
      payload: {
        showAssignAppModule: false,
      },
    });
  };

  renderAdmin = item => {
    const { loading } = this.props;
    const saving = loading.effects['tenant/saveTenantAdmin'];
    const tenantData = omit(item, ['employeeDto']);
    if (!item.employeeDto) {
      return (
        <div style={{ display: 'inline-block' }} onClick={e => e.stopPropagation()}>
          <AdminAdd
            saving={saving}
            tenantData={tenantData}
            saveTenantAdmin={this.saveTenantAdmin}
          />
        </div>
      );
    }
    return (
      <div style={{ display: 'inline-block' }} onClick={e => e.stopPropagation()}>
        <AdminEdit
          saving={saving}
          tenantData={tenantData}
          saveTenantAdmin={this.saveTenantAdmin}
          tenantAdmin={item.employeeDto}
        />
      </div>
    );
  };

  render() {
    const { loading, tenant } = this.props;
    const { currentTenant, unAssignListData, showAssignAppModule } = tenant;
    const { allValue, listData, pagination, delTenantId } = this.state;
    const listLoading = loading.effects['tenant/getTenantList'];
    const saving = loading.effects['tenant/saveTenant'];
    const assignedAppModuleItemProps = {
      currentTenant,
    };
    const unAssignAppModuleItemProps = {
      loading: loading.effects['tenant/getUnAssignedAppModuleItemList'],
      unAssignListData,
      assignAppModuleItem: this.assignAppModuleItem,
      showAssignAppModule,
      closeAssignFeatureItem: this.closeAssignAppModuleItem,
      assigning: loading.effects['tenant/assignAppModuleItem'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={320} className="auto-height" theme="light">
            <Card title="租户列表" bordered={false} className="left-content">
              <div className="header-tool-box">
                <TenantAdd saving={saving} saveTenant={this.saveTenant} />
                <Search
                  placeholder="输入名称关键字查询"
                  defaultValue={allValue}
                  onChange={e => this.handlerSearchChange(e.target.value)}
                  onSearch={this.handlerSearch}
                  onPressEnter={this.handlerSearch}
                  style={{ width: 172 }}
                />
              </div>
              <div className="list-body">
                <ScrollBar>
                  <List
                    dataSource={listData}
                    loading={listLoading}
                    renderItem={item => (
                      <List.Item
                        key={item.id}
                        onClick={e => this.handlerGroupSelect(item, e)}
                        className={cls({
                          [cls('row-selected')]: currentTenant && item.id === currentTenant.id,
                        })}
                      >
                        <Skeleton loading={listLoading} active>
                          <List.Item.Meta title={item.name} description={item.code} />
                          <div className="desc">
                            {item.frozen ? <Tag color="red">已冻结</Tag> : null}
                          </div>
                          <div className="arrow-box">
                            <ExtIcon type="right" antd />
                          </div>
                        </Skeleton>
                        <div className="tool-action" onClick={e => e.stopPropagation()}>
                          <TenantEdit
                            saving={saving}
                            saveTenant={this.saveTenant}
                            tenantRootOrganization={item.organizationDto}
                            tenantData={item}
                          />
                          <Popconfirm
                            title={formatMessage({
                              id: 'global.delete.confirm',
                              defaultMessage: '确定要删除吗？提示：删除后不可恢复',
                            })}
                            onConfirm={e => this.delTenant(item, e)}
                          >
                            {loading.effects['tenant/delTenant'] && delTenantId === item.id ? (
                              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
                            ) : (
                              <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
                            )}
                          </Popconfirm>
                          {this.renderAdmin(item)}
                        </div>
                      </List.Item>
                    )}
                  />
                </ScrollBar>
              </div>
              <div className="list-page-bar">
                <Pagination simple onChange={this.handlerPageChange} {...pagination} />
              </div>
            </Card>
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {currentTenant ? (
              <AssignedAppModuleItem {...assignedAppModuleItemProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="选择左边的租户来配置相关要素" />
              </div>
            )}
          </Content>
        </Layout>
        <UnAssignAppModuleItem {...unAssignAppModuleItemProps} />
      </div>
    );
  }
}
export default Tenant;
