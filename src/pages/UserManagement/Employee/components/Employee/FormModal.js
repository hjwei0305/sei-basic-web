import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, ComboTree } from 'suid';

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
    const { form, currentEmployee, saving, showFormModal, currentOrgNode, orgData } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('organizationId', {
      initialValue: get(
        currentEmployee,
        'organizationId',
        currentOrgNode ? currentOrgNode.id : null,
      ),
    });
    getFieldDecorator('organizationCode', {
      initialValue: get(
        currentEmployee,
        'organizationId',
        currentOrgNode ? currentOrgNode.code : null,
      ),
    });
    const title = currentEmployee
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: '编辑',
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    const comboTreeProps = {
      form,
      name: 'organizationName',
      field: ['organizationId', 'organizationCode'],
      dataSource: orgData,
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
    };
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
              initialValue: get(
                currentEmployee,
                'organizationName',
                currentOrgNode ? currentOrgNode.name : null,
              ),
            })(<ComboTree {...comboTreeProps} />)}
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
                  pattern: '^[A-Za-z0-9]{1,20}$',
                  message: '允许输入字母和数字,且不超过20个字符!',
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
