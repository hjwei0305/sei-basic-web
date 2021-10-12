import React, { Component } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { connect } from 'dva';
import { Button, Popconfirm, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon, Space } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH, ONLINE_USER_BTN_KEY } = constants;
const { authAction } = utils;

@connect(({ onlineUser, loading }) => ({ onlineUser, loading }))
class OnLineUser extends Component {
  static tablRef;

  reloadData = () => {
    if (this.tablRef) {
      this.tablRef.remoteDataRefresh();
    }
  };

  handlerForceExit = user => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onlineUser/forceExit',
      payload: {
        rowId: get(user, 'id'),
        sid: get(user, 'sid'),
      },
      callback: res => {
        if (res.success) {
          this.reloadData();
        }
      },
    });
  };

  renderForceExitBtn = row => {
    const {
      loading,
      onlineUser: { rowId, sid },
    } = this.props;
    if (loading.effects['onlineUser/forceExit'] && rowId === row.id) {
      return <ExtIcon className="loading" type="loading" antd />;
    }
    if (sid === row.sid) {
      return (
        <ExtIcon
          className="del"
          type="logout"
          antd
          style={{ cursor: 'not-allowed', color: 'rgba(0,0,0,0.25)' }}
        />
      );
    }
    return (
      <Popconfirm
        placement="topRight"
        title={formatMessage(
          { id: 'basic_000407', defaultMessage: '确定要强制【{userName}】退出吗？' },
          { userName: get(row, 'userName') },
        )}
        onConfirm={() => this.handlerForceExit(row)}
      >
        <ExtIcon className="del" type="logout" antd />
      </Popconfirm>
    );
  };

  render() {
    const {
      onlineUser: { sid },
    } = this.props;
    const columns = [
      {
        title: '用户账号',
        dataIndex: 'userAccount',
        width: 160,
        required: true,
        render: (t, r) => {
          if (r.sid === sid) {
            return (
              <Space>
                {t}
                <Tag color="green" style={{ borderColor: 'transparent' }}>
                  我
                </Tag>
              </Space>
            );
          }
          return t;
        },
      },
      {
        title: '用户名称',
        dataIndex: 'userName',
        width: 180,
        required: true,
      },
      {
        title: '登录IP',
        dataIndex: 'loginIp',
        width: 160,
      },
      {
        title: '登录时间',
        dataIndex: 'loginDate',
        width: 180,
      },
      {
        title: '浏览器',
        dataIndex: 'browser',
        width: 90,
      },
      {
        title: '操作系统',
        dataIndex: 'osName',
        width: 120,
      },
    ];
    const oprCol = {
      title: formatMessage({
        id: 'global.operation',
        defaultMessage: formatMessage({ id: 'basic_000019', defaultMessage: '操作' }),
      }),
      key: 'operation',
      width: 80,
      align: 'center',
      dataIndex: 'id',
      className: 'action',
      required: true,
      render: (_, record) => (
        <span className={cls('action-box')}>{this.renderForceExitBtn(record)}</span>
      ),
    };
    if (authAction(<span authCode={ONLINE_USER_BTN_KEY.FORCE_EXIT} />)) {
      columns.splice(0, 0, oprCol);
    }
    const toolBarProps = {
      left: (
        <>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const tableProps = {
      toolBar: toolBarProps,
      columns,
      searchWidth: 320,
      lineNumber: false,
      allowCustomColumns: false,
      searchPlaceHolder: '输入用户账号、用户名称关键字',
      searchProperties: ['userAccount', 'userName'],
      remotePaging: true,
      onTableRef: ref => (this.tablRef = ref),
      rowClassName: record => {
        if (record.sid === sid) {
          return 'me-item';
        }
        return '';
      },
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-auth/loginLog/getOnlineUserByPage`,
      },
      sort: {
        field: { loginDate: 'desc', userAccount: null, userName: null },
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
      </div>
    );
  }
}

export default OnLineUser;
