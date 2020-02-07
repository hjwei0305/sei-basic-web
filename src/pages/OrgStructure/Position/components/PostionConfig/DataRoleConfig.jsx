import React, { Component, Fragment, } from 'react';
import { Card, Row, Col, } from 'antd';
import cls from 'classnames';
import { ExtTable, utils, ExtIcon, ComboGrid, } from 'seid';
import { Button, Popconfirm, Checkbox, } from "antd";
import { constants } from "@/utils";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import AssignLayout from './AssignLayout';

const { SERVER_PATH } = constants;
const PFGURL = 'positionFeatureRole/getUnassigned';
const PGURL = 'position/getCanAssignedDataRoles';

class DataRoleConfig extends Component {

  state = {
    assignBtnDisabled: true,
    unAssignBtnDisabled: true,
    dataRoleGroupId: null,
    unAssignUrl: PFGURL,
  }

  assignParentIds=[]

  unAssignParentIds=[]

  handleCheck = (e) => {
    const { checked } = e.target;
    this.setState({
      includeSubNode: checked,
    }, () => {
      console.log(this.unAssignTable);
      if (this.unAssignTable) {
        this.unAssignTable.remoteDataRrefresh();
      }
    });
  }

  handleUnAssign = () => {
    const { onUnAssign, data, } = this.props;
    const { id: childId, } = data;
    if (onUnAssign) {
      onUnAssign({ childId, parentIds: this.assignParentIds, }).then(res => {
        this.setState({
          unAssignBtnDisabled: true,
        });
        this.refreshTableData();
      });
    }
  }

  handleAssign = () => {
    const { onAssign, data, } = this.props;
    const { id: childId, } = data;
    if (onAssign) {
      onAssign({ childId, parentIds: this.unAssignParentIds, }).then(res => {
        this.setState({
          assignBtnDisabled: true,
        });
        this.refreshTableData();
      });
    }
  }

  getComboGridProps = () => {

    return {
      allowClear: true,
      placeholder: '请选择数据角色组',
      rowKey: "id",
      name: 'roleGroupName',
      store: {
        url: `${SERVER_PATH}/sei-basic/dataRoleGroup/findAll`,
      },
      reader: {
        name: 'name',
      },
      columns: [
        {
          title: '代码',
          width: 100,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 200,
          dataIndex: 'name',
        },
      ],
      searchProperties: ['code', 'name'],
      style: { width: 240, marginRight: 15, },
      afterSelect: (rowData) => {
        if (rowData) {
          this.setState({
            dataRoleGroupId: rowData.id,
            unAssignUrl: PGURL,
          }, () => {
            if (this.unAssignTable) {
              this.unAssignTable.remoteDataRrefresh();
            }
          });
        }
      },
      afterClear: () => {
        this.setState({
          unAssignUrl: PFGURL,
          dataRoleGroupId: undefined,
        }, () => {
          if (this.unAssignTable) {
            this.unAssignTable.remoteDataRrefresh();
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
        width: 120,
        required: true,
      },
      {
        title: "角色名称",
        dataIndex: "name",
        width: 180,
        required: true,
      },
      {
        title: "公共角色组织机构",
        dataIndex: "publicOrgName",
        width: 180,
        required: true,
      },
      {
        title: "公共角色用户类型",
        dataIndex: "publicUserType",
        width: 180,
        required: true,
      },
    ];
  }

  refreshTableData = () => {
    if (this.unAssignTable) {
      this.unAssignTable.remoteDataRrefresh();
    }
    if (this.assignTable) {
      this.assignTable.remoteDataRrefresh();
    }
  }

  /** 未分配表格属性 */
  getUnAssignTableProps = () => {
    const { dataRoleGroupId, unAssignUrl, } = this.state;
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
      columns: this.getCommonColumns(),
      toolBar: toolBarProps,
      onSelectRow: (rowIds) => {
        if (rowIds && rowIds.length) {
          this.unAssignParentIds = rowIds;
          this.setState({
            unAssignBtnDisabled: false,
          });
        } else {
          this.setState({
            unAssignBtnDisabled: true,
          });
        }
      },
      store: {
        params: unAssignUrl === PFGURL ? {
          parentId: id,
        } : {
          positionId: id,
          dataRoleGroupId,
        },
        url: `${SERVER_PATH}/sei-basic/${unAssignUrl}`,
      },
    };
  }

  /** 已分配表格属性 */
  getAssignTableProps = () => {
    const { data, } = this.props;
    const { id, } = data || {};

    return {
      checkbox: true,
      bordered: false,
      columns: this.getCommonColumns(),
      onSelectRow: (rowIds) => {
        if (rowIds && rowIds.length) {
          this.assignParentIds = rowIds;
          this.setState({
            assignBtnDisabled: false,
          });
        } else {
          this.setState({
            assignBtnDisabled: true,
          });
        }
      },
      loading: false,
      store: {
        params: {
          parentId: id,
        },
        url: `${SERVER_PATH}/sei-basic/positionDataRole/getChildrenFromParentId`,
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
                disabled={assignBtnDisabled}
                shape="circle"
                icon="left"
              />
            </p>
            <p>
              <Button
                onClick={this.handleAssign}
                disabled={unAssignBtnDisabled}
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

export default DataRoleConfig;
