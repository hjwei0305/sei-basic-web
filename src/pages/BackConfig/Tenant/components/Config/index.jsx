import React, { PureComponent } from 'react';
import cls from 'classnames';
import { Tabs, Button } from 'antd';
import { connect } from 'dva';
import Watermark from './Watermark';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ tenant, loading }) => ({ tenant, loading }))
class index extends PureComponent {
  componentDidMount() {
    this.getTenantSetting();
  }

  getTabBarExtraContent = () => {
    const { onBack } = this.props;
    return (
      <Button type="primary" onClick={onBack}>
        返回
      </Button>
    );
  };

  getTenantSetting = () => {
    const { tenant, dispatch } = this.props;
    const { configTenant } = tenant;
    dispatch({
      type: 'tenant/getTenantSetting',
      payload: {
        tenantCode: configTenant.code,
      },
    });
  };

  handleSaveWatermark = values => {
    const { dispatch, tenant } = this.props;
    const { tenantSetting, configTenant } = tenant;
    dispatch({
      type: 'tenant/saveTenantSetting',
      payload: {
        ...tenantSetting,
        code: configTenant.code,
        watermark: values ? JSON.stringify(values) : null,
      },
    });
  };

  render() {
    const { tenant, loading } = this.props;
    const { configTenant, tenantSetting } = tenant;
    const { watermark = null } = tenantSetting || {};
    const editData = JSON.parse(watermark);
    console.log('index -> render -> editData', editData);

    return (
      <div className={cls(styles['container-box'])}>
        <Tabs
          tabBarExtraContent={this.getTabBarExtraContent()}
          defaultActiveKey="watermark"
          onChange={this.handleActiveChange}
        >
          <TabPane tab={`租户【${configTenant.name}】水印`} key="watermark">
            <Watermark
              key={editData && editData.id}
              opting={loading.global}
              onSave={this.handleSaveWatermark}
              onDel={this.handleSaveWatermark}
              editData={editData}
              tenant={configTenant}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default index;
