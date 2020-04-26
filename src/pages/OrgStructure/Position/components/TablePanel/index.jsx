import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { Button, Popconfirm, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import CopyModal from './CopyModal';
import styles from '../../index.less';

const { APP_MODULE_BTN_KEY } = constants;
const { authAction } = utils;

@connect(({ position, loading }) => ({ position, loading }))
class TablePanel extends Component {
  state = {
    delRowId: null,
    list: [],
  }

  componentDidUpdate(_prevProps, prevState) {
    const { list } = this.props.position;
    if (!isEqual(prevState.list, list)) {
      this.setState({
        list,
      });
    }
  }

  reloadData = (_) => {
    const { dispatch, position } = this.props;
    const { currNode } = position;

    if (currNode) {
      dispatch({
        type: 'position/queryListByOrgId',
        payload: {
          organizationId: currNode.id,
        },
      });
    }
  };

  add = (_) => {
    const { dispatch, position } = this.props;
    if (position.currNode) {
      dispatch({
        type: 'position/updateState',
        payload: {
          showModal: true,
          rowData: null,
        },
      });
    } else {
      message.warn('请选择组织机构');
    }
  };

  edit = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/save',
      payload: {
        ...data,
      },
    }).then((res) => {
      if (res.success) {
        dispatch({
          type: 'position/updateState',
          payload: {
            showModal: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = (record) => {
    const { dispatch } = this.props;
    this.setState({
      delRowId: record.id,
    }, (_) => {
      dispatch({
        type: 'position/del',
        payload: {
          id: record.id,
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

  handleCopyToOrgNodes = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/copyTo',
      payload: {
        ...data,
      },
    }).then((res) => {
      if (res.success) {
        dispatch({
          type: 'position/updateState',
          payload: {
            showCopyModal: false,
          },
        });
        this.reloadData();
      }
    });
  }

  handlCopy = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/updateState',
      payload: {
        showCopyModal: true,
        rowData,
      },
    });
  }

  handleConfig = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/updateState',
      payload: {
        showPosionConfig: true,
        rowData,
      },
    });
  }

  closeFormModal = (_) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/updateState',
      payload: {
        showModal: false,
        showCopyModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['position/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" tooltip={{ title: '删除' }} antd />;
  };

  getExtableProps = () => {
    const { list } = this.state;
    const { loading } = this.props;

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
            {
              authAction(
                <ExtIcon
                  key={APP_MODULE_BTN_KEY.EDIT}
                  className="edit"
                  onClick={(_) => this.edit(record)}
                  type="edit"
                  tooltip={
                    { title: '编辑' }
                  }
                  ignore="true"
                  antd
                />,
              )
            }
            <Popconfirm
              key={APP_MODULE_BTN_KEY.DELETE}
              placement="topLeft"
              title={formatMessage({ id: 'global.delete.confirm', defaultMessage: '确定要删除吗？提示：删除后不可恢复' })}
              onConfirm={(_) => this.del(record)}
            >
              {
                this.renderDelBtn(record)
              }
            </Popconfirm>
            <ExtIcon
              className="copy"
              onClick={(_) => this.handlCopy(record)}
              type="copy"
              tooltip={
                { title: '复制岗位' }
              }
              antd
            />
            <ExtIcon
              className="tool"
              onClick={(_) => this.handleConfig(record)}
              type="tool"
              tooltip={
                { title: '配置岗位' }
              }
              antd
            />
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.code', defaultMessage: '代码' }),
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 120,
        required: true,
      },
      {
        title: '岗位类别',
        dataIndex: 'positionCategoryName',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <>
          {
            authAction(
              <Button
                key={APP_MODULE_BTN_KEY.CREATE}
                type="primary"
                onClick={this.add}
                ignore="true"
              >
                <FormattedMessage id="global.add" defaultMessage="新建" />
              </Button>,
            )
          }
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    return {
      bordered: false,
      height: '100%',
      columns,
      loading: loading.effects['position/queryList'],
      toolBar: toolBarProps,
      dataSource: list,
    };
  };

  getFormModalProps = () => {
    const { loading, position } = this.props;
    const { showModal, rowData, currNode } = position;

    return {
      save: this.save,
      rowData,
      showModal,
      parentData: currNode,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['position/save'],
    };
  };

  getCopyModalProps = () => {
    const { loading, position } = this.props;
    const { showCopyModal, rowData } = position;

    return {
      save: this.handleCopyToOrgNodes,
      rowData,
      showModal: showCopyModal,
      closeModal: this.closeFormModal,
      saving: loading.effects['position/copyTo'],
    };
  };

  render() {
    const { position } = this.props;
    const { showModal, showCopyModal } = position;

    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...this.getExtableProps()} />
        {
          showModal
            ? <FormModal {...this.getFormModalProps()} />
            : null
        }
        {
          showCopyModal
            ? <CopyModal {...this.getCopyModalProps()} />
            : null
        }
      </div>
    );
  }
}

export default TablePanel;
