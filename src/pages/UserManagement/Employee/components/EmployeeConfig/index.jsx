import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Tabs, Button, } from 'antd';
import { constants } from "@/utils";
import DataRoleAssign from '@/components/DataRoleAssign';
import FeatureRoleAssign from '@/components/FeatureRoleAssign';
import PositionConfig from './PositionConfig';

import styles from './index.less';

const { SERVER_PATH } = constants;
const { TabPane } = Tabs;

@connect(({ employee, loading, }) => ({ employee, loading, }))
class PostionConfig extends React.Component {

  handleAssign = (type, params) => {
    const { dispatch, } = this.props;
    // switch (type) {
    //   case 'Employee':
    //     break;
    //   case 'DataRole':
    //     break;
    //   case 'FeatureRole':
    //     break;
    // }

    return dispatch({
      type: `employee/assign${type}`,
      payload: params
    });
  }

  handleUnAssign = (type, params) => {
    const { dispatch, } = this.props;

    return dispatch({
      type: `employee/unAssign${type}`,
      payload: params
    });
  }

  handleBack = () => {
    const { dispatch, } = this.props;
    dispatch({
      type: "employee/updateState",
      payload: {
        showEmployeeConfig: false,
      }
    });
  }

  getTabExtra = () => {
    return (
      <Button onClick={this.handleBack}>返回</Button>
    );
  }

  render() {
    const { style, employee, } = this.props;
    const { rowData, } = employee;

    return (
      <div className={cls(styles['page-box'])} style={style}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.getTabExtra()}>
          <TabPane tab={`【${rowData.userName}】配置岗位`} key="1">
            <PositionConfig
              data={rowData}
              onAssign={(params) => this.handleAssign('Employee', params)}
              onUnAssign={(params) => this.handleUnAssign('Employee', params)}
            />
          </TabPane>
          <TabPane tab={`【${rowData.userName}】配置功能角色`} key="2">
            <FeatureRoleAssign
              data={rowData}
              onAssign={(params) => this.handleAssign('FeatureRole', params)}
              onUnAssign={(params) => this.handleUnAssign('FeatureRole', params)}
              unAssignCfg={{
                unAssignedUrl: `${SERVER_PATH}/sei-basic/userFeatureRole/getUnassigned`,
                unAssignedByIdUrl: `${SERVER_PATH}/sei-basic/employee/getCanAssignedFeatureRoles`,
                byIdKey: 'userId',
              }}
              assginCfg={{ url: `${SERVER_PATH}/sei-basic/userFeatureRole/getChildrenFromParentId`, }}
            />
          </TabPane>
          <TabPane tab={`【${rowData.userName}】配置用户角色`} key="3">
            <DataRoleAssign
              data={rowData}
              onAssign={(params) => this.handleAssign('DataRole', params)}
              onUnAssign={(params) => this.handleUnAssign('DataRole', params)}
              unAssignCfg={{
                unAssignedUrl: `${SERVER_PATH}/sei-basic/userDataRole/getUnassigned`,
                unAssignedByIdUrl: `${SERVER_PATH}/sei-basic/employee/getCanAssignedDataRoles`,
                byIdKey: 'userId',
              }}
              assginCfg={{ url: `${SERVER_PATH}/sei-basic/userDataRole/getChildrenFromParentId`, }}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PostionConfig;
