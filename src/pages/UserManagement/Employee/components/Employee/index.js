import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Card, Tag } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import FormModal from './FormModal';
import ResetModal from './ResetModal';
import StationModal from '../Config/Station';
import FeatureRoleModal from '../Config/FeatureRole';
import DataRoleModal from '../Config/DataRole';
import ExtAction from './ExtAction';
import styles from './index.less';

const { SERVER_PATH, EMPLOYEE_ACTION } = constants;

@connect(({ employee, loading }) => ({ employee, loading }))
class EmployeeHome extends Component {
  static tableRef;

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showFormModal: true,
        currentEmployee: null,
      },
    });
  };

  edit = currentEmployee => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showFormModal: true,
        currentEmployee,
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
      callback: res => {
        if (res.success) {
          this.closeFormModal();
          this.reloadData();
        }
      },
    });
  };

  resetPassword = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/resetPassword',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
        }
      },
    });
  };

  closeFormModal = (currentOrgNode = null) => {
    const { dispatch } = this.props;
    const st = {
      showFormModal: false,
      showCopyModal: false,
      showResetPasswordModal: false,
      showConfigFeatrueRole: false,
      showConfigStaion: false,
      showConfigDataRole: false,
      currentEmployee: null,
    };
    if (currentOrgNode) {
      st.currentOrgNode = currentOrgNode;
    }
    dispatch({
      type: 'employee/updateState',
      payload: {
        ...st,
      },
    });
  };

  handleCopyToOrgNodes = (data, copyToOrgNode) => {
    const { dispatch, employee } = this.props;
    dispatch({
      type: 'employee/copyTo',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          const { currentOrgNode } = employee;
          // 复制的组织机构与当前相同，则只刷新岗位列表即可
          if (currentOrgNode.id === copyToOrgNode.id) {
            this.closeFormModal();
            this.reloadData();
          } else {
            this.closeFormModal(copyToOrgNode);
          }
        }
      },
    });
  };

  handlerAction = (key, employee) => {
    const { dispatch } = this.props;
    const payload = { currentEmployee: employee };
    const extData = {};
    switch (key) {
      case EMPLOYEE_ACTION.RESET_PASSWORD:
        extData.showResetPasswordModal = true;
        break;
      case EMPLOYEE_ACTION.COPY_ROLE:
        extData.showCopyModal = true;
        break;
      case EMPLOYEE_ACTION.STATION:
        extData.showConfigStaion = true;
        break;
      case EMPLOYEE_ACTION.FEATURE_ROLE:
        extData.showConfigFeatrueRole = true;
        break;
      case EMPLOYEE_ACTION.DATA_ROLE:
        extData.showConfigDataRole = true;
        break;
      default:
    }
    dispatch({
      type: 'employee/updateState',
      payload: {
        ...payload,
        ...extData,
      },
    });
  };

  render() {
    const { loading, employee } = this.props;
    const {
      showFormModal,
      showResetPasswordModal,
      showConfigStaion,
      showConfigFeatrueRole,
      showConfigDataRole,
      currentOrgNode,
      currentEmployee,
    } = employee;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 120,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon className="edit" onClick={() => this.edit(record)} type="edit" antd />
            <ExtAction employeeData={record} onAction={this.handlerAction} />
          </span>
        ),
      },
      {
        title: '员工编号',
        dataIndex: 'code',
        width: 120,
      },
      {
        title: '员工姓名',
        dataIndex: 'userName',
        width: 180,
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
        title: '组织机构',
        dataIndex: 'organizationName',
        width: 420,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <>
          <Button type="primary" onClick={this.add}>
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      cascadeParams: { organizationId: currentOrgNode ? currentOrgNode.id : null },
      onTableRef: ref => (this.tableRef = ref),
      remotePaging: true,
      searchPlaceHolder: '请输入代码或名称关键字查询',
      searchWidth: 260,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
        params: { includeSubNode: true },
      },
    };
    const formModalProps = {
      save: this.save,
      currentOrgNode,
      currentEmployee,
      showFormModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['employee/save'],
    };
    const resetModalProps = {
      save: this.resetPassword,
      currentEmployee,
      showModal: showResetPasswordModal,
      closeModal: this.closeFormModal,
      saving: loading.effects['employee/resetPassword'],
    };
    const stationModalProps = {
      currentEmployee,
      showModal: showConfigStaion,
      closeModal: this.closeFormModal,
    };
    const featureRoleModalProps = {
      currentEmployee,
      showModal: showConfigFeatrueRole,
      closeModal: this.closeFormModal,
    };
    const dataRoleModalProps = {
      currentEmployee,
      showModal: showConfigDataRole,
      closeModal: this.closeFormModal,
    };
    return (
      <div className={cls(styles['employee-box'])}>
        <Card
          title={<BannerTitle title={currentOrgNode.name} subTitle="员工列表" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
        <ResetModal {...resetModalProps} />
        <StationModal {...stationModalProps} />
        <FeatureRoleModal {...featureRoleModalProps} />
        <DataRoleModal {...dataRoleModalProps} />
      </div>
    );
  }
}

export default EmployeeHome;
