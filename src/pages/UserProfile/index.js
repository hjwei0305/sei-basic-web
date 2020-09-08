import React from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import { ScrollBar } from 'suid';
import cls from 'classnames';
import BasicInfo from './components/BasicInfo';
import PositionInfo from './components/PositionInfo';
import MailInfo from './components/MailInfo';
// import AccountInfo from './components/AccountInfo';
// import UpdatePwd from './components/UpdatePwd';
import AccountBinding from './components/AccountBinding';
import FeatureAuthView from './FeatureAuthView';
import DataAuthView from './DataAuthView';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
class UserProfile extends React.Component {
  handleActiveChange = activeTabKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userProfile/updateState',
      payload: {
        activeTabKey,
      },
    });
  };

  render() {
    const { userProfile } = this.props;
    const { activeTabKey } = userProfile;

    return (
      <div className={cls(styles['container-box'])}>
        <Tabs activeKey={activeTabKey} tabPosition="left" onChange={this.handleActiveChange}>
          <TabPane tab="基本信息" key="baiscInfo">
            <Card title="基本信息" bordered={false}>
              <BasicInfo />
            </Card>
          </TabPane>
          <TabPane tab="账号信息" key="accountBinding">
            <Card title="账号信息" bordered={false}>
              <ScrollBar>
                <AccountBinding />
              </ScrollBar>
            </Card>
          </TabPane>
          {/* <TabPane tab="账号信息" key="accountInfo">
            <Card title="账号信息" bordered={false}>
              <AccountInfo />
            </Card>
          </TabPane> */}
          <TabPane tab="岗位信息" key="positionInfo">
            <Card title="岗位信息" bordered={false}>
              <PositionInfo />
            </Card>
          </TabPane>
          <TabPane tab="邮件提醒" key="mailInfo">
            <Card title="邮件提醒" bordered={false}>
              <MailInfo />
            </Card>
          </TabPane>
          <TabPane tab="功能权限" key="featureAuth">
            <FeatureAuthView />
          </TabPane>
          <TabPane tab="数据权限" key="dataAuth">
            <DataAuthView />
          </TabPane>
          {/* <TabPane tab="修改密码" key="updatePwd">
            <Card title="修改密码" bordered={false}>
              <UpdatePwd />
            </Card>
          </TabPane> */}
        </Tabs>
      </div>
    );
  }
}

export default UserProfile;
