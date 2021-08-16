import React, { Component } from 'react';
import { ExtTable, ExtIcon } from 'suid';
import { Popconfirm, Button } from 'antd';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { constants } from '@/utils';
import EidtModal from './FormModal';

const { SERVER_PATH } = constants;

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
class PaymentInfo extends Component {
  state = {
    delRowId: null,
  };

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleCloseModal = visibleKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userProfile/updateState',
      payload: {
        [visibleKey]: false,
      },
    });
  };

  handleEvent = (type, row) => {
    const { dispatch } = this.props;

    switch (type) {
      case 'add':
      case 'edit':
        dispatch({
          type: 'userProfile/updateState',
          payload: {
            currAccount: row,
            editPaymentVisable: true,
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delRowId: row.id,
          },
          () => {
            dispatch({
              type: 'userProfile/deletePayment',
              payload: { id: row.id },
            }).then(res => {
              if (res && res.success) {
                this.setState({
                  delRowId: null,
                });
                this.reloadData();
              }
            });
          },
        );
        break;
      case 'password':
        dispatch({
          type: 'userProfile/updateState',
          payload: {
            resetPwdVisable: true,
            currAccount: row,
          },
        });
        break;
      default:
        break;
    }
  };

  save = data => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userProfile/savePayment',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.handleCloseModal('editPaymentVisable');
        this.reloadData();
      }
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['corporation/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getTableProps = () => {
    const { userProfile } = this.props;
    const { basicInfo } = userProfile;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: formatMessage({id: 'basic_000019', defaultMessage: '操作'}) }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <span className={cls('action-box')}>
            <ExtIcon
              onClick={() => this.handleEvent('edit', record)}
              className="edit"
              type="edit"
              antd
              tooltip={{ title: formatMessage({id: 'basic_000020', defaultMessage: '编辑'}) }}
            />
            <Popconfirm
              placement="topLeft"
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: formatMessage({id: 'basic_000021', defaultMessage: '确定要删除吗？提示：删除后不可恢复'}),
              })}
              onConfirm={() => this.handleEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: formatMessage({id: 'basic_000022', defaultMessage: '收款方名称'}),
        dataIndex: 'receiverName',
        width: 200,
      },
      {
        title: formatMessage({id: 'basic_000023', defaultMessage: '银行开户名'}),
        dataIndex: 'bankAccountName',
        width: 200,
      },
      {
        title: formatMessage({id: 'basic_000024', defaultMessage: '银行代码'}),
        dataIndex: 'bank.code',
        width: 200,
      },
      {
        title: formatMessage({id: 'basic_000025', defaultMessage: '银行名称'}),
        dataIndex: 'bank.name',
        width: 340,
      },
      {
        title: formatMessage({id: 'basic_000026', defaultMessage: '银行账号'}),
        dataIndex: 'bankAccountNumber',
        width: 200,
      },
      {
        title: formatMessage({id: 'basic_000027', defaultMessage: '排序'}),
        dataIndex: 'rank',
        width: 80,
      },
    ];
    return {
      toolBar: {
        left: (
          <>
            <Button
              type="primary"
              onClick={() => {
                this.handleEvent('add');
              }}
            >
              新建
            </Button>
            <Button onClick={this.reloadData}>刷新</Button>
          </>
        ),
      },
      columns,
      bordered: false,
      searchProperties: ['bank.code', 'bank.name', 'bankAccountNumber'],
      store: {
        params: {
          receiverCode: basicInfo ? basicInfo.employeeCode : '',
        },
        url: `${SERVER_PATH}/sei-fim/personalPaymentInfo/findByReceiverCode`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, userProfile } = this.props;
    const { editPaymentVisable, currAccount } = userProfile;

    return {
      save: this.save,
      editData: currAccount,
      visible: editPaymentVisable,
      onClose: () => {
        this.handleCloseModal('editPaymentVisable');
      },
      saving: loading.effects['userProfile/savePayment'],
    };
  };

  render() {
    const { userProfile } = this.props;
    const { editPaymentVisable } = userProfile;
    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getTableProps()} />
        {editPaymentVisable ? <EidtModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default PaymentInfo;
