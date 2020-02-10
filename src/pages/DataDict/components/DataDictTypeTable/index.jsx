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
    list: [],
  }

  componentDidUpdate(_prevProps, prevState) {
    const { list, } = this.props.dataDict;
    if (!isEqual(prevState.list, list)) {
      this.setState({
        list,
      });
    }
  }

  reloadData = _ => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  add = _ => {
    const { dispatch, dataDict, } = this.props;
    dispatch({
      type: "dataDict/updateState",
      payload: {
        showModal: true,
        currDictType: null
      }
    });
  };

  edit = currDictType => {
    const { dispatch } = this.props;
    dispatch({
      type: "dataDict/updateState",
      payload: {
        showModal: true,
        currDictType,
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "dataDict/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "dataDict/updateState",
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
        type: "dataDict/del",
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

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "dataDict/updateState",
      payload: {
        showModal: false,
        showCopyModal: false,
        currDictType: null
      }
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
    const { currDictType, } = dataDict;
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
        title: "描述",
        dataIndex: "remark",
        width: 220,
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
      toolBar: toolBarProps,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/dataDict/findByPage`,
      },
      onSelectRow: (_, rows) => {
        const { dispatch, } = this.props;
        if (rows && rows.length) {
          dispatch({
            type: 'dataDict/updateState',
            payload: {
              currDictType: rows[0],
            }
          });
          dispatch({
            type: 'dataDict/getDataDictItems',
            payload: {
              categoryCode: rows[0].code,
              isAll: true,
            }
          });
        } else {
          dispatch({
            type: 'dataDict/updateState',
            payload: {
              currDictType: null,
              dataDictItems: [],
            }
          });
        }
      }
    };
  };

  getFormModalProps = () => {
    const { loading, dataDict, } = this.props;
    const { showModal, currDictType, } = dataDict;

    return {
      save: this.save,
      rowData: currDictType,
      visible: showModal,
      onCancel: this.closeFormModal,
      saving: loading.effects["dataDict/save"],
    };
  };

  render() {
    const { dataDict, } = this.props;
    const { showModal } = dataDict;

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
