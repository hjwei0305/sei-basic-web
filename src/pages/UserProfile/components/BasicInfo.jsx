import React from 'react';
import { connect, } from 'dva';
import { Form, Radio, Input, Button, Select, Row, Col, } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 12}
}

@connect(({ userProfile, }) => ({ userProfile, }))
@Form.create()
class BasicInfo extends React.Component {

  handleSave = () => {
    const { form, dispatch, userProfile } = this.props;
    const { basicInfo } = userProfile;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, basicInfo);
      Object.assign(params, formData);
      dispatch({
        type: "userProfile/save",
        payload: params,
      });
    });

  }

  render() {
    const { form, userProfile, } = this.props;
    const { getFieldDecorator } = form;
    const { basicInfo } = userProfile;

    const {
      userName="",
      userTypeRemark="",
      organizationName="",
      employeeCode="",
      gender=false,
      idCard="",
      email="",
      mobile="",
      accountor="",
      languageCode="zh_CN",
    } = basicInfo || {};

    return (
      <Form style={{width: 600}}>
        <FormItem
          label="姓名"
          {...formItemLayout}
        >
          {getFieldDecorator('userName', {
            initialValue: userName,
          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          label="用户类型"
          {...formItemLayout}
        >
          {getFieldDecorator('userTypeRemark', {
            initialValue: userTypeRemark,
          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          label="组织机构"
          {...formItemLayout}
        >
          {getFieldDecorator('organizationName', {
            initialValue: organizationName,
          })(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          label="员工编号"
          {...formItemLayout}
        >
          {getFieldDecorator('employeeCode', {
            initialValue: employeeCode,
          })(
            <Input disabled/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="性别"
        >
          {getFieldDecorator('gender', {
            initialValue: gender,
          })(
            <RadioGroup>
              <Radio value={true}>男</Radio>
              <Radio value={false}>女</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="身份证号"
        >
          {getFieldDecorator('idCard', {
            initialValue: idCard,
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="邮箱"
        >
          {getFieldDecorator('email', {
            initialValue: email,
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="移动电话"
        >
          {getFieldDecorator('mobile', {
            initialValue: mobile,
          })(
            <Input/>
          )}
        </FormItem>
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
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="记账用户"
        >
          {getFieldDecorator('accountor', {
            initialValue: accountor,
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 8,
          }}
        >
          <Button type="primary" onClick={this.handleSave}>更新信息</Button>
        </FormItem>
      </Form>
    )
  }
}

export default BasicInfo;
