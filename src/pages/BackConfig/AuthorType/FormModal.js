import React, { PureComponent } from "react";
import { toUpper, trim } from 'lodash'
import { Form, Input, Switch } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { ExtModal, ComboList } from 'seid';
import { constants } from "@/utils";

const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
};

@Form.create()
class FormModal extends PureComponent {

  handlerFormSubmit = _ => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      params.code = toUpper(trim(params.code));
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改权限对象' : '新建权限对象';
    getFieldDecorator("appModuleId", { initialValue: rowData ? rowData.appModuleId : "" });
    getFieldDecorator("appModuleCode", { initialValue: rowData ? rowData.appModuleCode : "" });
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
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={title}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="应用模块">
            {getFieldDecorator("appModuleName", {
              initialValue: rowData ? rowData.appModuleName : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "feature.group.appModule.required", defaultMessage: "请选择应用模块" })
              }]
            })(
              <ComboList {...appModuleProps} />
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: rowData ? rowData.name : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label='实体类名'>
            {getFieldDecorator("entityClassName", {
              initialValue: rowData ? rowData.entityClassName : "",
              rules: [{
                required: true,
                message: '实体类名不能为空'
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label='API服务路径'>
            {getFieldDecorator("apiPath", {
              initialValue: rowData ? rowData.apiPath : "",
              rules: [{
                required: true,
                message: 'API服务路径不能为空'
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label='树形结构'>
            {getFieldDecorator("beTree", {
              initialValue: rowData ? rowData.beTree || false : false,
              valuePropName: "checked"
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
