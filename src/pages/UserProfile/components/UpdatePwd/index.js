import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Form, Input, Button, Icon } from 'antd';
import { userUtils } from '@/utils';
import md5 from 'md5';

import styles from './index.less';

const { getCurrentUser } = userUtils;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
@Form.create()
class UpdatePwd extends React.Component {
  handleSave = () => {
    const { form, dispatch } = this.props;
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

      dispatch({
        type: 'userProfile/updatePwd',
        payload: params,
      });
    });
  };

  checkPassword = (_, password, callback) => {
    if (!password || password.length < 8) {
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
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
      callback('密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位');
      return false;
    }
    callback();
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    const saving = loading.effects['userProfile/updatePwd'];
    return (
      <Form style={{ width: 600 }}>
        <FormItem
          wrapperCol={{ offset: 0 }}
          style={{
            border: '2px solid #E7EAF9',
            backgroundColor: '#F8F9FE',
          }}
        >
          <div className={cls(styles['info-tip-wrapper'])}>
            <Icon type="info-circle" />
            <span className={cls('tip-text')}>为保障您的帐号安全，修改密码前请填写原密码</span>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="原密码">
          {getFieldDecorator('oldPassword', {
            initialValue: '',
            rules: [{ required: true, message: '请填写原密码!' }],
          })(<Input.Password autoFocus visibilityToggle disabled={!!saving} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="新密码">
          {getFieldDecorator('newPassword', {
            initialValue: '',
            rules: [
              { required: true, message: '请填写新密码!' },
              { validator: this.checkPassword },
            ],
          })(<Input.Password visibilityToggle disabled={!!saving} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="确认新密码">
          {getFieldDecorator('confirmNewPassword', {
            initialValue: '',
            rules: [
              { required: true, message: '请填写确认新密码!' },
              { validator: this.checkPassword },
            ],
          })(<Input.Password visibilityToggle disabled={!!saving} />)}
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 8,
          }}
        >
          <Button type="primary" loading={saving} onClick={this.handleSave}>
            立即修改
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default UpdatePwd;
