import React, { PureComponent } from "react";
import { Form, Input, Checkbox, } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal, ComboGrid } from 'seid';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;

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
      Object.assign(params);
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal, parentData } = this.props;
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
        okText={'保存'}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal" >
          <FormItem label="帐号">
            {getFieldDecorator("code", {
              initialValue: rowData ? rowData.code : "",
              rules: [{
                required: true,
                message: "帐号不能为空",
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: rowData ? rowData.userName : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={'冻结'}>
            {getFieldDecorator('frozen', {
              valuePropName: 'checked',
              initialValue: rowData && rowData.frozen,
            })(<Checkbox />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;