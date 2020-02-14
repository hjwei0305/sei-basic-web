import React, { PureComponent } from "react";
import { toUpper, trim } from 'lodash'
import { Form, Input, InputNumber } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { ExtModal } from 'seid'

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
    const title = rowData
      ? formatMessage({
        id: "appModule.edit",
        defaultMessage: "修改业务模块"
      })
      : formatMessage({ id: "appModule.add", defaultMessage: "新建业务模块" });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        title={title}
        onOk={this.handlerFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: rowData ? rowData.name : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
            {getFieldDecorator("code", {
              initialValue: rowData ? rowData.code : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
              }]
            })(<Input
              maxLength={10}
              placeholder={formatMessage({ id: "global.code.tip", defaultMessage: "规则:名称各汉字首字母大写" })}
            />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.remark", defaultMessage: "说明" })}>
            {getFieldDecorator("remark", {
              initialValue: rowData ? rowData.remark : ""
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "appModule.webBaseAddress", defaultMessage: "WEB基地址" })}>
            {getFieldDecorator("webBaseAddress", {
              initialValue: rowData ? rowData.webBaseAddress : ""
            })(<Input precision={0} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "appModule.apiBaseAddress", defaultMessage: "API基地址" })}>
            {getFieldDecorator("apiBaseAddress", {
              initialValue: rowData ? rowData.apiBaseAddress : ""
            })(<Input precision={0} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.rank", defaultMessage: "序号" })}>
            {getFieldDecorator("rank", {
              initialValue: rowData ? rowData.rank : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.rank.required", defaultMessage: "序号不能为空" })
              }]
            })(<InputNumber precision={0} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
