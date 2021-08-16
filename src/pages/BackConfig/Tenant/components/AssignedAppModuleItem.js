import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Popconfirm, Button, Card, Drawer } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import styles from './AssignedAppModuleItem.less';

const { SERVER_PATH } = constants;

@connect(({ tenant, loading }) => ({ tenant, loading }))
class TenantAssignedAppModuleItem extends Component {
  static appModuleTableRef;

  constructor(props) {
    super(props);
    this.state = {
      removeAppModuleId: null,
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    const { onAssignedRef } = this.props;
    if (onAssignedRef) {
      onAssignedRef(this);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      tenant: { currentTenant },
    } = this.props;
    if (!isEqual(prevProps.tenant.currentTenant, currentTenant)) {
      this.setState(
        {
          removeAppModuleId: null,
          selectedRowKeys: [],
        },
        () => {
          dispatch({
            type: 'tenant/updateState',
            payload: {
              showAssignAppModule: false,
            },
          });
        },
      );
    }
  }

  reloadData = () => {
    if (this.appModuleTableRef) {
      this.appModuleTableRef.remoteDataRefresh();
    }
  };

  showAssignAppModule = () => {
    const { tenant, dispatch } = this.props;
    const { currentTenant } = tenant;
    dispatch({
      type: 'tenant/updateState',
      payload: {
        showAssignAppModule: true,
      },
    });
    dispatch({
      type: 'tenant/getUnAssignedAppModuleItemList',
      payload: {
        parentId: currentTenant.id,
      },
    });
  };

  removeAssignedAppModuleItem = childIds => {
    const { tenant, dispatch } = this.props;
    const { currentTenant } = tenant;
    if (childIds.length === 1) {
      this.setState({
        removeAppModuleId: childIds[0],
      });
    }
    dispatch({
      type: 'tenant/removeAssignedAppModuleItem',
      payload: {
        parentId: currentTenant.id,
        childIds,
      },
      callback: res => {
        if (res.success) {
          this.setState({
            removeAppModuleId: null,
            selectedRowKeys: [],
          });
          this.reloadData();
        }
      },
    });
  };

  batchRemoveAssignedAppModuleItem = () => {
    const { selectedRowKeys } = this.state;
    this.removeAssignedAppModuleItem(selectedRowKeys);
  };

  onCancelBatchRemoveAssignedAppModuleItem = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  handlerSelectRow = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  renderRemoveBtn = row => {
    const { loading } = this.props;
    const { removeAppModuleId } = this.state;
    if (loading.effects['tenant/removeAssignedAppModuleItem'] && removeAppModuleId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon tooltip={{ title: formatMessage({id: 'basic_000306', defaultMessage: '移除应用模块'}) }} className="del" type="minus-circle" antd />;
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { tenant, loading } = this.props;
    const { currentTenant } = tenant;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: formatMessage({id: 'basic_000019', defaultMessage: '操作'}) }),
        key: 'operation',
        width: 80,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')} onClick={e => e.stopPropagation()}>
            <Popconfirm
              placement="topLeft"
              title={formatMessage({
                id: 'global.remove.confirm',
                defaultMessage: '确定要移除吗？',
              })}
              onConfirm={() => this.removeAssignedAppModuleItem([record.id])}
            >
              {this.renderRemoveBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.code', defaultMessage: '代码' }),
        dataIndex: 'code',
        width: 260,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 360,
        required: true,
      },
      {
        title: formatMessage({ id: 'global.remark', defaultMessage: '说明' }),
        dataIndex: 'remark',
        width: 420,
        optional: true,
      },
    ];
    const hasSelected = selectedRowKeys.length > 0;
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" icon="plus" onClick={this.showAssignAppModule}>
            {formatMessage({id: 'basic_000309', defaultMessage: '分配应用模块'})}
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
          <Drawer
            placement="top"
            closable={false}
            mask={false}
            height={44}
            getContainer={false}
            style={{ position: 'absolute' }}
            visible={hasSelected}
          >
            <Button
              onClick={this.onCancelBatchRemoveAssignedAppModuleItem}
              disabled={loading.effects['tenant/removeAssignedAppModuleItem']}
            >
              {formatMessage({id: 'basic_000131', defaultMessage: '取消'})}
            </Button>
            <Popconfirm
              title={formatMessage({id: 'basic_000310', defaultMessage: '确定要移除选择的项目吗？'})}
              onConfirm={this.batchRemoveAssignedAppModuleItem}
            >
              <Button type="danger" loading={loading.effects['tenant/removeAssignedAppModuleItem']}>
                {formatMessage({id: 'basic_000133', defaultMessage: '批量移除'})}
              </Button>
            </Popconfirm>
            <span className={cls('select')}>{`{formatMessage({id: 'basic_000134', defaultMessage: '已选择'})} ${selectedRowKeys.length} 项`}</span>
          </Drawer>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      checkbox: true,
      onSelectRow: this.handlerSelectRow,
      selectedRowKeys,
      searchPlaceHolder: formatMessage({id: 'basic_000197', defaultMessage: '请输入代码或名称关键字查询'}),
      searchWidth: 260,
      cascadeParams: { parentId: currentTenant ? currentTenant.id : null },
      onTableRef: ref => (this.appModuleTableRef = ref),
      store: {
        url: `${SERVER_PATH}/sei-basic/tenantAppModule/getChildrenFromParentId`,
      },
      sort: {
        field: { code: 'asc', name: null, remark: null },
      },
    };
    return (
      <div className={cls(styles['tenant-app-module-box'])}>
        <Card
          title={<BannerTitle title={currentTenant.name} subTitle={formatMessage({id: 'basic_000311', defaultMessage: '可以使用的应用模块'})} />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
      </div>
    );
  }
}

export default TenantAssignedAppModuleItem;
