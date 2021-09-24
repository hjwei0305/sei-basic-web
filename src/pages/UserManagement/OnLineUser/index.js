import React, { Component } from 'react';
import cls from 'classnames';
import { Button } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;

class OnLineUser extends Component {
  static tablRef;

  reloadData = () => {
    if (this.tablRef) {
      this.tablRef.remoteDataRefresh();
    }
  };

  render() {
    const columns = [
      {
        title: '用户账号',
        dataIndex: 'userAccount',
        width: 120,
        required: true,
      },
      {
        title: '用户名称',
        dataIndex: 'userName',
        width: 100,
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
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-auth/loginLog/getOnlineUserByPage`,
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
