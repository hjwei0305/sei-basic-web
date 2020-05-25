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
    const { form, save, currentEmployee, currentOrgNode } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        organizationId: currentOrgNode.id,
        organizationCode: currentOrgNode.code,
      };
      Object.assign(params, currentEmployee || {});
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
    const { form, currentEmployee, saving, showFormModal, currentOrgNode } = this.props;
    const { getFieldDecorator } = form;
    const title = currentEmployee
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: '编辑',
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
          <FormItem label="组织机构">
            {getFieldDecorator('organizationName', {
              initialValue: currentOrgNode && currentOrgNode.name,
            })(<Input disabled={!!currentOrgNode} />)}
          </FormItem>
          <FormItem label="员工编号">
            {getFieldDecorator('code', {
              initialValue: get(currentEmployee, 'code', null),
              rules: [
                {
                  required: true,
                  message: '员工编号不能为空',
                },
                {
                  pattern: '^[A-Za-z0-9]{1,10}$',
                  message: '允许输入字母和数字,且不超过10个字符!',
                },
              ],
            })(<Input disabled={!!currentEmployee} />)}
          </FormItem>
          <FormItem label="员工姓名">
            {getFieldDecorator('userName', {
              initialValue: get(currentEmployee, 'userName', null),
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.name.required',
                    defaultMessage: '员工姓名不能为空',
                  }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="冻结">
            {getFieldDecorator('frozen', {
              initialValue: get(currentEmployee, 'frozen', false),
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
