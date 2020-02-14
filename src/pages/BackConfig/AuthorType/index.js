import React, { Component, Fragment } from "react";
import { connect } from "dva";
import cls from "classnames";
import { Button, Popconfirm } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import isEqual from "react-fast-compare";
import { ExtTable, utils, ExtIcon } from 'seid'
import { constants } from "@/utils";
import FormModal from "./FormModal";
import styles from "./index.less";

const { APP_MODULE_BTN_KEY } = constants;
const { authAction } = utils;


@connect(({ authorType, loading }) => ({ authorType, loading }))
class AuthorType extends Component {

  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
      list: [],
    };
  }

  componentDidUpdate(_prevProps, prevState) {
    if (!isEqual(prevState.list, this.props.authorType.list)) {
      this.setState({
        list: this.props.authorType.list
      });
    }
  }

  reloadData = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "authorType/queryList"
    });
  };

  add = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "authorType/updateState",
      payload: {
        showModal: true,
        rowData: null
      }
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: "authorType/updateState",
      payload: {
        showModal: true,
        rowData: rowData
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "authorType/save",
      payload: {
        ...data
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: "authorType/updateState",
            payload: {
              showModal: false
            }
          });
          this.reloadData();
        }
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState({
      delRowId: record.id
    }, _ => {
      dispatch({
        type: "authorType/del",
        payload: {
          id: record.id
        },
        callback: res => {
          if (res.success) {
            this.setState({
              delRowId: null
            });
            this.reloadData();
          }
        }
      });
    });
  };

  closeFormModal = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "authorType/updateState",
      payload: {
        showModal: false,
        rowData: null
      }
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects["authorType/del"] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  render() {
    const { authorType, loading } = this.props;
    const { list } = this.state;
    const { showModal, rowData } = authorType;
    const columns = [
      {
        title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
        key: "operation",
        width: 100,
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
        title: formatMessage({ id: "global.name", defaultMessage: "名称" }),
        dataIndex: "name",
        width: 220,
        required: true,
      },
      {
        title: '应用模块',
        dataIndex: "appModuleName",
        width: 160,
      },
      {
        title: '树形结构',
        dataIndex: "beTree",
        width: 80,
        align: "center",
        required: true,
        render: (text, record) => {
          if (record.beTree) {
            return <ExtIcon type="check" antd />;
          }
        }
      },
      {
        title: '实体类名',
        dataIndex: "entityClassName",
        width: 320,
        optional: true,
      },
      {
        title: 'API服务路径',
        dataIndex: "apiPath",
        width: 200,
        optional: true,
      },

    ];
    const formModalProps = {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["authorType/save"]
    };
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
    return (
      <div className={cls(styles["container-box"])} >
        < ExtTable
          bordered={false}
          loading={loading.effects["authorType/queryList"]}
          toolBar={toolBarProps}
          columns={columns}
          dataSource={list}
          searchProperties={['name', 'entityClassName', 'apiPath', 'appModuleName']}
        />
        <FormModal {...formModalProps} />
      </div>
    );
  }
}

export default AuthorType;
