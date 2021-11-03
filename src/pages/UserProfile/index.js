import React from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import { ScrollBar } from 'suid';
import cls from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import BasicInfo from './components/BasicInfo';
import PositionInfo from './components/PositionInfo';
import MailInfo from './components/MailInfo';
import PaymentInfo from './components/PaymentInfo';
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
          <TabPane tab={formatMessage({id: 'basic_000000', defaultMessage: '基本信息'})} key="baiscInfo">
            <Card title={formatMessage({id: 'basic_000000', defaultMessage: '基本信息'})} bordered={false}>
              <BasicInfo />
            </Card>
          </TabPane>
          <TabPane tab={formatMessage({id: 'basic_000408', defaultMessage: '帐号绑定'})} key="accountBinding">
            <Card title={formatMessage({id: 'basic_000408', defaultMessage: '帐号绑定'})} bordered={false}>
              <ScrollBar>
                <AccountBinding />
              </ScrollBar>
            </Card>
          </TabPane>
          <TabPane tab={formatMessage({id: 'basic_000002', defaultMessage: '支付信息'})} key="paymentInfo">
            <Card title={formatMessage({id: 'basic_000002', defaultMessage: '支付信息'})} bordered={false}>
              <PaymentInfo />
            </Card>
          </TabPane>
          <TabPane tab={formatMessage({id: 'basic_000003', defaultMessage: '岗位信息'})} key="positionInfo">
            <Card title={formatMessage({id: 'basic_000003', defaultMessage: '岗位信息'})} bordered={false}>
              <PositionInfo />
            </Card>
          </TabPane>
          <TabPane tab={formatMessage({id: 'basic_000004', defaultMessage: '邮件提醒'})} key="mailInfo">
            <Card title={formatMessage({id: 'basic_000004', defaultMessage: '邮件提醒'})} bordered={false}>
              <MailInfo />
            </Card>
          </TabPane>
          <TabPane tab={formatMessage({id: 'basic_000005', defaultMessage: '功能权限'})} key="featureAuth">
            <FeatureAuthView />
          </TabPane>
          <TabPane tab={formatMessage({id: 'basic_000006', defaultMessage: '数据权限'})} key="dataAuth">
            <DataAuthView />
          </TabPane>
          {/* <TabPane tab={formatMessage({id: 'basic_000007', defaultMessage: '修改密码'})} key="updatePwd">
            <Card title={formatMessage({id: 'basic_000007', defaultMessage: '修改密码'})} bordered={false}>
              <UpdatePwd />
            </Card>
          </TabPane> */}
        </Tabs>
      </div>
    );
  }
}

export default UserProfile;
