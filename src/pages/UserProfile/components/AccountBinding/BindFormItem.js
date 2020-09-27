import React, { Component } from 'react';
import { Input, Form, Button } from 'antd';
import cls from 'classnames';
import { connect } from 'dva';
import TimerButton from './TimerButton';

const emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
const mobileReg = /^(0|86|17951)?(1[3456789][0-9])[0-9]{8}$/;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
@Form.create({})
class BindFormItem extends Component {
  handleBind = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'userProfile/bindAccount',
        payload: formData,
      });
    });
  };

  handleSendVerifyCode = () => {
    const { form, dispatch, channel } = this.props;
    const { getFieldValue } = form;
    dispatch({
      type: 'userProfile/sendVerifyCode',
      payload: {
        reqId: getFieldValue('openId'),
        channel,
        operation: '绑定账号',
      },
    });
  };

  checkEmail = (_, email, callback) => {
    if (email && !emailReg.test(email)) {
      callback('邮箱格式不对');
      return false;
    }
    callback();
  };

  checkMobile = (_, mobile, callback) => {
    if (mobile && !mobileReg.test(mobile)) {
      callback('手机格式不对');
      return false;
    }
    callback();
  };

  getLabel = () => {
    const { channel } = this.props;
    if (channel === 'EMAIL') {
      return '绑定邮箱';
    }

    if (channel === 'WeChat') {
      return '绑定企业微信';
    }

    if (channel === 'DingTalk') {
      return '绑定钉钉';
    }

    return '绑定手机号';
  };

  getValidateRules = () => {
    const { channel } = this.props;
    if (channel === 'EMAIL') {
      return [
        {
          required: true,
          message: '邮箱不能为空',
        },
        {
          validator: this.checkEmail,
        },
      ];
    }

    if (channel === 'WeChat') {
      return [
        {
          required: true,
          message: '企业微信号不能为空',
        },
      ];
    }

    if (channel === 'DingTalk') {
      return [
        {
          required: true,
          message: '钉钉号不能为空',
        },
      ];
    }

    return [
      {
        required: true,
        message: '手机号不能为空',
      },
      {
        validator: this.checkMobile,
      },
    ];
  };

  validateOpenId = () => {
    const { form } = this.props;

    return new Promise((resolve, reject) => {
      form.validateFields(['openId'], (err, formData) => {
        if (err) {
          reject(err);
        }
        resolve(formData);
      });
    });
  };

  render() {
    const { form, channel } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={cls('binding-form')}>
        <Form {...formItemLayout}>
          <FormItem label="类型" style={{ display: 'none' }}>
            {getFieldDecorator('channel', {
              initialValue: channel,
            })(<Input />)}
          </FormItem>
          <FormItem label={this.getLabel()}>
            {getFieldDecorator('openId', {
              rules: this.getValidateRules(),
            })(<Input />)}
          </FormItem>
          <FormItem label="验证码">
            {getFieldDecorator('verifyCode', {
              rules: [
                {
                  required: true,
                  message: '验证码不能为空',
                },
              ],
            })(
              <Input
                addonAfter={
                  <TimerButton
                    size="small"
                    beforeClick={this.validateOpenId}
                    onClick={this.handleSendVerifyCode}
                  >
                    发送验证码
                  </TimerButton>
                }
              />,
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={this.handleBind}>
              立即绑定
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default BindFormItem;
