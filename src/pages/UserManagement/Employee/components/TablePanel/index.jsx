import React, { Component, Fragment, } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, } from 'lodash';
import { Button, message, Checkbox, } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ExtTable, utils, ExtIcon } from 'seid';
import { constants } from "@/utils";
import FormModal from "./FormModal";
import styles from "../../index.less";

const { APP_MODULE_BTN_KEY, SERVER_PATH, } = constants;
const { authAction } = utils;

@connect(({ employee, loading, }) => ({ employee, loading, }))
class TablePanel extends Component {
  state = {
    delRowId: null,
    list: [],
    includeSubNode: false,
    currNode: null,
  }

  componentDidUpdate(_prevProps, prevState) {
    const { currNode, } = this.props.employee;
    if (!isEqual(this.state.currNode, currNode)) {
      this.setState({
        currNode,
      }, () => {
        this.reloadData();
      });
    }
  }

  reloadData = _ => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
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

  handlCopy = (rowData) => {
    const { dispatch } = this.props;
    dispatch({
      type: "employee/updateState",
      payload: {
        showCopyConfig: true,
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

  handleCheck = (e) => {
    const { checked, } = e.target;
    this.setState({
      includeSubNode: checked,
    }, () => {
      this.reloadData();
    });
  }

  getExtableProps = () => {
    const { includeSubNode, currNode } = this.state;

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
{/*            <ExtIcon
              className="from"
              onClick={_ => this.handlResetPassword(record)}
              type="form"
              antd
            />*/}
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
          <Checkbox onChange={this.handleCheck}>包含子节点：</Checkbox>
        </Fragment>
      )
    };
    return {
      bordered: false,
      remotePaging: true,
      // searchProperties: ['code', 'userName'],
      columns,
      toolBar: toolBarProps,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/employee/findByUserQueryParam`,
        params: {
          organizationId: currNode && currNode.id,
          includeSubNode,
        },
      },
    };
  };

  getFormModalProps = () => {
    const { currNode, } = this.state;
    const { loading, employee, } = this.props;
    const { showModal, rowData, } = employee;

    return {
      save: this.save,
      rowData,
      showModal,
      parentData: currNode,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["employee/save"]
    };
  };

  render() {
    const { employee, } = this.props;
    const { showModal, } = employee;

    return (
      <div className={cls(styles["container-box"])} >
        <ExtTable onTableRef={inst => this.tableRef=inst } {...this.getExtableProps()} />
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
