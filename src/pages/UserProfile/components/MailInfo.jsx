import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import { userUtils } from '@/utils';

const { getCurrentUser } = userUtils;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

@connect(({ userProfile }) => ({ userProfile }))
@Form.create()
class MailInfo extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userProfile/getEmailAlert',
    });
  }

  handleSave = () => {
    const { form, dispatch, userProfile } = this.props;
    const { mailAlert } = userProfile;
    const user = getCurrentUser();
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, mailAlert);
      Object.assign(params, formData);
      Object.assign(params, { userId: user.userId });
      dispatch({
        type: 'userProfile/saveEmailAlert',
        payload: params,
      });
    });
  };

  render() {
    const { form, userProfile } = this.props;
    const { getFieldDecorator } = form;
    const { mailAlert } = userProfile;

    const { hours = '', toDoAmount = '', lastTime = '' } = mailAlert || {};

    return (
      <Form style={{ width: 600 }}>
        <FormItem label="间隔时间(小时)" {...formItemLayout}>
          {getFieldDecorator('hours', {
            initialValue: hours,
            rules: [
              {
                required: true,
                message: '请填写间隔时间(小时)!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="待办工作数量(个)" {...formItemLayout}>
          {getFieldDecorator('toDoAmount', {
            initialValue: toDoAmount,
            rules: [
              {
                required: true,
                message: '待办工作数量(个)!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="最后提醒时间" {...formItemLayout}>
          {getFieldDecorator('lastTime', {
            initialValue: lastTime,
          })(<Input disabled />)}
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 8,
          }}
        >
          <Button type="primary" onClick={this.handleSave}>
            更新
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default MailInfo;
