import React, { PureComponent } from "react";
import { Form, Input, } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal } from 'seid';
import { userUtils, } from '@/utils';

const { getCurrentUser, } = userUtils;
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
    const { form, save, editData } = this.props;
    const user = getCurrentUser();
    console.log(user, 'user');
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, editData || {
        userId: user.userId,
        tenantCode: user.tenantCode,
        systemCode: 'sei',
        accountType: user.userType,
      });
      Object.assign(params);
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, editData, onClose, saving, visible, } = this.props;
    const { getFieldDecorator } = form;
    const title = editData
      ? formatMessage({
        id: "global.edit",
        defaultMessage: "编辑"
      })
      : formatMessage({ id: "global.add", defaultMessage: "新建" });

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText={'保存'}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal" >
          <FormItem label="帐号">
            {getFieldDecorator("account", {
              initialValue: editData ? editData.account : "",
              rules: [{
                required: true,
                message: "帐号不能为空",
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: editData ? editData.name : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<Input />)}
          </FormItem>

        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
