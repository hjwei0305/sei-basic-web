import React, { Component, Fragment, } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, } from 'lodash';
import { Button, Popconfirm, message, } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ExtTable, utils, ExtIcon } from 'seid'
import { constants } from "@/utils";
import FormModal from "./FormModal";
import CopyModal from './CopyModal';
import styles from "../../index.less";

const { APP_MODULE_BTN_KEY, } = constants;
const { authAction } = utils;

@connect(({ employee, loading, }) => ({ employee, loading, }))
class TablePanel extends Component {
  state = {
    delRowId: null,
    list: [],
  }

  componentDidUpdate(_prevProps, prevState) {
    const { list, } = this.props.employee;
    if (!isEqual(prevState.list, list)) {
      this.setState({
        list,
      });
    }
  }

  reloadData = _ => {
    const { dispatch, employee } = this.props;
    const { currNode, } = employee;

    if (currNode) {
      dispatch({
        type: "employee/queryListByOrgId",
        payload: {
          organizationId: currNode.id,
        },
      });
    }

  };

  add = _ => {
    const { dispatch, employee, } = this.props;
    if (employee.currNode) {
      dispatch({
        type: "employee/updateState",
        payload: {
          showModal: true,
          rowData: null
        }
      });
    } else {
      message.warn('请选择组织机构');
    }
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: "employee/updateState",
      payload: {
        showModal: true,
        rowData: rowData
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "employee/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "employee/updateState",
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
        type: "employee/del",
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

  handleCopyToOrgNodes = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "employee/copyTo",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "employee/updateState",
          payload: {
            showCopyModal: false
          }
        });
        this.reloadData();
      }
    });
  }

  handlCopy = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: "employee/updateState",
      payload: {
        showCopyModal: true,
        rowData,
      }
    });
  }

  handleConfig = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: "employee/updateState",
      payload: {
        showEmployeeConfig: true,
        rowData,
      }
    });
  }

  handlResetPassword = (rowData) => {

  }

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "employee/updateState",
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
    if (loading.effects["employee/del"] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { list } = this.state;
    const { loading, employee,  } = this.props;
    const { rowData, } = employee;
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
            <ExtIcon
              className="reset"
              onClick={_ => this.handlResetPassword(record)}
              type="edit"
              antd
            />
            <ExtIcon
              className="copy"
              onClick={_ => this.handlCopy(record)}
              type="copy"
              antd
            />
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
        title: "员工编号",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "员工名称",
        dataIndex: "userName",
        width: 120,
        required: true,
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
      loading: loading.effects["employee/queryList"],
      toolBar: toolBarProps,
      dataSource: list,
    };
  };

  getFormModalProps = () => {
    const { loading, employee, } = this.props;
    const { showModal, rowData, currNode, } = employee;

    return {
      save: this.save,
      rowData,
      showModal,
      parentData: currNode,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["employee/save"]
    };
  };

  getCopyModalProps = () => {
    const { loading, employee, } = this.props;
    const { showCopyModal, rowData, currNode, } = employee;

    return {
      save: this.handleCopyToOrgNodes,
      rowData,
      showModal: showCopyModal,
      closeModal: this.closeFormModal,
      saving: loading.effects["employee/copyTo"]
    };
  };

  render() {
    const { employee, } = this.props;
    const { showModal, showCopyModal } = employee;

    return (
      <div className={cls(styles["container-box"])} >
        <ExtTable {...this.getExtableProps()} />
        {
          showModal
            ? <FormModal {...this.getFormModalProps()} />
            : null
        }
        {
          showCopyModal
            ? <CopyModal {...this.getCopyModalProps()}/>
            : null
        }
      </div>
    );
  }
}

export default TablePanel;
