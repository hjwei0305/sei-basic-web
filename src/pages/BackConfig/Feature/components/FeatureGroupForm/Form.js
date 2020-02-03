import React, { PureComponent } from "react";
import cls from "classnames";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Button, Form, Input } from "antd";
import { ComboList, utils } from "seid";
import { constants } from "@/utils";
import styles from "./Form.less";

const { objectAssignAppend } = utils;
const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
};

@Form.create()
class FeatureGroupForm extends PureComponent {

  onFormSubmit = _ => {
    const { form, saveFeatureGroup, groupData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const data = objectAssignAppend(getFieldsValue(), groupData || {});
      saveFeatureGroup(data, handlerPopoverHide);
    });
  };

  render() {
    const { form, groupData, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = groupData ? '编辑功能项组' : '新建功能项组';
    getFieldDecorator("appModuleId", { initialValue: groupData ? groupData.appModuleId : "" });
    getFieldDecorator("appModuleCode", { initialValue: groupData ? groupData.appModuleCode : "" });
    const appModuleProps = {
      form,
      name: 'appModuleName',
      field: ['appModuleId', 'appModuleCode'],
      searchPlaceHolder: "输入名称关键字查询",
      store: {
        url: `${SERVER_PATH}/sei-basic/appModule/findAllUnfrozen`
      },
      reader: {
        name: 'name',
        field: ['id', 'code']
      }
    };
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
                initialValue: groupData ? groupData.code : "",
                rules: [{
                  required: true,
                  message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
                }]
              })(
                <Input allowClear />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
              {getFieldDecorator("name", {
                initialValue: groupData ? groupData.name : "",
                rules: [{
                  required: true,
                  message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
                }]
              })(
                <Input allowClear />
              )}
            </FormItem>
            <FormItem label="所属应用模块">
              {getFieldDecorator("appModuleName", {
                initialValue: groupData ? groupData.appModuleName : "",
                rules: [{
                  required: true,
                  message: formatMessage({ id: "feature.group.appModule.required", defaultMessage: "请选择所属应用模块" })
                }]
              })(
                <ComboList {...appModuleProps} />
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 4, offset: 7 }} className="btn-submit">
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
