import React, { Component } from 'react';
import { ExtTable, ComboTree } from 'suid';
import { Button, Checkbox } from 'antd';
import { constants } from '@/utils';
import { AssignLayout } from '@/components';

const { SERVER_PATH } = constants;

class PositionConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignBtnDisabled: true,
      unAssignBtnDisabled: true,
      includeSubNode: false,
      organizationId: null,
      assignChildIds: [],
      unAssignChildIds: [],
    };
  }

  handleCheck = e => {
    const { checked } = e.target;
    this.setState(
      {
        includeSubNode: checked,
      },
      () => {
        if (this.unAssignTable) {
          this.unAssignTable.remoteDataRefresh();
        }
      },
    );
  };

  handleUnAssign = () => {
    const { onUnAssign, data } = this.props;
    const { assignChildIds } = this.state;
    const { id: childId } = data;
    if (onUnAssign) {
      onUnAssign({ childId, parentIds: assignChildIds }).then(() => {
        this.setState({
          unAssignBtnDisabled: true,
          unAssignChildIds: [],
        });
        this.refreshTableData();
      });
    }
  };

  handleAssign = () => {
    const { onAssign, data } = this.props;
    const { unAssignChildIds } = this.state;
    const { id: childId } = data;
    if (onAssign) {
      onAssign({ childId, parentIds: unAssignChildIds }).then(() => {
        this.setState({
          assignBtnDisabled: true,
          assignChildIds: [],
        });
        this.refreshTableData();
      });
    }
  };

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
      style: { width: 240, marginRight: 15 },
      afterSelect: node => {
        if (node) {
          this.setState(
            {
              organizationId: node.id,
            },
            () => {
              if (this.unAssignTable) {
                this.unAssignTable.remoteDataRefresh();
              }
            },
          );
        }
      },
    };
  };

  getCommonColumns = () => [
    {
      title: '代码',
      dataIndex: 'code',
      width: 120,
      required: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
      required: true,
    },
    {
      title: '组织机构',
      dataIndex: 'organizationName',
      width: 220,
      required: true,
    },
  ];

  refreshTableData = () => {
    if (this.unAssignTable) {
      this.unAssignTable.remoteDataRefresh();
    }
    if (this.assignTable) {
      this.assignTable.remoteDataRefresh();
    }
  };

  /** 未分配表格属性 */
  getUnAssignTableProps = () => {
    const { includeSubNode, organizationId: orgId, unAssignChildIds } = this.state;
    const { data } = this.props;
    const { id, organizationId } = data || {};
    const toolBarProps = {
      layout: {
        leftSpan: 16,
        rightSpan: 8,
      },
      left: (
        <>
          <ComboTree {...this.getComboTreeProps()} />
          <Checkbox onChange={this.handleCheck}>包含子节点</Checkbox>
        </>
      ),
    };

    return {
      checkbox: true,
      bordered: false,
      selectedRowKeys: unAssignChildIds,
      columns: this.getCommonColumns(),
      toolBar: toolBarProps,
      onSelectRow: rowIds => {
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
          excludeFeatureRoleId: id,
          organizationId: orgId || organizationId,
          includeSubNode,
        },
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/position/queryPositions`,
      },
    };
  };

  /** 已分配表格属性 */
  getAssignTableProps = () => {
    const { data } = this.props;
    const { assignChildIds } = this.state;
    const { id } = data || {};

    return {
      checkbox: true,
      bordered: false,
      columns: this.getCommonColumns(),
      selectedRowKeys: assignChildIds,
      onSelectRow: rowIds => {
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
          childId: id,
        },
        url: `${SERVER_PATH}/sei-basic/positionFeatureRole/getParentsFromChildId`,
      },
    };
  };

  render() {
    const { assignBtnDisabled, unAssignBtnDisabled } = this.state;
    const { assignLoading, unAssignLoading, } = this.props;

    return (
      <AssignLayout>
        <ExtTable
          onTableRef={inst => (this.unAssignTable = inst)}
          slot="left"
          {...this.getUnAssignTableProps()}
        />
        <div slot="center">
          <>
            <p>
              <Button
                onClick={this.handleUnAssign}
                disabled={unAssignBtnDisabled}
                shape="circle"
                icon="left"
                loading={unAssignLoading}
              />
            </p>
            <p>
              <Button
                onClick={this.handleAssign}
                disabled={assignBtnDisabled}
                shape="circle"
                icon="right"
                loading={assignLoading}
              />
            </p>
          </>
        </div>
        <ExtTable
          onTableRef={inst => (this.assignTable = inst)}
          slot="right"
          {...this.getAssignTableProps()}
        />
      </AssignLayout>
    );
  }
}

export default PositionConfig;
