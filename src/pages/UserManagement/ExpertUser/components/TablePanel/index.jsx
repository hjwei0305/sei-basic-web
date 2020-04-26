import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, ExtIcon } from 'suid';
import { constants } from '@/utils';

import styles from '../../index.less';

const { APP_MODULE_BTN_KEY, SERVER_PATH } = constants;

@connect(({ expertUser, loading }) => ({ expertUser, loading }))
class TablePanel extends Component {
  state = {
    delRowId: null,
  }

  reloadData = (_) => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = (_) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expertUser/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expertUser/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expertUser/save',
      payload: {
        ...data,
      },
    }).then((res) => {
      if (res.success) {
        dispatch({
          type: 'expertUser/updateState',
          payload: {
            showModal: false,
          },
        });
        this.reloadData();
      }
    });
  };

  freeze = (record) => {
    const { dispatch } = this.props;
    this.setState({
      delRowId: record.id,
    }, (_) => {
      dispatch({
        type: 'expertUser/freeze',
        payload: {
          id: record.id,
          frozen: !record.frozen,
        },
      }).then((res) => {
        if (res.success) {
          this.setState({
            delRowId: null,
          });
          this.reloadData();
        }
      });
    });
  };

  handleConfig = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expertUser/updateState',
      payload: {
        showConfig: true,
        rowData,
      },
    });
  }

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['expertUser/freeze'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type={row.frozen ? 'unlock' : 'lock'} antd />;
  };

  getExtableProps = () => {
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
            <Popconfirm
              key={APP_MODULE_BTN_KEY.DELETE}
              placement="topLeft"
              title={record.frozen ? '确定要解冻吗？' : '确定要冻结吗？'}
              onConfirm={(_) => this.freeze(record)}
            >
              {
                this.renderDelBtn(record)
              }
            </Popconfirm>
            <ExtIcon
              className="tool"
              onClick={(_) => this.handleConfig(record)}
              type="tool"
              antd
            />
          </span>
        ),
      },
      {
        title: '帐号',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '研究领域',
        dataIndex: 'professionalDomainName',
        width: 120,
        required: true,
      },
      {
        title: '有效期',
        dataIndex: 'expireDate',
        width: 220,
        required: true,
      },
      {
        title: '冻结',
        dataIndex: 'frozen',
        width: 120,
        required: true,
        render: (text) => <Tag color={text ? 'red' : 'green'}>{text ? '冻结' : '可用'}</Tag>,
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
    return {
      bordered: false,
      columns,
      toolBar: toolBarProps,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/expertUser/findVoByPage`,
      },
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable onTableRef={(inst) => this.tableRef = inst} {...this.getExtableProps()} />
      </div>
    );
  }
}

export default TablePanel;
