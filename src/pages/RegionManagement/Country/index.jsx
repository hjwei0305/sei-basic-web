import React, { Component, Fragment, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, } from 'lodash';
import { Button, Popconfirm, Checkbox, } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ExtTable, utils, ExtIcon } from 'seid'
import { constants } from "@/utils";
import FormModal from "./FormModal";
import styles from "./index.less";

const { APP_MODULE_BTN_KEY } = constants;
const { authAction } = utils;

@withRouter
@connect(({ country, loading, }) => ({ country, loading, }))
class Country extends Component {
  state = {
    delRowId: null,
    list: [],
  }

  componentDidUpdate(_prevProps, prevState) {
    const { list, } = this.props.country;
    if (!isEqual(prevState.list, list)) {
      this.setState({
        list,
      });
    }
  }

  reloadData = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "country/queryList"
    });
  };

  add = _ => {
    const { dispatch } = this.props;
    dispatch({
      type: "country/updateState",
      payload: {
        showModal: true,
        rowData: null
      }
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: "country/updateState",
      payload: {
        showModal: true,
        rowData: rowData
      }
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "country/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "country/updateState",
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
        type: "country/del",
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
      type: "country/updateState",
      payload: {
        showModal: false,
        rowData: null
      }
    });
  };

  renderDelBtn = (row) => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects["country/del"] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const { list } = this.state;
    const { loading } = this.props;
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
        title: "国家货币代码",
        dataIndex: "currencyCode",
        width: 120,
        required: true,
      },
      {
        title: "国家货币名称" ,
        dataIndex: "currencyName",
        width: 120,
        required: true,
      },
      {
        title: "是否国外",
        dataIndex: "toForeign",
        width: 80,
        required: true,
        render: (text) => {
          return (<Checkbox checked={!!text}/>)
        }
      },
      {
        title: formatMessage({ id: "global.rank", defaultMessage: "序号" }),
        dataIndex: "rank",
        width: 80,
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
      columns,
      loading: loading.effects["country/queryList"],
      toolBar: toolBarProps,
      dataSource: list,
    };
  };

  getFormModalProps = () => {
    const { loading, country, } = this.props;
    const { showModal, rowData } = country;

    return {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects["country/save"]
    };
  };

  render() {
    const { country, } = this.props;
    const { showModal, } = country;

    return (
      <div className={cls(styles["container-box"])} >
        <ExtTable {...this.getExtableProps()} />
        {
          showModal
            ? <FormModal {...this.getFormModalProps()} />
            : null
        }
      </div>
    );
  }
}

export default Country;
