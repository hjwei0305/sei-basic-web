import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { get, isEqual } from 'lodash';
import { Form, Radio, Input, Button, Select, Row, Col, message, Upload } from 'antd';
import { userUtils } from '@/utils';

const { getCurrentUser } = userUtils;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const defaultHeadIcon =
  'data:image/png;base64,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';

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
@Form.create()
class BasicInfo extends PureComponent {
  constructor(props) {
    super(props);
    const { userProfile } = props;
    const { basicInfo } = userProfile;
    this.state = {
      headIcon: get(basicInfo, 'portrait', ''),
    };
  }

  componentDidUpdate(prevProps) {
    const { userProfile } = this.props;
    const { basicInfo } = userProfile;
    if (!isEqual(prevProps.userProfile.basicInfo, basicInfo)) {
      this.setState({ headIcon: get(basicInfo, 'portrait', '') });
    }
  }

  handleSave = () => {
    const { headIcon } = this.state;
    const { form, dispatch, userProfile } = this.props;
    const { basicInfo } = userProfile;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, basicInfo);
      Object.assign(params, formData);
      Object.assign(params, { portrait: headIcon });
      dispatch({
        type: 'userProfile/save',
        payload: params,
      }).then(res => {
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
  };

  customRequest = option => {
    const formData = new FormData();
    formData.append('files[]', option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = e => {
      if (e && e.target && e.target.result) {
        option.onSuccess();
        this.setState({ headIcon: e.target.result });
      }
    };
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传PNG文件!');
      return false;
    }
    const isLt10K = file.size / 1024 <= 10;
    if (!isLt10K) {
      message.error('图片大小需小于10Kb!');
      return false;
    }
    return isJpgOrPng && isLt10K;
  };

  render() {
    const { headIcon } = this.state;
    const { form, userProfile, loading } = this.props;
    const { getFieldDecorator } = form;
    const { basicInfo } = userProfile;
    const uploadProps = {
      customRequest: this.customRequest,
      showUploadList: false, // 不展示文件列表
      beforeUpload: this.beforeUpload,
    };
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
      <Form>
        <Row>
          <Col span={24}>
            <div className="box-item">
              <div className="title">我的头像</div>
              <div className="head-icon-box horizontal">
                <div className="row-start head-icon">
                  <img alt="" src={headIcon || defaultHeadIcon} />
                </div>
                <div className="tool-box vertical">
                  <Upload {...uploadProps}>
                    <Button type="primary" icon="upload" ghost>
                      上传头像
                    </Button>
                  </Upload>
                  <div className="desc">图片为png格式,图片长宽都为44px，大小在10Kb以内;</div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('userName', {
                initialValue: userName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="用户类型" {...formItemLayout}>
              {getFieldDecorator('userTypeRemark', {
                initialValue: userTypeRemark,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="组织机构" {...formItemLayout}>
              {getFieldDecorator('organizationName', {
                initialValue: organizationName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="员工编号" {...formItemLayout}>
              {getFieldDecorator('employeeCode', {
                initialValue: employeeCode,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="性别">
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
            <FormItem {...formItemLayout} label="身份证号">
              {getFieldDecorator('idCard', {
                initialValue: idCard,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="邮箱">
              {getFieldDecorator('email', {
                initialValue: email,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="移动电话">
              {getFieldDecorator('mobile', {
                initialValue: mobile,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="语言代码">
              {getFieldDecorator('languageCode', {
                initialValue: languageCode,
              })(
                <Select>
                  <Select.Option value="zh_CN" key="zh_CN">
                    简体中文
                  </Select.Option>
                  <Select.Option value="en_US" key="en_US">
                    English
                  </Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="记账用户">
              {getFieldDecorator('accountor', {
                initialValue: accountor,
              })(<Input />)}
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
              <Button
                loading={loading.effects['userProfile/save']}
                type="primary"
                onClick={this.handleSave}
              >
                更新信息
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default BasicInfo;
