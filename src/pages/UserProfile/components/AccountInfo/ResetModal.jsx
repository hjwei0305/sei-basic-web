import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal } from 'suid';
import md5 from 'md5';
import { userUtils } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';

const { getCurrentUser } = userUtils;
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
class ResetPwdModal extends PureComponent {
  onFormSubmit = () => {
    const { form, save } = this.props;
    const { tenantCode } = getCurrentUser() || {};
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const { oldPassword, newPassword, confirmNewPassword } = formData;
      const params = {};
      Object.assign(params, { tenant: tenantCode });
      Object.assign(params, formData, {
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword),
        confirmNewPassword: md5(confirmNewPassword),
      });
      save(params);
    });
  };

  checkPassword = (_rule, password, callback) => {
    if (!password || password.length < 8) {
      callback(formatMessage({id: 'basic_000008', defaultMessage: '密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位'}));
      return false;
    }
    let iNow = 0;
    if (password.match(/[0-9]/g)) {
      iNow += 1;
    }
    if (password.match(/[a-z]/gi)) {
      iNow += 1;
    }
    if (password.match(/[~!@#$%^&*]/g)) {
      iNow += 1;
    }
    if (iNow < 2) {
      callback(formatMessage({id: 'basic_000008', defaultMessage: '密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位'}));
      return false;
    }
    callback();
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const title ={formatMessage({id: 'basic_000070', defaultMessage: '更新密码'})};

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText={formatMessage({id: 'basic_000034', defaultMessage: '保存'})}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({id: 'basic_000071', defaultMessage: '帐号'})}>
            {getFieldDecorator('account', {
              initialValue: editData.account,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000072', defaultMessage: '帐号不能为空'}),
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'basic_000073', defaultMessage: '旧密码'})}>
            {getFieldDecorator('oldPassword', {
              initialValue: '',
              rules: [{ required: true, message: formatMessage({id: 'basic_000074', defaultMessage: '请填写旧密码!'}) }],
            })(<Input.Password visibilityToggle />)}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'basic_000012', defaultMessage: '新密码'})}>
            {getFieldDecorator('newPassword', {
              initialValue: '',
              rules: [
                { required: true, message: '请填写新密码!' },
                { validator: this.checkPassword },
              ],
            })(<Input.Password visibilityToggle />)}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'basic_000013', defaultMessage: '确认新密码'})}>
            {getFieldDecorator('confirmNewPassword', {
              initialValue: '',
              rules: [
                { required: true, message: '请填写确认新密码!' },
                { validator: this.checkPassword },
              ],
            })(<Input.Password visibilityToggle />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default ResetPwdModal;
