import React, { PureComponent } from "react";
import { Form, Input, Checkbox, } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal } from 'suid'

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
class FormModal extends PureComponent {

  onFormSubmit = _ => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ? formatMessage({
        id: "global.edit",
        defaultMessage: "编辑"
      })
      : formatMessage({ id: "global.add", defaultMessage: "新建" });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.onFormSubmit}
        width={600}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
            {getFieldDecorator("code", {
              initialValue: rowData ? rowData.code : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
              }, {
                max: 4,
                message: '字符长度不能超过4个'
              }]
            })(<Input  disabled={!!rowData} />)}
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
          <FormItem label="国家货币代码">
            {getFieldDecorator("currencyCode", {
              initialValue: rowData ? rowData.currencyCode : "",
              rules: [{
                required: true,
                message: "国家货币代码不能为空",
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label="国家货币名称">
            {getFieldDecorator("currencyName", {
              initialValue: rowData ? rowData.currencyName : "",
              rules: [{
                required: true,
                message: "国家货币名称不能为空",
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.rank", defaultMessage: "序号" })}>
            {getFieldDecorator("rank", {
              initialValue: rowData ? rowData.rank : "",
            })(<Input />)}
          </FormItem>
          <FormItem label="是否国外">
            {getFieldDecorator("toForeign", {
              valuePropName: 'checked',
              initialValue: rowData ? rowData.toForeign : false,
            })(<Checkbox />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
