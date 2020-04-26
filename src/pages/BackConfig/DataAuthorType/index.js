import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { Button, Popconfirm } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { APP_MODULE_BTN_KEY } = constants;
const { authAction } = utils;

@connect(({ dataAuthorType, loading }) => ({ dataAuthorType, loading }))
class DataAuthorType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
      list: [],
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    const { dataAuthorType } = this.props;
    if (!isEqual(prevState.list, dataAuthorType.list)) {
      this.setState({
        list: dataAuthorType.list,
      });
    }
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataAuthorType/queryList',
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataAuthorType/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataAuthorType/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataAuthorType/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'dataAuthorType/updateState',
            payload: {
              showModal: false,
            },
          });
          this.reloadData();
        }
      },
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
          type: 'dataAuthorType/del',
          payload: {
            id: record.id,
          },
          callback: res => {
            if (res.success) {
              this.setState({
                delRowId: null,
              });
              this.reloadData();
            }
          },
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataAuthorType/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['dataAuthorType/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  render() {
    const { dataAuthorType, loading } = this.props;
    const { list } = this.state;
    const { showModal, rowData } = dataAuthorType;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')}>
            {authAction(
              <ExtIcon
                key={APP_MODULE_BTN_KEY.EDIT}
                className="edit"
                onClick={() => this.edit(record)}
                type="edit"
                ignore="true"
                antd
              />,
            )}
            <Popconfirm
              key={APP_MODULE_BTN_KEY.DELETE}
              placement="topLeft"
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: '确定要删除吗？提示：删除后不可恢复',
              })}
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.code', defaultMessage: '代码' }),
        dataIndex: 'code',
        width: 260,
        optional: true,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: '权限对象类型',
        dataIndex: 'authorizeEntityTypeName',
        width: 160,
        required: true,
      },
      {
        title: '功能项',
        dataIndex: 'featureName',
        width: 140,
      },
    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['dataAuthorType/save'],
    };
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
        </>
      ),
    };
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable
          bordered={false}
          loading={loading.effects['dataAuthorType/queryList']}
          toolBar={toolBarProps}
          columns={columns}
          dataSource={list}
          searchProperties={['name', 'entityClassName', 'apiPath', 'appModuleName']}
          sort={{
            field: { code: 'asc', name: null, authorizeEntityTypeName: null, featureName: null },
          }}
        />
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default DataAuthorType;
