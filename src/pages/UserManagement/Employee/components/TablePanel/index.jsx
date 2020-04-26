import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import md5 from 'md5';
import { Button, message, Checkbox, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import ResetFormModal from './ResetModal';
import styles from '../../index.less';

const { APP_MODULE_BTN_KEY, SERVER_PATH } = constants;
const { authAction } = utils;

@connect(({ employee, loading }) => ({ employee, loading }))
class TablePanel extends Component {
  constructor(props) {
    super(props);
    const { currNode } = props.employee;
    this.state = {
      delRowId: null,
      includeSubNode: false,
      currNode,
    };
  }

  componentDidUpdate() {
    const {
      employee: { currNode },
    } = this.props;
    const { currNode: stateCurrNode } = this.state;
    if (!isEqual(stateCurrNode, currNode)) {
      this.setState(
        {
          currNode,
        },
        () => {
          this.reloadData();
        },
      );
    }
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch, employee } = this.props;
    if (employee.currNode) {
      dispatch({
        type: 'employee/updateState',
        payload: {
          showModal: true,
          rowData: null,
        },
      });
    } else {
      message.warn('请选择组织机构');
    }
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'employee/updateState',
          payload: {
            showModal: false,
          },
        });
        this.reloadData();
      }
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
          type: 'employee/del',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.reloadData();
          }
        });
      },
    );
  };

  handlCopy = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showCopyConfig: true,
        rowData,
      },
    });
  };

  handleConfig = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showEmployeeConfig: true,
        rowData,
      },
    });
  };

  handleReset = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showResetModal: true,
        rowData,
      },
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  closeResetFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showResetModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['employee/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  handleCheck = e => {
    const { checked } = e.target;
    this.setState(
      {
        includeSubNode: checked,
      },
      () => {
        this.reloadData();
      },
    );
  };

  resetPassword = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/resetPass',
      payload: {
        ...data,
        password: md5(data.password),
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'employee/updateState',
          payload: {
            showResetModal: false,
          },
        });
      }
    });
  };

  getExtableProps = () => {
    const { includeSubNode, currNode } = this.state;

    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 150,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            {authAction(
              <ExtIcon
                key={APP_MODULE_BTN_KEY.EDIT}
                className="edit"
                onClick={() => this.edit(record)}
                type="edit"
                tooltip={{ title: '编辑' }}
                ignore="true"
                antd
              />,
            )}
            <ExtIcon
              className="copy"
              onClick={() => this.handlCopy(record)}
              type="copy"
              tooltip={{ title: '复制角色' }}
              antd
            />
            <ExtIcon
              className="tool"
              onClick={() => this.handleConfig(record)}
              type="tool"
              tooltip={{ title: '配置角色' }}
              antd
            />
            <ExtIcon
              className="form"
              onClick={() => this.handleReset(record)}
              type="form"
              tooltip={{ title: '重置密码' }}
              antd
            />
          </span>
        ),
      },
      {
        title: '员工编号',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '员工名称',
        dataIndex: 'userName',
        width: 120,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 120,
        required: true,
        render: text => <Tag color={text ? 'red' : 'green'}>{text ? '已冻结' : '可用'}</Tag>,
      },
    ];
    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button key={APP_MODULE_BTN_KEY.CREATE} type="primary" onClick={this.add} ignore="true">
              <FormattedMessage id="global.add" defaultMessage="新建" />
            </Button>,
          )}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
          <Checkbox onChange={this.handleCheck}>包含子节点：</Checkbox>
        </>
      ),
    };
    return {
      bordered: false,
      remotePaging: true,
      searchProperties: ['code', 'userName'],
      columns,
      toolBar: toolBarProps,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
        params: {
          organizationId: currNode && currNode.id,
          includeSubNode,
        },
      },
    };
  };

  getFormModalProps = () => {
    const { currNode } = this.state;
    const { loading, employee } = this.props;
    const { showModal, rowData } = employee;

    return {
      save: this.save,
      rowData,
      showModal,
      parentData: currNode,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['employee/save'],
    };
  };

  getResetModalProps = () => {
    const { currNode } = this.state;
    const { loading, employee } = this.props;
    const { showResetModal, rowData } = employee;

    return {
      save: this.resetPassword,
      rowData,
      showModal: showResetModal,
      parentData: currNode,
      closeFormModal: this.closeResetFormModal,
      saving: loading.effects['employee/resetPass'],
    };
  };

  render() {
    const { employee } = this.props;
    const { showModal, showResetModal } = employee;

    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {showModal ? <FormModal {...this.getFormModalProps()} /> : null}
        {showResetModal ? <ResetFormModal {...this.getResetModalProps()} /> : null}
      </div>
    );
  }
}

export default TablePanel;
