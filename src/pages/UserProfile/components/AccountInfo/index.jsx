import React, { Component } from 'react';
import { ExtTable, ExtIcon } from 'suid';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { constants, userUtils } from '@/utils';
import EidtModal from './FormModal';
import ResetModal from './ResetModal';

const { getCurrentUser } = userUtils;
const { SERVER_PATH } = constants;

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
class AccountInfo extends Component {
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
            editAccountVisable: true,
          },
        });
        break;
      case 'del':
        dispatch({
          type: 'userProfile/delAccount',
          payload: row.id,
        }).then(res => {
          if (res && res.success) {
            this.reloadData();
          }
        });
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
      type: 'userProfile/saveAccount',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.handleCloseModal('editAccountVisable');
        this.reloadData();
      }
    });
  };

  resetPwd = data => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userProfile/updatePwd',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.handleCloseModal('resetPwdVisable');
        this.reloadData();
      }
    });
  };

  getTableProps = () => {
    const user = getCurrentUser() || {};
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon
              onClick={() => this.handleEvent('password', record)}
              className="lock"
              type="lock"
              antd
              tooltip={{ title: '更新密码' }}
            />
          </span>
        ),
      },
      {
        title: '帐号',
        dataIndex: 'account',
        width: 180,
        required: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 380,
        required: true,
      },
    ];
    return {
      columns,
      bordered: false,
      showSearch: false,
      store: {
        params: {
          userId: user.userId,
        },
        url: `${SERVER_PATH}/sei-auth/account/getByUserId`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, userProfile } = this.props;
    const { editAccountVisable, currAccount } = userProfile;

    return {
      save: this.save,
      editData: currAccount,
      visible: editAccountVisable,
      onClose: () => {
        this.handleCloseModal('editAccountVisable');
      },
      saving: loading.effects['userProfile/saveAccount'],
    };
  };

  getResetPwdModalProps = () => {
    const { loading, userProfile } = this.props;
    const { resetPwdVisable, currAccount } = userProfile;

    return {
      save: this.resetPwd,
      editData: currAccount,
      visible: resetPwdVisable,
      onClose: () => {
        this.handleCloseModal('resetPwdVisable');
      },
      saving: loading.effects['userProfile/updatePwd'],
    };
  };

  render() {
    const { userProfile } = this.props;
    const { resetPwdVisable, editAccountVisable } = userProfile;
    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getTableProps()} />
        {editAccountVisable ? <EidtModal {...this.getEditModalProps()} /> : null}
        {resetPwdVisable ? <ResetModal {...this.getResetPwdModalProps()} /> : null}
      </>
    );
  }
}

export default AccountInfo;
