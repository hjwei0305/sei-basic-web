import React, { PureComponent } from "react";
import cls from "classnames";
import { omit } from 'lodash'
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Button, Form, Input, Switch } from "antd";
import styles from "./Form.less";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

@Form.create()
class FeatureGroupForm extends PureComponent {

  onFormSubmit = _ => {
    const {
      form,
      saveTenant,
      tenantData: originTenantData,
      tenantRootOrganization: originTenantRootOrganization,
      handlerPopoverHide
    } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const formData = getFieldsValue();
      const tenantData = omit(Object.assign(originTenantData || {}, formData), ['tenantRootOrganizationName']);
      const tenantRootOrganization = Object.assign(originTenantRootOrganization || {}, { name: formData.tenantRootOrganizationName });
      saveTenant({ tenantData, tenantRootOrganization }, handlerPopoverHide);
    });
  };

  render() {
    const { form, tenantData, tenantRootOrganization, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = tenantData ? '编辑租户' : '新建租户';
    return (
      <div key="form-box" className={cls(styles["form-box"])}>
        <div className="base-view-body">
          <div className="header">
            <span className="title">
              {title}
            </span>
          </div>
          <Form {...formItemLayout}>
            <FormItem label="租户代码">
              {getFieldDecorator("code", {
                initialValue: tenantData ? tenantData.code : "",
                rules: [{
                  required: true,
                  message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
                }]
              })(
                <Input
                  maxLength={10}
                  placeholder='租户代码一旦创建不能修改'
                  disabled={tenantData && tenantData.id}
                />
              )}
            </FormItem>
            <FormItem label='租户名称'>
              {getFieldDecorator("name", {
                initialValue: tenantData ? tenantData.name : "",
                rules: [{
                  required: true,
                  message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
                }]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label='组织机构'>
              {getFieldDecorator("tenantRootOrganizationName", {
                initialValue: tenantRootOrganization ? tenantRootOrganization.name : "",
                rules: [{
                  required: true,
                  message: '组织机构不能为空',
                }]
              })(
                <Input addonBefore={tenantRootOrganization ? tenantRootOrganization.code : ""} />
              )}
            </FormItem>
            {
              tenantData && tenantData.id
                ? <FormItem label='冻结'>
                  {getFieldDecorator("frozen", {
                    initialValue: tenantData ? tenantData.frozen || false : false,
                    valuePropName: "checked"
                  })(<Switch size="small" />)}
                </FormItem>
                : null
            }
            <FormItem wrapperCol={{ span: 4, offset: 6 }} className="btn-submit">
              <Button
                type="primary"
                loading={saving}
                onClick={this.onFormSubmit}
              >
                <FormattedMessage id='global.save' defaultMessage='保存' />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default FeatureGroupForm;
