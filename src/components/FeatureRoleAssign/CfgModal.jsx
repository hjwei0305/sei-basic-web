import React, { Component } from 'react';
import { ExtModal, } from 'suid';
import { DatePicker, Input, } from 'antd';
import { Form, } from 'antd';
import moment from 'moment';

const { RangePicker,} = DatePicker;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};


@Form.create()
class CfgModal extends Component {

  handleOk = () => {
    const { form, onSave, } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      const { effectiveRange, } = formData;
      let effectiveFrom = null;
      let effectiveTo = null;
      if (effectiveRange && effectiveRange.length) {
        effectiveFrom = effectiveRange[0].format('YYYY-MM-DD');
        effectiveTo = effectiveRange[1].format('YYYY-MM-DD');
      }
      
      delete formData.effectiveRange;
      Object.assign(params, formData, { effectiveFrom, effectiveTo, });
      onSave(params);
    });
  }

  render() {
    const { visible, saving, form, onCancel, editData, } = this.props;
    const { getFieldDecorator, } = form;
    const { effectiveFrom, effectiveTo, relationId } = editData || {};
    const tempEffectiveFrom = effectiveFrom ? moment(effectiveFrom) : moment();
    const tempEffectiveTo = effectiveTo ? moment(effectiveTo) : moment();
    return (
      <ExtModal
        title="配置有效期"
        visible={visible}
        confirmLoading={!!saving}
        onOk={this.handleOk}
        onCancel={onCancel}
      >
         <Form {...formItemLayout} layout="horizontal" >
          <FormItem label="有效期">
            {getFieldDecorator("effectiveRange", {
              initialValue: [tempEffectiveFrom, tempEffectiveTo],
            })(<RangePicker format="YYYY-MM-DD" />)}
          </FormItem>
          {/*以下为隐藏的formItem*/}
          <FormItem
            style={{display: "none"}}>
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