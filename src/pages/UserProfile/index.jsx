import React from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import cls from 'classnames';
import BasicInfo from './components/BasicInfo';
import PositionInfo from './components/PositionInfo';
import MailInfo from './components/MailInfo';
import AccountInfo from './components/AccountInfo';

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
          <TabPane tab="账号信息" key="accountInfo">
            <Card title="账号信息" bordered={false}>
              <AccountInfo />
            </Card>
          </TabPane>
          <TabPane tab="岗位信息" key="positionInfo">
            <Card title="岗位信息" bordered={false}>
              <PositionInfo />
            </Card>
          </TabPane>
          {/*          <TabPane tab="支付信息" key="payInfo">
          </TabPane> */}
          <TabPane tab="邮件提醒" key="mailInfo">
            <Card title="邮件提醒" bordered={false}>
              <MailInfo />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default UserProfile;
