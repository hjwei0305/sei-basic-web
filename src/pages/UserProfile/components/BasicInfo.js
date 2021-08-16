import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { get, isEqual } from 'lodash';
import { Form, Radio, Input, Button, Select, Row, Col, Upload } from 'antd';
import { message } from 'suid';
import { userUtils } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';

const { getCurrentUser } = userUtils;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const defaultHeadIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAFhUlEQVRYR71Za4gbVRT+zkyaZNLdbWvJPvrY7U0o/pCWKiwIUnUtCEKLVOsDRCmCpX8KChaK1IqPIkJRKIpof2gRwa5YoRT8VWgVH1hf1PaHQmamqU1rtvtod5PdPGaunLBZstlscu+k7gdDyOz5vvPNzb13zrlLaANSypDrutsA3AtgM4AkgDUA7piVHQOQAZACcAHAT67rnhkaGioHTUtBiKlUarthGM8A2AkgoqlRAPC17/ufJ5PJ05pcaBl2HOdpAPsB3KObqFE8Ef0qpTwihPhCVU/JsG3bdxqGcURKuV1VWCeOiE77vv9yIpH4qxWvpeHLly8/6/v+xwCircTa/PuMlHJPIpH4rJlOU8Ou6x6UUr7ZphEtupTy1UQi8dZipEUN27Z9mIhe0cp2m4KJ6PCGDRsONpz3jW46jnMAwNu3KX9QmQNCiHfqyQtG2HGcpwAor1oWjEaj6OrqQigUqlyGYczlmZmZwdTUVOXShe/7u5LJ5Fe1vHmGM5lMf6FQ+APAKlXx1atXo7Ozs2W453m4cuVKy7i6gBEp5aZEIvFv9f48w7ZtDxPRE6qqbJQNqyKfzyObzaqGV+OOCyF2LzBs2/YOIjqlqsY/fV9fH0zTVKVU4m7evInx8XEtDoAhIcRZJs2NsOM4fOMBVSXVqVCvJ6XEtWvXUCwWVVNx3CkhxKNzhm3bvp+IzukorFu3rrLAgmBsbAy3bt3Sopqmuam/v/9iZYQdx/kQwF5VBTbKhoOCd4wbN25o0at7c9Uwl4B9qgqWZaGnp0c1fEFcoVCoTAtN/CmE2EyO42wB8LsOefny5YjH4zqUebGlUglXr17V5nue10+2bb9ARFzcKEN3O6sXDrgng4ge5xF+F8BLym4BrFy5snIFBe8UmUwGPNI6IKJD5Lrul1LKXarEcDiMNWu4C2oPExMT4EsTn/IInwHwkA6xnS2tmuf69evgOkMT37DhH2ebSGVuu1OCjbJhXRDR92xY6w1XTcLbGm9vuuD5y2Z5awuAs2z45Gz3q8WPRCLo7e3llavFC/KWq0lwkhfdUSnlPq2ss8ErVqzAqlXKlShyuRxGRkaCpKpyjvI+vI+IjgZV6e7uRiwWa0kvl8uVqcCfQcEDy4a3EtG3QUW4vGTTPEWagWuHIF1HraZhGFtJSmk6jjNNRMuCmlYpNV3XDSpf4Ukpi0IIq1r8cOG+I4gi93O8Y7RafAFfFLWWKjVx1TC3IJ/oGu7o6AAvvGXL1H4cbpF4WvBnAOwWQhyvGB4eHjYHBwe52aqeOjbV42qNCyAe3SDQNU5EowMDA91E5Ne2SK8DONTMAL8ouJ0P8sJopMvGJycnMT093fS5fd9/I5lMvsZBc4YvXbrUEYvFbAALCl3uMHi/5ZH9P8DThBtTLjsbIGtZVqK3tzc3zzB/sW17DxF9VEtqt27QeUAu6utLztkDwmNVnUYnPycAPFkNWLt2rfKi0jHXKJZHmY8BanBCCMFn0nNYYHh0dLRrcnLyBynlXbyouF5YKtT2ekR0sVQq3bdx48Z57XXDyiWVSm0iojPxeDzOW9dSIp1Ow/f9rGma27itr8+9aKmVTqcH169f//NSmuVc2Wx2Ympq6uFkMnm+Ue6mtWE+n3/Rsqz3ltK053nvh0KhRavHlsVsuVx+jEXC4bDyuUWQBywWi/8Q0c5wOPxLM35Lw1VyLpc7Fg6HnwuFQuEghhbj+L7vF4vF45ZlPa+iq2yYxaSU3fl8/gPTNB+JRCJtvUU8zyuVSqVz0Wh0PxHxmbQStAzXKo6Pj/No741Go3eHQiHloqJUKqXL5fKwZVn8PxTtPj+w4TrzAwAeBLDFNE1hmmaPaZqdhmHEPM/7W0p5wTCM7yKRyG9EpH9GVZPsP4tSI7alLL2bAAAAAElFTkSuQmCC';

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
                  <div className="desc">图片为png格式，大小在10Kb以内;</div>
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
            <FormItem label={formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})} {...formItemLayout}>
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
