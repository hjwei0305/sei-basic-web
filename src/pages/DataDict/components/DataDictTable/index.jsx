import React, { Component, Fragment, } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, } from 'lodash';
import { Button, Popconfirm, message, Tag,  } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ExtTable, utils, ExtIcon } from 'seid';
import { constants } from "@/utils";
import FormModal from "./FormModal";
import styles from "../../index.less";

const { APP_MODULE_BTN_KEY, SERVER_PATH, } = constants;
const { authAction } = utils;

@connect(({ dataDict, loading, }) => ({ dataDict, loading, }))
class DataDictTypeTable extends Component {
  state = {
    delRowId: null,
    showModal: false,
    rowData: null,
  }

  reloadData = _ => {
    const { dispatch, dataDict, } = this.props;
    const { currDictType } = dataDict;
    if (currDictType) {
      dispatch({
        type: 'dataDict/getDataDictItems',
        payload: {
          categoryCode: currDictType.code,
          isAll: true,
        }
      });
    } else {
      message.warn('请选择字典类型');
    }
  };

  add = _ => {
    const { dataDict, } = this.props;
    const { currDictType } = dataDict;
    if (currDictType) {
      this.setState({
        showModal: true,
        rowData: null,
      });
    } else {
      message.warn('请选字典类型');
    }
  };

  edit = rowData => {
    this.setState({
      showModal: true,
      rowData,
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "dataDict/saveDictItem",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        this.setState({
          showModal: false,
        }, () => {
          this.reloadData();
        });
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState({
      delRowId: record.id
    }, _ => {
      dispatch({
        type: "dataDict/del",
        payload: {
          id: record.id
        },
      }).then(res => {
        if (res.success) {
          this.setState({
            delRowId: null
          }, () => {
            this.reloadData();
          });
        }
      });
    });
  };

  closeFormModal = _ => {
    this.setState({
      showModal: false,
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects["dataDict/del"] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { list } = this.state;
    const { loading, dataDict,  } = this.props;
    const { rowData, dataDictItems, } = dataDict;
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
          </span>
        )
      },
      {
        title: "租户代码",
        dataIndex: "tenantCode",
        width: 120,
        required: true,
      },
      {
        title: formatMessage({ id: "global.code", defaultMessage: "代码" }),
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: formatMessage({ id: "global.name", defaultMessage: "名称" }),
        dataIndex: "name",
        width: 120,
        required: true,
      },
      {
        title: "值",
        dataIndex: "value",
        width: 120,
        required: true,
      },
      {
        title: "值描述",
        dataIndex: "valueName",
        width: 180,
        required: true,
      },
      {
        title: "描述",
        dataIndex: "remark",
        width: 180,
        required: true,
      },
      {
        title: "冻结",
        dataIndex: "frozen",
        width: 80,
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
      loading: loading.effects["dataDict/getDataDictItems"],
      toolBar: toolBarProps,
      dataSource: dataDictItems,
    };
  };

  getFormModalProps = () => {
    const { loading, dataDict, } = this.props;
    const { currDictType, } = dataDict;
    const { showModal, rowData, } = this.state;

    return {
      save: this.save,
      dictType: currDictType,
      rowData: rowData,
      visible: showModal,
      onCancel: this.closeFormModal,
      saving: loading.effects["dataDict/saveDictItem"]
    };
  };

  render() {
    const { showModal } = this.state;

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

export default DataDictTypeTable;
