import React, { Component, Fragment } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { Button, Popconfirm } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon } from 'suid';
import { PageWrapper } from '@/components';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { APP_MODULE_BTN_KEY } = constants;
const { authAction } = utils;

@withRouter
@connect(({ positionCategory, loading }) => ({ positionCategory, loading }))
class PositionCategory extends Component {
  state = {
    delRowId: null,
    list: [],
  };

  componentDidUpdate(_prevProps, prevState) {
    const { list } = this.props.positionCategory;
    if (!isEqual(prevState.list, list)) {
      this.setState({
        list,
      });
    }
  }

  reloadData = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionCategory/queryList',
    });
  };

  add = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionCategory/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionCategory/updateState',
      payload: {
        showModal: true,
        rowData: rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionCategory/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'positionCategory/updateState',
          payload: {
            showModal: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      _ => {
        dispatch({
          type: 'positionCategory/del',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.reloadData();
          }
        });
      },
    );
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionCategory/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['positionCategory/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { list } = this.state;
    const { loading } = this.props;
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
            {authAction(
              <ExtIcon
                key={APP_MODULE_BTN_KEY.EDIT}
                className="edit"
                onClick={_ => this.edit(record)}
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
              onConfirm={_ => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
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
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {authAction(
            <Button key={APP_MODULE_BTN_KEY.CREATE} type="primary" onClick={this.add} ignore="true">
              <FormattedMessage id="global.add" defaultMessage="新建" />
            </Button>,
          )}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      ),
    };
    return {
      columns,
      border: false,
      loading: loading.effects['positionCategory/queryList'],
      toolBar: toolBarProps,
      dataSource: list,
    };
  };

  getFormModalProps = () => {
    const { loading, positionCategory } = this.props;
    const { showModal, rowData } = positionCategory;
    return {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['positionCategory/save'],
    };
  };

  render() {
    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <ExtTable {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </PageWrapper>
    );
  }
}

export default PositionCategory;
