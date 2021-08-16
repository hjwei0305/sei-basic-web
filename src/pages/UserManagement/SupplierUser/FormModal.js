import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal } from 'suid';

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
class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { form, save, currentSupplier } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, currentSupplier || {});
      Object.assign(params);
      Object.assign(params, formData);
      save(params);
    });
  };

  handlerCloseModal = () => {
    const { closeFormModal } = this.props;
    if (closeFormModal) {
      closeFormModal();
    }
  };

  render() {
    const { form, currentSupplier, saving, showFormModal } = this.props;
    const { getFieldDecorator } = form;
    const title = currentSupplier
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: formatMessage({id: 'basic_000020', defaultMessage: '编辑'}),
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.handlerCloseModal}
        visible={showFormModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="帐号">
            {getFieldDecorator('code', {
              initialValue: get(currentSupplier, 'code'),
              rules: [
                {
                  required: true,
                  message: '帐号不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('name', {
              initialValue: get(currentSupplier, 'name'),
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.name.required',
                    defaultMessage: '名称不能为空',
                  }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              initialValue: get(currentSupplier, 'frozen', false),
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
