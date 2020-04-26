import React from 'react';
import { ExtTable } from 'suid';
import { constants, userUtils } from '@/utils';

const { getCurrentUser } = userUtils;
const { SERVER_PATH } = constants;

export default class PositionInfo extends React.PureComponent {
  getTableProps = () => {
    const user = getCurrentUser() || {};
    const columns = [
      {
        title: '岗位代码',
        dataIndex: 'code',
        width: 120,
        required: true,
      },
      {
        title: '岗位名称',
        dataIndex: 'name',
        width: 120,
        required: true,
      },
      {
        title: '岗位类别',
        dataIndex: 'positionCategoryName',
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

    return {
      columns,
      bordered: false,
      store: {
        params: {
          parentId: user.userId,
        },
        url: `${SERVER_PATH}/sei-basic/employeePosition/getChildrenFromParentId`,
      },
    };
  }

  render() {
    return (
      <ExtTable
        onTableRef={(inst) => this.tableRef = inst}
        {...this.getTableProps()}
      />
    );
  }
}
