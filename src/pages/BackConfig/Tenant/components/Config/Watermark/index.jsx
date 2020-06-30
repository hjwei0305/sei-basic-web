import React, { Component } from 'react';
import { Empty, Form, Input, InputNumber, Button, Spin, Switch, Row, Col } from 'antd';
import cls from 'classnames';
import { ColumnLayout, ColorPicker } from '@/components';
import { watermark } from '@/utils';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const colFormItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

// const formItemLayout = {
//   labelCol: {
//     span: 6,
//   },
//   wrapperCol: {
//     span: 18,
//   },
// };

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 5,
    },
  },
};

const FormItem = Form.Item;

@Form.create()
class FormPanel extends Component {
  constructor(props) {
    super(props);
    const { editData = null } = props;
    this.state = {
      watermarkImg: editData ? editData.watermarkImg : null,
    };
  }

  onSubmit = () => {
    const { form } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFields((err, formData) => {
        if (err) {
          reject(err);
        }
        resolve(formData);
      });
    });
  };

  handleSave = () => {
    this.onSubmit().then(values => {
      const waterPreviewParams = {
        fillStyle: `rgba(${values.color.r}, ${values.color.g}, ${values.color.b}, ${values.color
          .a || 1})`,
        ...values,
      };
      const watermarkImg = watermark(waterPreviewParams);
      this.setState(
        {
          watermarkImg,
        },
        () => {
          const { onSave } = this.props;
          if (onSave) {
            onSave({ ...values, watermarkImg });
          }
        },
      );
    });
  };

  handlePreview = () => {
    this.onSubmit().then(values => {
      const waterPreviewParams = {
        fillStyle: `rgba(${values.color.r}, ${values.color.g}, ${values.color.b}, ${values.color
          .a || 1})`,
        ...values,
      };
      this.setState({
        watermarkImg: watermark(waterPreviewParams),
      });
    });
  };

  handleDel = () => {
    const { onDel } = this.props;
    if (onDel) {
      onDel(null);
    }
  };

  render() {
    const { watermarkImg } = this.state;
    const { editData, form, opting } = this.props;
    const { getFieldDecorator } = form;
    const {
      watermarkText = '',
      color = {
        r: '241',
        g: '112',
        b: '19',
        a: '0.2',
      },
      rotate = 30,
      fontSize = 20,
      width = 300,
      height = 150,
      disabled = false,
      isUseUserNameText = false,
    } = editData || {};

    return (
      <ColumnLayout title={['水印设计', '水印预览']}>
        <Form
          style={{ padding: 8 }}
          slot="left"
          {...formItemLayout}
          layout="horizontal"
          onSubmit={this.onSubmit}
        >
          <Spin spinning={opting}>
            <FormItem label="文案">
              {getFieldDecorator('watermarkText', {
                initialValue: watermarkText,
                rules: [
                  {
                    required: true,
                    message: '文案不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="字号" {...colFormItemLayout}>
                  {getFieldDecorator('fontSize', {
                    initialValue: fontSize,
                    rules: [
                      {
                        required: true,
                        message: '字号不能为空',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} max={50} min={10} precision={0} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="旋转角度" {...colFormItemLayout}>
                  {getFieldDecorator('rotate', {
                    initialValue: rotate,
                    rules: [
                      {
                        required: true,
                        message: '旋转角度不能为空',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="宽度" {...colFormItemLayout}>
                  {getFieldDecorator('width', {
                    initialValue: width,
                    rules: [
                      {
                        required: true,
                        message: '宽度不能为空',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} min={50} precision={0} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="高度" {...colFormItemLayout}>
                  {getFieldDecorator('height', {
                    initialValue: height,
                    rules: [
                      {
                        required: true,
                        message: '高度不能为空',
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} min={50} precision={0} />)}
                </FormItem>
              </Col>
            </Row>
            <FormItem label="颜色">
              {getFieldDecorator('color', {
                initialValue: color,
                rules: [
                  {
                    required: true,
                    message: '颜色不能为空',
                  },
                ],
              })(<ColorPicker style={{ width: '100%' }} />)}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label="用户名文案" {...colFormItemLayout}>
                  {getFieldDecorator('isUseUserNameText', {
                    valuePropName: 'checked',
                    initialValue: isUseUserNameText,
                  })(<Switch />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="禁用" {...colFormItemLayout}>
                  {getFieldDecorator('disabled', {
                    valuePropName: 'checked',
                    initialValue: disabled,
                  })(<Switch />)}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...tailFormItemLayout}>
              <Button style={{ marginRight: 8 }} type="primary" onClick={this.handleSave}>
                保存
              </Button>
              <Button style={{ marginRight: 8 }} onClick={this.handlePreview}>
                预览
              </Button>
            </FormItem>
          </Spin>
        </Form>
        {watermarkImg ? (
          <div
            className={cls(styles['watermark-preview'])}
            style={{ background: `url(${watermarkImg})` }}
            slot="right"
          />
        ) : (
          <div className={cls(styles['empty-warpper'])} slot="right">
            <Empty description="暂无水印" />
          </div>
        )}
      </ColumnLayout>
    );
  }
}

export default FormPanel;
