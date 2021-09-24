import React, { Component } from 'react';
import cls from 'classnames';
import { Button } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;

class VisitLog extends Component {
  static tablRef;

  reloadData = () => {
    if (this.tablRef) {
      this.tablRef.remoteDataRefresh();
    }
  };

  render() {
    const columns = [
      {
        title: '登录账号',
        dataIndex: 'account',
        width: 120,
        required: true,
      },
      {
        title: '登录时间',
        dataIndex: 'loginDate',
        width: 180,
        required: true,
      },
      {
        title: '登录IP',
        dataIndex: 'loginIp',
        width: 160,
      },
      {
        title: '登录日志',
        dataIndex: 'loginLog',
        width: 280,
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
      {
        title: '登录结果',
        dataIndex: 'loginStatus',
        width: 100,
      },
      {
        title: '客户端代理',
        dataIndex: 'loginUserAgent',
        width: 120,
      },
      {
        title: '租户代码',
        dataIndex: 'tenantCode',
        width: 90,
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
      searchWidth: 260,
      lineNumber: false,
      allowCustomColumns: false,
      searchPlaceHolder: '输入姓名关键字',
      searchProperties: ['name'],
      remotePaging: true,
      onTableRef: ref => (this.tablRef = ref),
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-auth/loginLog/getLoginLogByPage`,
      },
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...tableProps} />
      </div>
    );
  }
}

export default VisitLog;
