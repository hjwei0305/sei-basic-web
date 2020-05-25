import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Popconfirm, Button, Card } from 'antd';
import { ExtTable, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import FormModal from './FormModal';
import ExtAction from './ExtAction';
import CopyModal from './CopyModal';
import ConfigUserModal from '../Config/User';
import ConfigFeatureRoleModal from '../Config/FeatureRole';
import ConfigDataRoleModal from '../Config/DataRole';
import styles from './index.less';

const { SERVER_PATH, POSITION_ACTION } = constants;

@connect(({ position, loading }) => ({ position, loading }))
class PositionHome extends Component {
  static tableRef;

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
    };
  }

  reloadData = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/updateState',
      payload: {
        showFormModal: true,
        currentPosition: null,
      },
    });
  };

  edit = currentPosition => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/updateState',
      payload: {
        showFormModal: true,
        currentPosition,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'position/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          this.closeFormModal();
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
          type: 'position/del',
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

  closeFormModal = (currentOrgNode = null) => {
    const { dispatch } = this.props;
    const st = {
      showFormModal: false,
      showCopyModal: false,
      showConfigFeatrueRole: false,
      showConfigUser: false,
      showConfigDataRole: false,
      currentPosition: null,
    };
    if (currentOrgNode) {
      st.currentOrgNode = currentOrgNode;
    }
    dispatch({
      type: 'position/updateState',
      payload: {
        ...st,
      },
    });
  };

  handleCopyToOrgNodes = (data, copyToOrgNode) => {
    const { dispatch, position } = this.props;
    dispatch({
      type: 'position/copyTo',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          const { currentOrgNode } = position;
          // 复制的组织机构与当前相同，则只刷新岗位列表即可
          if (currentOrgNode.id === copyToOrgNode.id) {
            this.closeFormModal();
            this.reloadData();
          } else {
            this.closeFormModal(copyToOrgNode);
          }
        }
      },
    });
  };

  handlerAction = (key, postionData) => {
    const { dispatch } = this.props;
    const payload = { currentPosition: postionData };
    const extData = {};
    switch (key) {
      case POSITION_ACTION.COPY:
        extData.showCopyModal = true;
        break;
      case POSITION_ACTION.USER:
        extData.showConfigUser = true;
        break;
      case POSITION_ACTION.FEATURE_ROLE:
        extData.showConfigFeatrueRole = true;
        break;
      case POSITION_ACTION.DATA_ROLE:
        extData.showConfigDataRole = true;
        break;
      default:
    }
    dispatch({
      type: 'position/updateState',
      payload: {
        ...payload,
        ...extData,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['position/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  render() {
    const { loading, position } = this.props;
    const {
      showFormModal,
      showCopyModal,
      showConfigUser,
      showConfigFeatrueRole,
      showConfigDataRole,
      currentOrgNode,
      currentPosition,
    } = position;
    const columns = [
      {
        title: formatMessage({ id: 'global.operation', defaultMessage: '操作' }),
        key: 'operation',
        width: 120,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_text, record) => (
          <span className={cls('action-box')}>
            <ExtIcon className="edit" onClick={() => this.edit(record)} type="edit" antd />
            <Popconfirm
              placement="topLeft"
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: '确定要删除吗?',
              })}
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
            <ExtAction postionData={record} onAction={this.handlerAction} />
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.code', defaultMessage: '代码' }),
        dataIndex: 'code',
        width: 200,
        optional: true,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 320,
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
          <Button type="primary" onClick={this.add}>
            <FormattedMessage id="global.add" defaultMessage="新建" />
          </Button>
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    const extTableProps = {
      bordered: false,
      toolBar: toolBarProps,
      columns,
      cascadeParams: { organizationId: currentOrgNode ? currentOrgNode.id : null },
      onTableRef: ref => (this.tableRef = ref),
      store: {
        url: `${SERVER_PATH}/sei-basic/position/findByOrganizationId`,
      },
      sort: {
        field: { code: 'asc', name: null, positionCategoryName: null },
      },
    };
    const formModalProps = {
      save: this.save,
      currentOrgNode,
      currentPosition,
      showFormModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['position/save'],
    };
    const copyModalProps = {
      save: this.handleCopyToOrgNodes,
      currentPosition,
      showModal: showCopyModal,
      closeModal: this.closeFormModal,
      saving: loading.effects['position/copyTo'],
    };
    const configUserModalProps = {
      currentPosition,
      showModal: showConfigUser,
      closeModal: this.closeFormModal,
    };
    const configFeatureRoleModalProps = {
      currentPosition,
      showModal: showConfigFeatrueRole,
      closeModal: this.closeFormModal,
    };
    const configDataRoleModalProps = {
      currentPosition,
      showModal: showConfigDataRole,
      closeModal: this.closeFormModal,
    };
    return (
      <div className={cls(styles['position-box'])}>
        <Card
          title={<BannerTitle title={currentOrgNode.name} subTitle="岗位列表" />}
          bordered={false}
        >
          <ExtTable {...extTableProps} />
        </Card>
        <FormModal {...formModalProps} />
        <CopyModal {...copyModalProps} />
        <ConfigUserModal {...configUserModalProps} />
        <ConfigFeatureRoleModal {...configFeatureRoleModalProps} />
        <ConfigDataRoleModal {...configDataRoleModalProps} />
      </div>
    );
  }
}

export default PositionHome;
