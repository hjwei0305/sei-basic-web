import React, { Component } from 'react';
import { omit } from 'lodash';
import { ExtModal, ScopeDatePicker } from 'suid';
import { Input, Form } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class CfgModal extends Component {
  checkRange = (_, effectiveRange, callback) => {
    if ((effectiveRange[0] && effectiveRange[1]) || (!effectiveRange[0] && !effectiveRange[1])) {
      callback();
    } else {
      callback('开始日期和结束日期，必须同时有值或者同时没有值');
    }
  };

  handleOk = () => {
    const { form, onSave } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      const { effectiveRange } = formData;
      let effectiveFrom = null;
      let effectiveTo = null;
      if (effectiveRange && effectiveRange.length) {
        // effectiveFrom = effectiveRange[0];
        // effectiveTo = effectiveRange[1];
        [effectiveFrom, effectiveTo] = effectiveRange;
      }
      Object.assign(params, omit(formData, ['effectiveRange']), { effectiveFrom, effectiveTo });
      onSave(params);
    });
  };

  render() {
    const { visible, saving, form, onCancel, editData } = this.props;
    const { getFieldDecorator } = form;
    const { effectiveFrom, effectiveTo, relationId } = editData || {};
    const tempEffectiveFrom = effectiveFrom
      ? moment(effectiveFrom).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');
    const tempEffectiveTo = effectiveTo
      ? moment(effectiveTo).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');
    return (
      <ExtModal
        title="配置有效期"
        visible={visible}
        confirmLoading={!!saving}
        onOk={this.handleOk}
        onCancel={onCancel}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="有效期">
            {getFieldDecorator('effectiveRange', {
              initialValue: [tempEffectiveFrom, tempEffectiveTo],
              rules: [{ validator: this.checkRange }],
            })(<ScopeDatePicker />)}
          </FormItem>
          {/* 以下为隐藏的formItem */}
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id', {
              initialValue: relationId,
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default CfgModal;
