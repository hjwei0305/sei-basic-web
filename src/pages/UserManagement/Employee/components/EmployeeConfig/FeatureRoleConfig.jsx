import React, { Component, Fragment, } from 'react';
import { Card, Row, Col, } from 'antd';
import cls from 'classnames';
import { ExtTable, utils, ExtIcon, ComboGrid, } from 'seid';
import { Button, Popconfirm, Checkbox, } from "antd";
import { constants } from "@/utils";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { AssignLayout } from '@/components';

const { SERVER_PATH } = constants;
const PFGURL = 'userFeatureRole/getUnassigned';
const PGURL = 'employee/getCanAssignedFeatureRoles';

class FeatureRoleConfig extends Component {

  state = {
    assignBtnDisabled: true,
    unAssignBtnDisabled: true,
    featureRoleGroupId: null,
    unAssignUrl: PFGURL,
    assignChildIds: [],
    unAssignChildIds: [],
  }

  assignChildIds=[]

  unAssignChildIds=[]

  handleCheck = (e) => {
    const { checked } = e.target;
    this.setState({
      includeSubNode: checked,
    }, () => {
      console.log(this.unAssignTable);
      if (this.unAssignTable) {
        this.unAssignTable.remoteDataRefresh();
      }
    });
  }

  handleUnAssign = () => {
    const { onUnAssign, data, } = this.props;
    const { assignChildIds, } = this.state;
    const { id: parentId, } = data;
    if (onUnAssign) {
      onUnAssign({ parentId, childIds: assignChildIds, }).then(res => {
        this.setState({
          unAssignBtnDisabled: true,
          assignChildIds: [],
        });
        this.refreshTableData();
      });
    }
  }

  handleAssign = () => {
    const { onAssign, data, } = this.props;
    const { unAssignChildIds, } = this.state;
    const { id: parentId, } = data;
    if (onAssign) {
      onAssign({ parentId, childIds: unAssignChildIds, }).then(res => {
        this.setState({
          assignBtnDisabled: true,
          unAssignChildIds: [],
        });
        this.refreshTableData();
      });
    }
  }

  getComboGridProps = () => {
    return {
      allowClear: true,
      placeholder: '请选择功能角色组',
      rowKey: "id",
      name: 'roleGroupName',
      store: {
        url: `${SERVER_PATH}/sei-basic/featureRoleGroup/findAll`,
      },
      reader: {
        name: 'name',
      },
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 220,
          dataIndex: 'name',
        },
      ],
      searchProperties: ['code', 'name'],
      style: { width: 240, marginRight: 15, },
      afterSelect: (rowData) => {
        if (rowData) {
          this.setState({
            featureRoleGroupId: rowData.id,
            unAssignUrl: PGURL,
          }, () => {
            if (this.unAssignTable) {
              this.unAssignTable.remoteDataRefresh();
            }
          });
        }
      },
      afterClear: () => {
        this.setState({
          unAssignUrl: PFGURL,
          featureRoleGroupId: undefined,
        }, () => {
          if (this.unAssignTable) {
            this.unAssignTable.remoteDataRefresh();
          }
        });
      }
    };
  }

  getCommonColumns = () => {

    return [
      {
        title: "角色代码",
        dataIndex: "code",
        width: 180,
        required: true,
      },
      {
        title: "角色名称",
        dataIndex: "name",
        width: 180,
        required: true,
      },
    ];
  }

  refreshTableData = () => {
    if (this.unAssignTable) {
      this.unAssignTable.remoteDataRefresh();
    }
    if (this.assignTable) {
      this.assignTable.remoteDataRefresh();
    }
  }

  /** 未分配表格属性 */
  getUnAssignTableProps = () => {
    const { featureRoleGroupId, unAssignUrl, unAssignChildIds } = this.state;
    const { data, } = this.props;
    const { id, } = data || {};
    const toolBarProps = {
      layout: {
        leftSpan: 16,
        rightSpan: 8,
      },
      left: (
        <Fragment>
          <ComboGrid {...this.getComboGridProps()}/>
        </Fragment>
      )
    };

    return {
      checkbox: true,
      bordered: false,
      selectedRowKeys: unAssignChildIds,
      columns: this.getCommonColumns(),
      toolBar: toolBarProps,
      onSelectRow: (rowIds) => {
        if (rowIds && rowIds.length) {
          this.setState({
            assignBtnDisabled: false,
            unAssignChildIds: rowIds,
          });
        } else {
          this.setState({
            assignBtnDisabled: true,
            unAssignChildIds: [],
          });
        }
      },
      store: {
        params: unAssignUrl === PFGURL ? {
          parentId: id,
        } : {
          userId: id,
          featureRoleGroupId,
        },
        url: `${SERVER_PATH}/sei-basic/${unAssignUrl}`,
      },
    };
  }

  /** 已分配表格属性 */
  getAssignTableProps = () => {
    const { data, } = this.props;
    const { assignChildIds, } = this.state;
    const { id, } = data || {};

    return {
      checkbox: true,
      bordered: false,
      selectedRowKeys: assignChildIds,
      columns: this.getCommonColumns(),
      onSelectRow: (rowIds) => {
        if (rowIds && rowIds.length) {
          this.setState({
            unAssignBtnDisabled: false,
            assignChildIds: rowIds,
          });
        } else {
          this.setState({
            unAssignBtnDisabled: true,
            assignChildIds: [],
          });
        }
      },
      loading: false,
      store: {
        params: {
          parentId: id,
        },
        url: `${SERVER_PATH}/sei-basic/userFeatureRole/getChildrenFromParentId`,
      },
    };
  }

  render() {
    const { assignBtnDisabled, unAssignBtnDisabled, } = this.state;
    return (
      <AssignLayout>
        <ExtTable onTableRef={inst => this.unAssignTable = inst } slot="left" {...this.getUnAssignTableProps()} />
        <div slot="center">
          <Fragment>
            <p>
              <Button
                onClick={this.handleUnAssign}
                disabled={unAssignBtnDisabled}
                shape="circle"
                icon="left"
              />
            </p>
            <p>
              <Button
                onClick={this.handleAssign}
                disabled={assignBtnDisabled}
                shape="circle"
                icon="right"
              />
            </p>
          </Fragment>
        </div>
        <ExtTable onTableRef={inst => this.assignTable = inst } slot="right" {...this.getAssignTableProps()} />
      </AssignLayout>
    );
  }
}

export default FeatureRoleConfig;
