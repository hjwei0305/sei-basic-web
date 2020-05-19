import React, { Component } from 'react';
import { ExtTable, } from 'suid';
import { Button, } from 'antd';
import { constants } from '@/utils';
import { AssignLayout } from '@/components';

const { SERVER_PATH } = constants;

class UserConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignBtnDisabled: true,
      unAssignBtnDisabled: true,
      includeSubNode: false,
      organizationId: null,
      assignParentIds: [],
      unAssignParentIds: [],
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
    const { assignParentIds } = this.state;
    const { id: childId } = data;
    if (onUnAssign) {
      onUnAssign({ childId, parentIds: assignParentIds }).then(() => {
        this.setState({
          unAssignBtnDisabled: true,
          assignParentIds: [],
        });
        this.refreshTableData();
      });
    }
  };

  handleAssign = () => {
    const { onAssign, data } = this.props;
    const { unAssignParentIds } = this.state;
    const { id: childId } = data;
    if (onAssign) {
      onAssign({ childId, parentIds: unAssignParentIds }).then(() => {
        this.setState({
          assignBtnDisabled: true,
          unAssignParentIds: [],
        });
        this.refreshTableData();
      });
    }
  };

  // getComboTreeProps = () => {
  //   const { data } = this.props;
  //   return {
  //     defaultValue: data.organizationName || '',
  //     name: 'orgName',
  //     store: {
  //       url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
  //     },
  //     reader: {
  //       name: 'name',
  //     },
  //     placeholder: '请选择组织机构',
  //     style: { width: 240, marginRight: 15 },
  //     afterSelect: node => {
  //       if (node) {
  //         this.setState(
  //           {
  //             organizationId: node.id,
  //           },
  //           () => {
  //             if (this.unAssignTable) {
  //               this.unAssignTable.remoteDataRefresh();
  //             }
  //           },
  //         );
  //       }
  //     },
  //   };
  // };

  getCommonColumns = () => [
    {
      title: '用户姓名',
      dataIndex: 'userName',
      width: 180,
      required: true,
    },
    {
      title: '用户备注',
      dataIndex: 'userTypeRemark',
      width: 100,
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
    const { includeSubNode, organizationId: orgId, unAssignParentIds } = this.state;
    const { data } = this.props;
    const { id, organizationId } = data || {};
    const toolBarProps = {
      layout: {
        leftSpan: 16,
        rightSpan: 8,
      },
      // left: (
      //   <>
      //     <ComboTree {...this.getComboTreeProps()} />
      //     <Checkbox onChange={this.handleCheck}>包含子节点</Checkbox>
      //   </>
      // ),
    };

    return {
      checkbox: true,
      bordered: false,
      selectedRowKeys: unAssignParentIds,
      searchProperties: ['code', 'userName'],
      columns: this.getCommonColumns(),
      toolBar: toolBarProps,
      remotePaging: true,
      onSelectRow: rowIds => {
        if (rowIds && rowIds.length) {
          this.setState({
            assignBtnDisabled: false,
            unAssignParentIds: rowIds,
          });
        } else {
          this.setState({
            assignBtnDisabled: true,
            unAssignParentIds: [],
          });
        }
      },
      store: {
        params: {
          excludeDataRoleId: id,
          organizationId: orgId || organizationId,
          includeSubNode,
        },
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/user/queryUsers`,
      },
    };
  };

  /** 已分配表格属性 */
  getAssignTableProps = () => {
    const { data } = this.props;
    const { assignParentIds } = this.state;
    const { id } = data || {};

    return {
      checkbox: true,
      bordered: false,
      selectedRowKeys: assignParentIds,
      columns: this.getCommonColumns(),
      searchProperties: ['code', 'userName'],
      onSelectRow: rowIds => {
        if (rowIds && rowIds.length) {
          this.setState({
            unAssignBtnDisabled: false,
            assignParentIds: rowIds,
          });
        } else {
          this.setState({
            unAssignBtnDisabled: true,
            assignParentIds: [],
          });
        }
      },
      loading: false,
      store: {
        params: {
          childId: id,
        },
        url: `${SERVER_PATH}/sei-basic/userDataRole/getParentsFromChildId`,
      },
    };
  };

  render() {
    const { assignBtnDisabled, unAssignBtnDisabled } = this.state;
    const { assignLoading=false, unAssignLoading=false, } = this.props;

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

export default UserConfig;
