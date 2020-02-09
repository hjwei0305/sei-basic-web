import React from 'react';
import { connect } from 'dva';
import { Tabs, Button, } from 'antd';
import PositionConfig from './PositionConfig';
import FeatureRoleConfig from './FeatureRoleConfig';
import DataRoleConfig from './DataRoleConfig';
import cls from 'classnames';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ employee, loading, }) => ({ employee, loading, }))
class PostionConfig extends React.Component {

  constructor(props) {
    super(props);
  }

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
            <FeatureRoleConfig
              data={rowData}
              onAssign={(params) => this.handleAssign('FeatureRole', params)}
              onUnAssign={(params) => this.handleUnAssign('FeatureRole', params)}
            />
          </TabPane>
          <TabPane tab={`【${rowData.userName}】配置用户角色`} key="3">
            <DataRoleConfig
              data={rowData}
              onAssign={(params) => this.handleAssign('DataRole', params)}
              onUnAssign={(params) => this.handleUnAssign('DataRole', params)}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PostionConfig;
