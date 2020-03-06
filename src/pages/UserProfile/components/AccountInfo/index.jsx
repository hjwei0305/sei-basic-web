import React, { Fragment, Component, } from 'react';
import { Button, Popconfirm, } from 'antd';
import { ExtTable, ExtIcon, } from 'suid';
import { connect, } from 'dva';
import cls from 'classnames';
import { FormattedMessage, formatMessage, } from "umi-plugin-react/locale";
import { constants, userUtils, } from '@/utils';
import EidtModal from './FormModal';
import ResetModal from './ResetModal';

const { getCurrentUser, } = userUtils;
const { SERVER_PATH, } = constants;

@connect(({ userProfile, loading, }) => ({ userProfile, loading, }))
class AccountInfo extends Component {

  reloadData = _ => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleCloseModal = (visibleKey) => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'userProfile/updateState',
      payload: {
        [visibleKey]: false,
      },
    });
  }

  handleEvent = (type, row) => {
    const { dispatch, } = this.props;

    switch(type) {
      case 'add':
      case 'edit':
        dispatch({
          type: 'userProfile/updateState',
          payload: {
            currAccount: row,
            editAccountVisable: true,
          }
        })
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
          }
        });
        break;
      default:
        break;
    }
  }

  save = (data) => {
    const { dispatch, } = this.props;

    dispatch({
      type: 'userProfile/saveAccount',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.handleCloseModal('editAccountVisable');
        this.reloadData();
      }
    })

  }

  resetPwd = (data) => {
    const { dispatch, } = this.props;

    dispatch({
      type: 'userProfile/updatePwd',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.handleCloseModal('resetPwdVisable');
        this.reloadData();
      }
    })
  }

  getTableProps = () => {
    const user = getCurrentUser() || {};
    const toolBar = {
      left: (
        <Fragment>
          <Button
            type="primary"
            onClick={() => this.handleEvent('add') }
          >
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      )
    };
    const columns = [
      {
        title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
        key: "operation",
        width: 150,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (text, record) => (
          <span className={cls("action-box")}>
            <ExtIcon
              className="edit"
              onClick={_ => this.handleEvent('edit', record)}
              type="edit"
              ignore='true'
              tooltip={
                { title: '编辑' }
              }
              antd
            />
            <ExtIcon
              onClick={_ => this.handleEvent('password', record)}
              className="lock"
              type="lock"
              antd
              tooltip={
                { title: '更新密码' }
              }
            />
{/*            <Popconfirm
              placement="topLeft"
              title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
              onConfirm={_ => this.handleEvent('del', record)}
            >
              <ExtIcon
                className="del"
                type="delete"
                tooltip={
                  { title: '删除' }
                }
                antd
              />
            </Popconfirm>*/}
          </span>
        )
      },
      {
        title: "帐号",
        dataIndex: "account",
        width: 120,
        required: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 120,
        required: true,
      },
    ];

    return {
      columns,
      toolBar,
      bordered: false,
      store: {
        params: {
          userId: user.userId,
        },
        url: `${SERVER_PATH}/sei-auth/account/getByUserId`,
      },
    };
  }

  getEditModalProps = () => {
    const { loading, userProfile, } = this.props;
    const { editAccountVisable, currAccount, } = userProfile;

    return {
      save: this.save,
      editData: currAccount,
      visible: editAccountVisable,
      onClose: () => {
        this.handleCloseModal('editAccountVisable');
      },
      saving: loading.effects["userProfile/saveAccount"]
    };
  }

  getResetPwdModalProps = () => {
    const { loading, userProfile, } = this.props;
    const { resetPwdVisable, currAccount, } = userProfile;

    return {
      save: this.resetPwd,
      editData: currAccount,
      visible: resetPwdVisable,
      onClose: () => {
        this.handleCloseModal('resetPwdVisable');
      },
      saving: loading.effects["userProfile/updatePwd"]
    };
  }

  render() {
    const { userProfile, } = this.props;
    const { resetPwdVisable, editAccountVisable, } = userProfile;
    return (
      <Fragment>
        <ExtTable
          onTableRef={inst => this.tableRef = inst }
          {...this.getTableProps()}
        />
        {
          editAccountVisable
            ? <EidtModal {...this.getEditModalProps()} />
            : null
        }
        {
          resetPwdVisable
            ? <ResetModal {...this.getResetPwdModalProps()} />
            : null
        }
      </Fragment>
    );
  }
}

export default AccountInfo;
