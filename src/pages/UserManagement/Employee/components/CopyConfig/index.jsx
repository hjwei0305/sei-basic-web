import React, { Fragment, } from 'react';
import { connect } from 'dva';
import { Button, } from 'antd';
import { ExtTable, ComboTree, } from 'seid';
import { FormattedMessage } from "umi-plugin-react/locale";

import { constants } from "@/utils";
import { AssignLayout, ColumnLayout, } from '@/components';

const { SERVER_PATH, } = constants;

@connect(({ employee, }) => ({ employee, }))
class CopyConfig extends React.Component {


  state = {
    userCurrNode: null,
    dataRoleIds: [],
    featureRoleIds: [],
    targetEmployeeIds: [],
  };

  handleBack = () => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'employee/updateState',
      payload: {
        showCopyConfig: false,
      },
    });
  }

  handleCopy = () => {
    const { dataRoleIds, featureRoleIds, targetEmployeeIds, } = this.state;
    const { dispatch, employee, } = this.props;
    const { rowData, } = employee;
    dispatch({
      type: 'employee/copyTo',
      payload: {
        dataRoleIds,
        featureRoleIds,
        targetEmployeeIds,
        employeeId: rowData.id,
      },
    });
  }

  getComboTreeProps = () => {
    const { employee, } = this.props;
    const { currNode, } = employee;

    return {
      defaultValue: currNode.name || '',
      name: 'orgName',
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
      },
      reader: {
        name: 'name',
      },
      placeholder: '请选择组织机构',
      style: { width: 200, },
      afterSelect: (node) => {
        if (node) {
          this.setState({
            organizationId: node.id
          }, () => {
            if (this.userTableRef) {
              this.userTableRef.remoteDataRefresh();
            }
          });
        }
      },
    };
  }

  getUserExtableProps = () => {
    const { organizationId } = this.state;
    const { employee,  } = this.props;
    const { rowData, currNode, } = employee;
    const columns = [
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
          <ComboTree {...this.getComboTreeProps()}/>
        </Fragment>
      )
    };
    return {
      bordered: false,
      remotePaging: true,
      checkbox: true,
      columns,
      toolBar: toolBarProps,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/employee/findByUserQueryParam`,
        params: {
          organizationId: organizationId || (currNode && currNode.id),
        },
      },
      onSelectRow: (rowKeys) => {
        let targetEmployeeIds = [];
        if (rowKeys && rowKeys.length) {
          targetEmployeeIds = rowKeys;
        }
        this.setState({
          targetEmployeeIds,
        });
      }
    };
  }

  getFeatureRoleExtableProps = () => {
    const { employee,  } = this.props;
    const { rowData, } = employee;
    const columns = [
      {
        title: "角色代码",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "角色名称",
        dataIndex: "name",
        width: 120,
        required: true,
      },
    ];

    return {
      bordered: false,
      checkbox: true,
      columns,
      store: {
        url: `${SERVER_PATH}/sei-basic/userFeatureRole/getChildrenFromParentId`,
        params: {
          parentId: rowData && rowData.id,
        },
      },
      onSelectRow: (rowKeys) => {
        let featureRoleIds = [];
        if (rowKeys && rowKeys.length) {
          featureRoleIds = rowKeys;
        }
        this.setState({
          featureRoleIds,
        });
      }
    };
  }

  getUserRoleExtableProps = () => {
    const { employee,  } = this.props;
    const { rowData, } = employee;
    const columns = [
      {
        title: "角色代码",
        dataIndex: "code",
        width: 120,
        required: true,
      },
      {
        title: "角色名称",
        dataIndex: "name",
        width: 120,
        required: true,
      },
    ];

    return {
      bordered: false,
      checkbox: true,
      columns,
      store: {
        url: `${SERVER_PATH}/sei-basic/userDataRole/getChildrenFromParentId`,
        params: {
          parentId: rowData && rowData.id,
        },
      },
      onSelectRow: (rowKeys) => {
        let dataRoleIds = [];
        if (rowKeys && rowKeys.length) {
          dataRoleIds = rowKeys;
        }
        this.setState({
          dataRoleIds,
        });
      }
    };
  }

  render() {
    const { dataRoleIds, featureRoleIds, targetEmployeeIds } = this.state;
    const { employee, } = this.props;
    const { rowData, } = employee;
    const copyBtnEnabled = targetEmployeeIds.length && (featureRoleIds.length || dataRoleIds.length);

    return (
      <AssignLayout
        title={['选择复制到的用户', `用户【${rowData.userName}】的功能角色和数据角色`]}
        layout={[7, 1, 16]}
        extra={[(<Button onClick={this.handleBack}>返回</Button>)]}
      >
        <ExtTable slot="left" onTableRef={inst => this.userTableRef=inst } {...this.getUserExtableProps()} />
        <div slot="center">
          <Button
            onClick={this.handleCopy}
            disabled={!copyBtnEnabled}
            shape="circle"
            icon="left"
          />
        </div>
        <ColumnLayout slot="right" title={['功能角色', '数据角色']} layout={[12, 12]} >
          <ExtTable slot="left" onTableRef={inst => this.featureRoleTableRef=inst } {...this.getFeatureRoleExtableProps()} />
          <ExtTable slot="right" onTableRef={inst => this.userRoleTableRef=inst } {...this.getUserRoleExtableProps()} />
        </ColumnLayout>
      </AssignLayout>
    );
  }
}

export default CopyConfig;
