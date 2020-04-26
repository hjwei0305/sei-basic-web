import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = (_) => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, formData);
      save(params);
    });
  };

  checkPassword = (rule, password, callback) => {
    if (!password || password.length < 8) {
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
      return false;
    }
    let iNow = 0;
    if (password.match(/[0-9]/g)) {
      iNow++;
    }
    if (password.match(/[a-z]/ig)) {
      iNow++;
    }
    if (password.match(/[~!@#$%^&*]/g)) {
      iNow++;
    }
    if (iNow < 2) {
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
      return false;
    }
    callback();
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal, parentData } = this.props;
    const { getFieldDecorator } = form;
    const title = `重置用户【${rowData.userName}】的密码`;

    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText="重置"
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="新密码">
            {getFieldDecorator('password', {
              initialValue: '',
              rules: [
                { required: true, message: '请填写新密码!' },
                { validator: this.checkPassword },
              ],
            })(<Input.Password visibilityToggle />)}
          </FormItem>
          {/* 以下为隐藏的formItem */}
          <FormItem
            style={{ display: 'none' }}
          >
            {getFieldDecorator('tenant', {
              initialValue: rowData && rowData.tenantCode,
            })(<Input />)}
          </FormItem>
          <FormItem
            style={{ display: 'none' }}
          >
            {getFieldDecorator('account', {
              initialValue: rowData && rowData.code,
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
