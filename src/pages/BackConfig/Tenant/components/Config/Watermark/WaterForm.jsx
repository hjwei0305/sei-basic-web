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
      watermarkText ={formatMessage({id: 'basic_000292', defaultMessage: '请勿外传'})},
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
        <FormItem label={formatMessage({id: 'basic_000276', defaultMessage: '文案'})}>
          {getFieldDecorator('watermarkText', {
            initialValue: watermarkText,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'basic_000277', defaultMessage: '文案不能为空'}),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={formatMessage({id: 'basic_000280', defaultMessage: '旋转角度'})}>
          {getFieldDecorator('rotate', {
            initialValue: rotate,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'basic_000281', defaultMessage: '旋转角度不能为空'}),
              },
            ],
          })(<InputNumber />)}
        </FormItem>
        <FormItem label={formatMessage({id: 'basic_000278', defaultMessage: '字号'})}>
          {getFieldDecorator('fontSize', {
            initialValue: fontSize,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'basic_000279', defaultMessage: '字号不能为空'}),
              },
            ],
          })(<InputNumber max={50} min={10} precision={0} />)}
        </FormItem>
        <FormItem label={formatMessage({id: 'basic_000282', defaultMessage: '宽度'})}>
          {getFieldDecorator('width', {
            initialValue: width,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'basic_000283', defaultMessage: '宽度不能为空'}),
              },
            ],
          })(<InputNumber min={50} precision={0} />)}
        </FormItem>
        <FormItem label={formatMessage({id: 'basic_000284', defaultMessage: '高度'})}>
          {getFieldDecorator('height', {
            initialValue: height,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'basic_000285', defaultMessage: '高度不能为空'}),
              },
            ],
          })(<InputNumber min={50} precision={0} />)}
        </FormItem>
        <FormItem label={formatMessage({id: 'basic_000286', defaultMessage: '颜色'})}>
          {getFieldDecorator('color', {
            initialValue: color,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'basic_000287', defaultMessage: '颜色不能为空'}),
              },
            ],
          })(<ColorPicker />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button htmlType="submit">{formatMessage({id: 'basic_000290', defaultMessage: '预览'})}</Button>
          <Button type="primary" onClick={this.handleSave}>
            {formatMessage({id: 'basic_000034', defaultMessage: '保存'})}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default WaterForm;
