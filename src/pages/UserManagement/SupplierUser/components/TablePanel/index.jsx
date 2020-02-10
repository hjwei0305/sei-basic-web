import React, { Component, Fragment, } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Popconfirm, Tag, } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ExtTable, utils, ExtIcon } from 'seid'
import { constants } from "@/utils";
import FormModal from "./FormModal";
import styles from "../../index.less";

const { APP_MODULE_BTN_KEY, SERVER_PATH } = constants;
const { authAction } = utils;

@connect(({ supplierUser, loading, }) => ({ supplierUser, loading, }))
class TablePanel extends Component {
  state = {
    delRowId: null,
  }

  reloadData = _ => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = _ => {
    const { dispatch, supplierUser, } = this.props;
    dispatch({
      type: "supplierUser/updateState",
      payload: {
        showModal: true,
        rowData: null
      }
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplierUser/updateState",
      payload: {
        showModal: true,
        rowData: rowData
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplierUser/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "supplierUser/updateState",
          payload: {
            showModal: false
          }
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState({
      delRowId: record.id
    }, _ => {
      dispatch({
        type: "supplierUser/del",
        payload: {
          id: record.id
        },
      }).then(res => {
        if (res.success) {
          this.setState({
            delRowId: null
          });
          this.reloadData();
        }
      });
    });
  };

  handleConfig = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplierUser/updateState",
      payload: {
        showConfig: true,
        rowData,
      }
    });
  }

  handlResetPassword = (rowData) => {

  }

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplierUser/updateState",
      payload: {
        showModal: false,
        showCopyModal: false,
        rowData: null
      }
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects["supplierUser/del"] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { loading, supplierUser,  } = this.props;
    const { rowData, } = supplierUser;
    const columns = [
      {
        title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
        key: "operation",
        width: 150,
        align: "center",
        dataIndex: "id",
        className: "action",
        required: true,
        render: (text, record) => (
          <span className={cls("action-box")}>
            {
              authAction(
                <ExtIcon
                  key={APP_MODULE_BTN_KEY.EDIT}
                  className="edit"
                  onClick={_ => this.edit(record)}
                  type="edit"
                  ignore='true'
                  antd
                />
              )
            }
            <Popconfirm
              key={APP_MODULE_BTN_KEY.DELETE}
              placement="topLeft"
              title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
              onConfirm={_ => this.del(record)}
            >
              {
                this.renderDelBtn(record)
              }
            </Popconfirm>
            <ExtIcon
              className="tool"
              onClick={_ => this.handleConfig(record)}
              type="tool"
              antd
            />
          </span>
        )
      },
      {
        title: "帐号",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 220,
        required: true,
      },
      {
        title: "供应商代码",
        dataIndex: "supplierCode",
        width: 120,
        required: true,
      },
      {
        title: "供应商名称",
        dataIndex: "supplierName",
        width: 220,
        required: true,
      },
      {
        title: "冻结",
        dataIndex: "frozen",
        width: 120,
        required: true,
        render: (text) => {
          return <Tag color={text ? 'red' : 'green' }>{text? '冻结' : '可用'}</Tag>
        }
      },
    ];
    const toolBarProps = {
      left: (
        <Fragment>
          {
            authAction(
              <Button
                key={APP_MODULE_BTN_KEY.CREATE}
                type="primary"
                onClick={this.add}
                ignore='true'
              >
                <FormattedMessage id="global.add" defaultMessage="新建" />
              </Button>
            )
          }
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </Fragment>
      )
    };
    return {
      bordered: false,
      columns,
      toolBar: toolBarProps,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/supplierUser/findVoByPage`,
      },
    };
  };

  getFormModalProps = () => {
    const { loading, supplierUser, } = this.props;
    const { showModal, rowData, } = supplierUser;

    return {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["supplierUser/save"]
    };
  };

  render() {
    const { supplierUser, } = this.props;
    const { showModal, showCopyModal } = supplierUser;

    return (
      <div className={cls(styles["container-box"])} >
        <ExtTable onTableRef={inst => this.tableRef = inst} {...this.getExtableProps()} />
        {
          showModal
            ? <FormModal {...this.getFormModalProps()} />
            : null
        }
      </div>
    );
  }
}

export default TablePanel;
