import React from 'react';
import { connect } from 'dva';
import { Form, Radio, Input, Button, Select, Row, Col } from 'antd';
import { userUtils } from '@/utils';

const { getCurrentUser } = userUtils;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

@connect(({ userProfile }) => ({ userProfile }))
@Form.create()
class BasicInfo extends React.Component {
  handleSave = () => {
    const { form, dispatch, userProfile } = this.props;
    const { basicInfo } = userProfile;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, basicInfo);
      Object.assign(params, formData);
      dispatch({
        type: 'userProfile/save',
        payload: params,
      }).then((res) => {
        if (res.success) {
          const user = getCurrentUser();
          dispatch({
            type: 'userProfile/getUserInfo',
            payload: {
              userId: user.userId,
            },
          });
        }
      });
    });
  }

  render() {
    const { form, userProfile } = this.props;
    const { getFieldDecorator } = form;
    const { basicInfo } = userProfile;

    const {
      userName = '',
      userTypeRemark = '',
      organizationName = '',
      employeeCode = '',
      gender = false,
      idCard = '',
      email = '',
      mobile = '',
      accountor = '',
      languageCode = 'zh_CN',
    } = basicInfo || {};

    return (
      <Form style={{ width: 1000 }}>
        <Row>
          <Col span={12}>
            <FormItem
              label="姓名"
              {...formItemLayout}
            >
              {getFieldDecorator('userName', {
                initialValue: userName,
              })(
                <Input disabled />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="用户类型"
              {...formItemLayout}
            >
              {getFieldDecorator('userTypeRemark', {
                initialValue: userTypeRemark,
              })(
                <Input disabled />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              label="组织机构"
              {...formItemLayout}
            >
              {getFieldDecorator('organizationName', {
                initialValue: organizationName,
              })(
                <Input disabled />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="员工编号"
              {...formItemLayout}
            >
              {getFieldDecorator('employeeCode', {
                initialValue: employeeCode,
              })(
                <Input disabled />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('gender', {
                initialValue: gender,
              })(
                <RadioGroup>
                  <Radio value>男</Radio>
                  <Radio value={false}>女</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="身份证号"
            >
              {getFieldDecorator('idCard', {
                initialValue: idCard,
              })(
                <Input />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="邮箱"
            >
              {getFieldDecorator('email', {
                initialValue: email,
              })(
                <Input />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="移动电话"
            >
              {getFieldDecorator('mobile', {
                initialValue: mobile,
              })(
                <Input />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="语言代码"
            >
              {getFieldDecorator('languageCode', {
                initialValue: languageCode,
              })(
                <Select>
                  <Select.Option value="zh_CN" key="zh_CN">简体中文</Select.Option>
                  <Select.Option value="en_US" key="en_US">English</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="记账用户"
            >
              {getFieldDecorator('accountor', {
                initialValue: accountor,
              })(
                <Input />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              wrapperCol={{
                offset: 8,
              }}
            >
              <Button type="primary" onClick={this.handleSave}>更新信息</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default BasicInfo;
