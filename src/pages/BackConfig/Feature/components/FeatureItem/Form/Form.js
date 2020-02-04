import React, { PureComponent } from "react";
import cls from "classnames";
import { toUpper, trim } from 'lodash'
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

const buttonWrapper = { span: 18, offset: 6 };

@Form.create()
class FeatureGroupForm extends PureComponent {

  onFormSubmit = _ => {
    const { form, save, currentPageRow, featureData, currentFeatureGroup, handlerPopoverHide } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {
        featureType: 'Operate',
        featureGroupId: currentFeatureGroup.id,
        featureGroupCode: currentFeatureGroup.code,
        featureGroupName: currentFeatureGroup.name,
        groupCode: currentPageRow.groupCode,
      };
      Object.assign(params, featureData || {});
      Object.assign(params, formData);
      params.code = `${currentFeatureGroup.code}-${toUpper(trim(params.code))}`;
      save(params, handlerPopoverHide);
    });
  };

  getCode = () => {
    const { featureData } = this.props;
    let newCode = '';
    if (featureData) {
      const { code, featureGroupCode } = featureData;
      newCode = code.substring(featureGroupCode.length + 1);
    }
    return newCode;
  };

  render() {
    const { form, featureData, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = featureData
      ? formatMessage({
        id: "feature.edit",
        defaultMessage: "修改功能项"
      })
      : formatMessage({ id: "feature.add", defaultMessage: "新建功能项" });
    return (
      <div key="form-box" className={cls(styles["form-box"])}>
        <div className="base-view-body">
          <div className="header">
            <span className="title">
              {title}
            </span>
          </div>
          <Form {...formItemLayout}>
            <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
              {getFieldDecorator("name", {
                initialValue: featureData ? featureData.name : "",
                rules: [{
                  required: true,
                  message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
                }]
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
              {getFieldDecorator("code", {
                initialValue: this.getCode(),
                rules: [{
                  required: true,
                  message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
                }]
              })(<Input maxLength={50} placeholder={formatMessage({ id: "global.code.tip", defaultMessage: "规则:名称各汉字首字母大写" })} />)}
            </FormItem>
            <FormItem label='服务方法地址'>
              {getFieldDecorator("url", {
                initialValue: featureData ? featureData.url : ""
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: "feature.tenantCanUse", defaultMessage: "租户可用" })}>
              {getFieldDecorator("tenantCanUse", {
                initialValue: featureData ? featureData.tenantCanUse || false : false,
                valuePropName: "checked"
              })(<Switch size="small" />)}
            </FormItem>
            <FormItem wrapperCol={buttonWrapper} className="btn-submit">
              <Button
                type="primary"
                loading={saving}
                onClick={this.onFormSubmit}
              >
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default FeatureGroupForm;
