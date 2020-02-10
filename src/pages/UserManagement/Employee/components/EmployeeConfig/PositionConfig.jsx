import React, { Component, Fragment, } from 'react';
import { Card, Row, Col, } from 'antd';
import cls from 'classnames';
import { ExtTable, utils, ExtIcon, ComboTree, } from 'seid';
import { Button, Popconfirm, Checkbox, } from "antd";
import { constants } from "@/utils";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { AssignLayout } from '@/components';

const { SERVER_PATH } = constants;

class PositionConfig extends Component {

  state = {
    assignBtnDisabled: true,
    unAssignBtnDisabled: true,
    includeSubNode: false,
    organizationId: null,
    assignChildIds: [],
    unAssignChildIds: [],
  }

  handleCheck = (e) => {
    const { checked } = e.target;
    this.setState({
      includeSubNode: checked,
    }, () => {
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
          unAssignChildIds: [],
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
          assignChildIds: []
        });
        this.refreshTableData();
      });
    }
  }

  getComboTreeProps = () => {
    const { data } = this.props;

    return {
      defaultValue: data.organizationName || '',
      name: 'orgName',
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
      },
      reader: {
        name: 'name',
      },
      placeholder: '请选择组织机构',
      style: { width: 240, marginRight: 15, },
      afterSelect: (node) => {
        if (node) {
          this.setState({
            organizationId: node.id
          }, () => {
            if (this.unAssignTable) {
              this.unAssignTable.remoteDataRefresh();
            }
          });
        }
      },
    };
  }

  getCommonColumns = () => {

    return [
      {
        title: "代码",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "名称",
        dataIndex: "name",
        width: 120,
        required: true,
      },
      {
        title: "组织机构",
        dataIndex: "organizationName",
        width: 220,
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
    const { includeSubNode, organizationId: orgId, unAssignChildIds, } = this.state;
    const { data, } = this.props;
    const { id, organizationId, } = data || {};
    const toolBarProps = {
      layout: {
        leftSpan: 16,
        rightSpan: 8,
      },
      left: (
        <Fragment>
          <ComboTree {...this.getComboTreeProps()}/>
          <Checkbox onChange={this.handleCheck}>包含子节点</Checkbox>
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
        params: {
          userId: id,
          organizationId: orgId || organizationId,
          includeSubNode,
        },
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/position/listAllCanAssignPositions`,
      },
    };
  }

  /** 已分配表格属性 */
  getAssignTableProps = () => {
    const { data, } = this.props;
    const { assignChildIds } = this.state;
    const { id, } = data || {};

    return {
      checkbox: true,
      bordered: false,
      columns: this.getCommonColumns(),
      selectedRowKeys: assignChildIds,
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
        url: `${SERVER_PATH}/sei-basic/employeePosition/getChildrenFromParentId`,
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

export default PositionConfig;
