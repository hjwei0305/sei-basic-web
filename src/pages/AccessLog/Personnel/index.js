import React, { useMemo, useImperativeHandle, useState, useCallback } from 'react';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '@/utils';
import Features from './Features';

const { SERVER_PATH } = constants;

let tableRef;

const Personnel = props => {
  const { personnelRef, period, topNum } = props;
  const [showFeature, setShowFeature] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handlerSearchChange = v => {
    tableRef.handlerSearchChange(v);
  };

  const handlerPressEnter = () => {
    tableRef.handlerPressEnter();
  };

  const handlerSearch = v => {
    tableRef.handlerSearch(v);
  };

  useImperativeHandle(personnelRef, () => ({
    reloadData: () => {
      if (personnelRef) {
        personnelRef.remoteDataRefresh();
      }
    },
    handlerSearchChange,
    handlerPressEnter,
    handlerSearch,
  }));

  const showFeatures = useCallback(r => {
    setShowFeature(true);
    setCurrentUser(r);
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
            <ExtIcon className="btn-icon" type="share-alt" antd onClick={() => showFeatures(r)} />
          </span>
        ),
      },
      {
        title: '用户账号',
        dataIndex: 'userAccount',
        width: 180,
        required: true,
      },
      {
        title: '用户名称',
        dataIndex: 'userName',
        width: 220,
        required: true,
      },
      {
        title: '访问次数',
        dataIndex: 'countNum',
        width: 100,
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
      store: {
        url: `${SERVER_PATH}/sei-auth/accessRecord/getTopUsers`,
      },
      cascadeParams: {
        period,
        topNum,
      },
      sort: {
        field: { countNum: 'desc', accessTime: null, userName: null, userAccount: null },
      },
    };
    return tableProps;
  }, [period, showFeatures, topNum]);

  const closeFeature = useCallback(() => {
    setShowFeature(false);
  }, []);

  const featuresProps = useMemo(() => {
    const userProps = {
      user: currentUser,
      showFeature,
      closeFeature,
      topNum,
      period,
    };
    return userProps;
  }, [closeFeature, currentUser, period, showFeature, topNum]);

  return (
    <>
      <ExtTable {...extTableProps} />
      <Features {...featuresProps} />
    </>
  );
};

export default Personnel;
