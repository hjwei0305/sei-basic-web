import React from 'react';
import { connect } from 'dva';
import { Tabs, Button } from 'antd';
import cls from 'classnames';
import { constants } from '@/utils';
import DataRoleAssign from '@/components/DataRoleAssign';
import FeatureRoleAssign from '@/components/FeatureRoleAssign';

import styles from './index.less';

const { SERVER_PATH } = constants;
const { TabPane } = Tabs;

@connect(({ customerUser, loading }) => ({ customerUser, loading }))
class CustomerUserConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAssign = (type, params) => {
    const { dispatch } = this.props;
    // switch (type) {
    //   case 'DataRole':
    //     break;
    //   case 'FeatureRole':
    //     break;
    // }

    return dispatch({
      type: `customerUser/assign${type}`,
      payload: params,
    });
  }

  handleUnAssign = (type, params) => {
    const { dispatch } = this.props;

    return dispatch({
      type: `customerUser/unAssign${type}`,
      payload: params,
    });
  }

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerUser/updateState',
      payload: {
        showConfig: false,
      },
    });
  }

  getTabExtra = () => (
    <Button onClick={this.handleBack}>返回</Button>
  )

  render() {
    const { style, customerUser } = this.props;
    const { rowData } = customerUser;

    return (
      <div className={cls(styles['page-box'])} style={style}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.getTabExtra()}>
          <TabPane tab={`【${rowData.name}】配置功能角色`} key="1">
            <FeatureRoleAssign
              data={rowData}
              onAssign={(params) => this.handleAssign('FeatureRole', params)}
              onUnAssign={(params) => this.handleUnAssign('FeatureRole', params)}
              unAssignCfg={{
                unAssignedUrl: `${SERVER_PATH}/sei-basic/userFeatureRole/getUnassigned`,
                unAssignedByIdUrl: `${SERVER_PATH}/sei-basic/employee/getCanAssignedFeatureRoles`,
                byIdKey: 'userId',
              }}
              assginCfg={{ url: `${SERVER_PATH}/sei-basic/userFeatureRole/getChildrenFromParentId` }}
            />
          </TabPane>
          <TabPane tab={`【${rowData.name}】配置用户角色`} key="2">
            <DataRoleAssign
              data={rowData}
              onAssign={(params) => this.handleAssign('DataRole', params)}
              onUnAssign={(params) => this.handleUnAssign('DataRole', params)}
              unAssignCfg={{
                unAssignedUrl: `${SERVER_PATH}/sei-basic/userDataRole/getUnassigned`,
                unAssignedByIdUrl: `${SERVER_PATH}/sei-basic/employee/getCanAssignedDataRoles`,
                byIdKey: 'userId',
              }}
              assginCfg={{ url: `${SERVER_PATH}/sei-basic/userDataRole/getChildrenFromParentId` }}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default CustomerUserConfig;
