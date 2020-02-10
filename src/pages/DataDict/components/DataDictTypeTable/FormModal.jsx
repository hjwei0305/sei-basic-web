import React, { PureComponent } from "react";
import { Form, Input, Checkbox, } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal, } from 'seid';

const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {

  onFormSubmit = _ => {
    const { form, save } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, saving, visible, onCancel, rowData, } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18,
      }
    };
    const title = rowData ? '编辑' : formatMessage({ id: "global.add", defaultMessage: "新建" });
    const { id, code='', name='', remark, frozen=false, } = rowData || {};

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={() => {this.onFormSubmit()}}
        width={500}
        okText="保存"
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
            {getFieldDecorator("code", {
              initialValue: code,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
              }]
            })(<Input  disabled={!!rowData} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: name,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label="描述">
            {getFieldDecorator("remark", {
              initialValue: remark,
            })(<Input />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator("frozen", {
              valuePropName: 'checked',
              initialValue: frozen,
            })(<Checkbox />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
