import React from 'react';
import { connect } from 'dva';
import { Tabs, Button, } from 'antd';
import cls from 'classnames';
import DataRoleAssign from '@/components/DataRoleAssign';
import FeatureRoleAssign from '@/components/FeatureRoleAssign';
import { constants } from "@/utils";
import UserConfig from './UserConfig';

import styles from './index.less';

const { SERVER_PATH } = constants;
const { TabPane } = Tabs;

@connect(({ position, loading, }) => ({ position, loading, }))
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
      type: `position/assign${type}`,
      payload: params
    });
  }

  handleUnAssign = (type, params) => {
    const { dispatch, } = this.props;

    return dispatch({
      type: `position/unAssign${type}`,
      payload: params
    });
  }

  handleBack = () => {
    const { dispatch, } = this.props;
    dispatch({
      type: "position/updateState",
      payload: {
        showPosionConfig: false,
      }
    });
  }

  getTabExtra = () => {
    return (
      <Button onClick={this.handleBack}>返回</Button>
    );
  }

  render() {
    const { style, position, } = this.props;
    const { rowData, } = position;

    return (
      <div className={cls(styles['page-box'])} style={style}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.getTabExtra()}>
          <TabPane tab={`【${rowData.name}】配置用户`} key="1">
            <UserConfig
              data={rowData}
              onAssign={(params) => this.handleAssign('Employee', params)}
              onUnAssign={(params) => this.handleUnAssign('Employee', params)}
            />
          </TabPane>
          <TabPane tab={`【${rowData.name}】配置功能角色`} key="2">
            <FeatureRoleAssign
              data={rowData}
              onAssign={(params) => this.handleAssign('FeatureRole', params)}
              onUnAssign={(params) => this.handleUnAssign('FeatureRole', params)}
              unAssignCfg={{
                unAssignedUrl: `${SERVER_PATH}/sei-basic/positionFeatureRole/getUnassigned`,
                unAssignedByIdUrl: `${SERVER_PATH}/sei-basic/position/getCanAssignedFeatureRoles`,
                byIdKey: 'positionId',
              }}
              assginCfg={{ url: `${SERVER_PATH}/sei-basic/positionFeatureRole/getChildrenFromParentId`, }}
            />
          </TabPane>
          <TabPane tab={`【${rowData.name}】配置用户角色`} key="3">
            <DataRoleAssign
              data={rowData}
              onAssign={(params) => this.handleAssign('DataRole', params)}
              onUnAssign={(params) => this.handleUnAssign('DataRole', params)}
              unAssignCfg={{
                unAssignedUrl: `${SERVER_PATH}/sei-basic/positionDataRole/getUnassigned`,
                unAssignedByIdUrl: `${SERVER_PATH}/sei-basic/position/getCanAssignedDataRoles`,
                byIdKey: 'positionId',
              }}
              assginCfg={{ url: `${SERVER_PATH}/sei-basic/positionDataRole/getChildrenFromParentId`, }}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PostionConfig;
