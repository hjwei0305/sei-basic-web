import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FeatureRoleModal from './components/Config/FeatureRole';
import DataRoleModal from './components/Config/DataRole';
import ExtAction from './components/ExtAction';
import FormModal from './FormModal';
import styles from './index.less';

const { SERVER_PATH, SUPPLIER_ACTION } = constants;

@connect(({ supplierUser, loading }) => ({ supplierUser, loading }))
class SupplierUser extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
    };
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUser/updateState',
      payload: {
        showFormModal: true,
        currentSupplier: null,
      },
    });
  };

  edit = currentSupplier => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUser/updateState',
      payload: {
        showFormModal: true,
        currentSupplier,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUser/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
          this.reloadData();
        }
      },
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'supplierUser/del',
          payload: {
            id: record.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delRowId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUser/updateState',
      payload: {
        showFormModal: false,
        showConfigFeatrueRole: false,
        showConfigDataRole: false,
        currentSupplier: null,
      },
    });
  };

  handlerAction = (key, supplier) => {
    const { dispatch } = this.props;
    const payload = { currentSupplier: supplier };
    const extData = {};
    switch (key) {
      case SUPPLIER_ACTION.FEATURE_ROLE:
        extData.showConfigFeatrueRole = true;
        break;
      case SUPPLIER_ACTION.DATA_ROLE:
        extData.showConfigDataRole = true;
        break;
      default:
    }
    dispatch({
      type: 'supplierUser/updateState',
      payload: {
        ...payload,
        ...extData,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['supplierUser/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  render() {
    const { supplierUser, loading } = this.props;
    const {
      showFormModal,
      showConfigDataRole,
      showConfigFeatrueRole,
      currentSupplier,
    } = supplierUser;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: formatMessage({id: 'basic_000019', defaultMessage: '操作'}) }),
        key: 'operation',
        width: 120,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon
              className="edit"
              onClick={() => this.edit(record)}
              type="edit"
              ignore="true"
              antd
            />
            <Popconfirm
              placement="topLeft"
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: formatMessage({id: 'basic_000021', defaultMessage: '确定要删除吗？提示：删除后不可恢复'}),
              })}
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
            <ExtAction supplierData={record} onAction={this.handlerAction} />
          </span>
        ),
      },
      {
        title: '帐号',
        dataIndex: 'code',
        width: 120,
        required: true,
        render: (text, record) => {
          if (record.frozen) {
            return (
              <>
                {text}
                <Tag color="red" style={{ marginLeft: 8 }}>
                  已冻结
                </Tag>
              </>
            );
          }
          return text;
        },
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '供应商代码',
        dataIndex: 'supplierCode',
        width: 120,
        required: true,
      },
      {
        title: '供应商名称',
        dataIndex: 'supplierName',
        width: 220,
        required: true,
      },
    ];
    const formModalProps = {
      save: this.save,
      currentSupplier,
      showFormModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['supplierUser/save'],
    };
    const featureRoleModalProps = {
      currentSupplier,
      showModal: showConfigFeatrueRole,
      closeModal: this.closeFormModal,
    };
    const dataRoleModalProps = {
      currentSupplier,
      showModal: showConfigDataRole,
      closeModal: this.closeFormModal,
    };
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add} ignore="true">
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const tableProps = {
      bordered: false,
      columns,
      toolBar: toolBarProps,
      searchWidth: 260,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/supplierUser/findVoByPage`,
      },
      sort: {
        field: { code: 'asc', name: null, supplierCode: null, supplierName: null },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
        <FormModal {...formModalProps} />
        <FeatureRoleModal {...featureRoleModalProps} />
        <DataRoleModal {...dataRoleModalProps} />
      </div>
    );
  }
}

export default SupplierUser;
