import React, { PureComponent } from "react";
import cls from "classnames";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Button, Form, Input, Switch } from "antd";
import styles from "./Form.less";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

@Form.create()
class FeatureGroupForm extends PureComponent {

  onFormSubmit = _ => {
    const { form, saveTenant, tenantData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const data = Object.assign(tenantData || {}, getFieldsValue());
      saveTenant(data, handlerPopoverHide);
    });
  };

  render() {
    const { form, tenantData, saving } = this.props;
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
            <FormItem label="代码">
              {getFieldDecorator("code", {
                initialValue: tenantData ? tenantData.code : "",
              })(
                <Input
                  maxLength={10}
                  placeholder='租户代码一旦创建不能修改'
                  disabled={tenantData && tenantData.id}
                />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
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
            <FormItem wrapperCol={{ span: 4, offset: 4 }} className="btn-submit">
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
