import React, { useMemo, useImperativeHandle, useCallback, useState } from 'react';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '@/utils';
import Users from './Users';
import styles from './index.less';

const { SERVER_PATH } = constants;
let tableRef;

const Feature = props => {
  const { featureRef, period, topNum } = props;
  const [showUser, setShowUser] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);

  const handlerSearchChange = v => {
    tableRef.handlerSearchChange(v);
  };

  const handlerPressEnter = () => {
    tableRef.handlerPressEnter();
  };

  const handlerSearch = v => {
    tableRef.handlerSearch(v);
  };

  useImperativeHandle(featureRef, () => ({
    reloadData: () => {
      if (tableRef) {
        tableRef.remoteDataRefresh();
      }
    },
    handlerSearchChange,
    handlerPressEnter,
    handlerSearch,
  }));

  const showUsers = useCallback(r => {
    setShowUser(true);
    setCurrentFeature(r);
  }, []);

  const extTableProps = useMemo(() => {
    const columns = [
      {
        title: '操作',
        key: 'operation',
        width: 80,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (t, r) => (
          <span className="action-box">
            <ExtIcon className="btn-icon" type="user" antd onClick={() => showUsers(r)} />
          </span>
        ),
      },
      {
        title: '功能',
        dataIndex: 'feature',
        width: 280,
        required: true,
      },
      {
        title: '访问次数',
        dataIndex: 'countNum',
        width: 100,
        required: true,
      },
      {
        title: '应用模块',
        dataIndex: 'appModule',
        width: 160,
        required: true,
      },
      {
        title: '路径',
        dataIndex: 'path',
        width: 360,
        required: true,
      },
      {
        title: '最近访问时间',
        dataIndex: 'accessTime',
        width: 180,
        required: true,
      },
    ];
    const tableProps = {
      onTableRef: ref => (tableRef = ref),
      showSearch: false,
      toolBar: null,
      lineNumber: false,
      allowCustomColumns: false,
      columns,
      className: styles['container-box '],
      store: {
        url: `${SERVER_PATH}/sei-auth/accessRecord/getTopFeatures`,
      },
      cascadeParams: {
        period,
        topNum,
      },
      sort: {
        field: { countNum: 'desc', accessTime: null, path: null, feature: null, appModule: null },
      },
    };
    return tableProps;
  }, [period, showUsers, topNum]);

  const closeUser = useCallback(() => {
    setShowUser(false);
  }, []);

  const usersProps = useMemo(() => {
    const userProps = {
      feature: currentFeature,
      showUser,
      closeUser,
      topNum,
      period,
    };
    return userProps;
  }, [closeUser, currentFeature, period, showUser, topNum]);

  return (
    <>
      <ExtTable {...extTableProps} />
      <Users {...usersProps} />
    </>
  );
};

export default Feature;
