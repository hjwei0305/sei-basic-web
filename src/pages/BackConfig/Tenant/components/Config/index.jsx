import React, { PureComponent } from 'react';
import cls from 'classnames';
import { Tabs, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Watermark from './Watermark';
import SystemLogo from './SystemLogo';
import FlowEngineCode from './FlowEngineCode';
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
        {formatMessage({id: 'basic_000220', defaultMessage: '返回'})}
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

  handleSaveLogo = values => {
    const { dispatch, tenant } = this.props;
    const { tenantSetting, configTenant } = tenant;
    dispatch({
      type: 'tenant/saveTenantSetting',
      payload: {
        ...tenantSetting,
        code: configTenant.code,
        logo: values ? JSON.stringify(values) : null,
      },
    });
  };

  handleSaveFlowEnginCode = values => {
    const { dispatch, tenant } = this.props;
    const { tenantSetting, configTenant } = tenant;
    dispatch({
      type: 'tenant/saveTenantSetting',
      payload: {
        ...tenantSetting,
        code: configTenant.code,
        flowEngineCode: values,
      },
    });
  };

  render() {
    const { tenant, loading } = this.props;
    const { configTenant, tenantSetting } = tenant;
    const { watermark = null, logo = null, flowEngineCode = null } = tenantSetting || {};
    const watermarkObj = JSON.parse(watermark);
    const logoObj = JSON.parse(logo);

    return (
      <div className={cls(styles['container-box'])}>
        <Tabs
          tabBarExtraContent={this.getTabBarExtraContent()}
          defaultActiveKey="watermark"
          onChange={this.handleActiveChange}
        >
          <TabPane tab={`租户【${configTenant.name}】水印`} key="watermark">
            <Watermark
              key={watermarkObj && watermarkObj.id}
              opting={loading.global}
              onSave={this.handleSaveWatermark}
              onDel={this.handleSaveWatermark}
              editData={watermarkObj}
              tenant={configTenant}
            />
          </TabPane>
          <TabPane tab={`租户【${configTenant.name}】图标`} key="SystemLogo">
            <SystemLogo
              key={logoObj && logoObj.id}
              opting={loading.global}
              editData={logoObj}
              onSave={this.handleSaveLogo}
            />
          </TabPane>
          <TabPane tab={`租户【${configTenant.name}】流程引擎代码`} key="flowEngineCode">
            <FlowEngineCode
              key={flowEngineCode}
              opting={loading.global}
              editData={flowEngineCode}
              onSave={this.handleSaveFlowEnginCode}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default index;
