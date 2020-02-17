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
class ResetPwdModal extends PureComponent {

  onFormSubmit = _ => {
    const { form, save, } = this.props;
    const { tenantCode, } = getCurrentUser() || {};
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, { tenant: tenantCode, });
      Object.assign(params, formData);
      save(params);
    });
  };

  checkPassword = (rule, password, callback) => {
    if(!password || password.length < 8){
      callback("密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位");
      return false
    }
    let iNow = 0;
    if(password.match(/[0-9]/g)){
      iNow++;
    }
    if(password.match(/[a-z]/ig)){
      iNow++;
    }
    if(password.match(/[~!@#$%^&*]/g)){
      iNow++;
    }
    if(iNow < 2){
      callback("密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位");
      return false;
    }
    callback();
  };

  render() {
    const { form, editData, onClose, saving, visible, } = this.props;
    const { getFieldDecorator } = form;
    const title = "更新密码";

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
              initialValue: editData.account,
              rules: [{
                required: true,
                message: "帐号不能为空",
              }]
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="旧密码">
            {getFieldDecorator('oldPassword', {
              initialValue: "",
              rules: [{required: true, message: '请填写旧密码!'}]
            })(
              <Input.Password visibilityToggle={true}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新密码"
          >
            {getFieldDecorator('newPassword', {
              initialValue: "",
              rules: [
                {required: true, message: '请填写新密码!'},
                {validator: this.checkPassword}]
            })(
              <Input.Password visibilityToggle={true}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认新密码"
          >
            {getFieldDecorator('confirmNewPassword', {
              initialValue: "",
              rules: [{required: true, message: '请填写确认新密码!'},
                {validator: this.checkPassword}]
            })(
              <Input.Password visibilityToggle={true}/>
            )}
          </FormItem>

        </Form>
      </ExtModal>
    );
  }
}

export default ResetPwdModal;
