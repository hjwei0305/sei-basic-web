import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Tabs, Button } from 'antd';
import UserConfig from './UserConfig';
import PositionConfig from './PositionConfig';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ featureRole, loading }) => ({ featureRole, loading }))
class PostionConfig extends React.Component {
  handleAssign = (type, params) => {
    const { dispatch } = this.props;
    // switch (type) {
    //   case 'Employee':
    //     break;
    //   case 'DataRole':
    //     break;
    //   case 'FeatureRole':
    //     break;
    // }

    return dispatch({
      type: `featureRole/assign${type}`,
      payload: params,
    });
  };

  handleUnAssign = (type, params) => {
    const { dispatch } = this.props;

    return dispatch({
      type: `featureRole/unAssign${type}`,
      payload: params,
    });
  };

  handleSaveCfg = params => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'featureRole/saveCfg',
      payload: params,
    });
  };

  handleSaveDataRoleCfg = params => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'featureRole/saveDataRoleCfg',
      payload: params,
    });
  };

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        currCfgRole: null,
      },
    });
  };

  getTabExtra = () => (
    <Button type="primary" onClick={this.handleBack}>
      返回
    </Button>
  );

  render() {
    const { style, featureRole, loading } = this.props;
    const { currCfgRole } = featureRole;

    return (
      <div className={cls(styles['page-box'])} style={style}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.getTabExtra()}>
          <TabPane tab={`功能角色【${currCfgRole.name}】配置岗位`} key="1">
            <PositionConfig
              assignLoading={loading.effects['featureRole/assignPosition']}
              unAssignLoading={loading.effects['featureRole/unAssignPosition']}
              data={currCfgRole}
              onAssign={params => this.handleAssign('Position', params)}
              onUnAssign={params => this.handleUnAssign('Position', params)}
            />
          </TabPane>
          <TabPane tab={`功能角色【${currCfgRole.name}】配置用户`} key="3">
            <UserConfig
              assignLoading={loading.effects['featureRole/assignUser']}
              unAssignLoading={loading.effects['featureRole/unAssignUser']}
              data={currCfgRole}
              onAssign={params => this.handleAssign('User', params)}
              onUnAssign={params => this.handleUnAssign('User', params)}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PostionConfig;
