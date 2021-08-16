import React from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Form, Input, Button, Icon } from 'antd';
import { userUtils } from '@/utils';
import md5 from 'md5';
import { formatMessage } from 'umi-plugin-react/locale';
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
    const { form, dispatch, afterUpdate, editData } = this.props;
    const { openId: account } = editData;
    const { tenantCode } = getCurrentUser() || {};
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const { oldPassword, newPassword, confirmNewPassword } = formData;
      const params = {};
      Object.assign(params, { tenant: tenantCode, account });
      Object.assign(params, formData, {
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword),
        confirmNewPassword: md5(confirmNewPassword),
      });

      dispatch({
        type: 'userProfile/updatePwd',
        payload: params,
      }).then(result => {
        const { success } = result;
        if (success && afterUpdate) {
          afterUpdate();
        }
      });
    });
  };

  checkPassword = (_, password, callback) => {
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
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    const saving = loading.effects['userProfile/updatePwd'];
    return (
      <div className={cls('update-pwd-form')}>
        <Form {...formItemLayout}>
          <FormItem
            wrapperCol={{ offset: 0 }}
            style={{
              border: '2px solid #E7EAF9',
              backgroundColor: '#F8F9FE',
            }}
          >
            <div className={cls(styles['info-tip-wrapper'])}>
              <Icon type="info-circle" />
              <span className={cls('tip-text')}>{formatMessage({id: 'basic_000008', defaultMessage: '密码须包含字母、数字、特殊字符至少2种,密码长度不能小于8位'})}</span>
            </div>
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000010', defaultMessage: '原密码'})}>
            {getFieldDecorator('oldPassword', {
              initialValue: '',
              rules: [{ required: true, message: formatMessage({id: 'basic_000011', defaultMessage: '原密码'}) }],
            })(<Input.Password visibilityToggle disabled={!!saving} />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000012', defaultMessage: '新密码'})}>
            {getFieldDecorator('newPassword', {
              initialValue: '',
              rules: [
                { required: true, message: '请填写新密码!' },
                { validator: this.checkPassword },
              ],
            })(<Input.Password visibilityToggle disabled={!!saving} />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000013', defaultMessage: '确认新密码'})}>
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
            {formatMessage({id: 'basic_000014', defaultMessage: '立即修改'})}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default UpdatePwd;
