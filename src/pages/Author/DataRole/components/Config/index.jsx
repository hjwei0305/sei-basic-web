import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Tabs, Button } from 'antd';
import UserConfig from './UserConfig';
import PositionConfig from './PositionConfig';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ dataRole, loading }) => ({ dataRole, loading }))
class PostionConfig extends React.Component {
  handleAssign = (type, params) => {
    const { dispatch } = this.props;
    // switch (type) {
    //   case 'Employee':
    //     break;
    //   case 'DataRole':
    //     break;
    //   case 'dataRole':
    //     break;
    // }

    return dispatch({
      type: `dataRole/assign${type}`,
      payload: params,
    });
  };

  handleUnAssign = (type, params) => {
    const { dispatch } = this.props;

    return dispatch({
      type: `dataRole/unAssign${type}`,
      payload: params,
    });
  };

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataRole/updateState',
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
    const { style, dataRole, loading } = this.props;
    const { currCfgRole } = dataRole;

    return (
      <div className={cls(styles['page-box'])} style={style}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.getTabExtra()}>
          <TabPane tab={`数据角色【${currCfgRole.name}】配置岗位`} key="1">
            <PositionConfig
              assignLoading={loading.effects['dataRole/assignPosition']}
              unAssignLoading={loading.effects['dataRole/unAssignPosition']}
              data={currCfgRole}
              onAssign={params => this.handleAssign('Position', params)}
              onUnAssign={params => this.handleUnAssign('Position', params)}
            />
          </TabPane>
          <TabPane tab={`数据角色【${currCfgRole.name}】配置用户`} key="3">
            <UserConfig
              assignLoading={loading.effects['dataRole/assignUser']}
              unAssignLoading={loading.effects['dataRole/unAssignUser']}
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
