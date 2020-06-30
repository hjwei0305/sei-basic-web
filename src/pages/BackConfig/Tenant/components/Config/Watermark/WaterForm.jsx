import React, { Component } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { ColorPicker } from '@/components';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 6,
    },
  },
};

const FormItem = Form.Item;

@Form.create()
class WaterForm extends Component {
  onSubmit = () => {
    const { form, onSubmit } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (onSubmit) {
        onSubmit(formData);
      }
    });
  };

  render() {
    const { form, editData } = this.props;
    const { getFieldDecorator } = form;
    const {
      watermarkText = '请勿外传',
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
    } = editData || {};
    return (
      <Form {...formItemLayout} layout="horizontal" onSubmit={this.onSubmit}>
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
        <FormItem label="旋转角度">
          {getFieldDecorator('rotate', {
            initialValue: rotate,
            rules: [
              {
                required: true,
                message: '旋转角度不能为空',
              },
            ],
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="字号">
          {getFieldDecorator('fontSize', {
            initialValue: fontSize,
            rules: [
              {
                required: true,
                message: '字号不能为空',
              },
            ],
          })(<InputNumber max={50} min={10} precision={0} />)}
        </FormItem>
        <FormItem label="宽度">
          {getFieldDecorator('width', {
            initialValue: width,
            rules: [
              {
                required: true,
                message: '宽度不能为空',
              },
            ],
          })(<InputNumber min={50} precision={0} />)}
        </FormItem>
        <FormItem label="高度">
          {getFieldDecorator('height', {
            initialValue: height,
            rules: [
              {
                required: true,
                message: '高度不能为空',
              },
            ],
          })(<InputNumber min={50} precision={0} />)}
        </FormItem>
        <FormItem label="颜色">
          {getFieldDecorator('color', {
            initialValue: color,
            rules: [
              {
                required: true,
                message: '颜色不能为空',
              },
            ],
          })(<ColorPicker />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button htmlType="submit">预览</Button>
          <Button type="primary" onClick={this.handleSave}>
            保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default WaterForm;
