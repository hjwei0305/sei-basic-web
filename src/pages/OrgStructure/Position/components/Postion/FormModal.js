import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, ComboList } from 'suid';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;

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
    const { form, save, currentPosition, currentOrgNode } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        organizationId: currentOrgNode.id,
        organizationCode: currentOrgNode.code,
      };
      Object.assign(params, currentPosition || {});
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
    const { form, currentPosition, saving, showFormModal, currentOrgNode } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator('positionCategoryCode', {
      initialValue: currentPosition ? currentPosition.positionCategoryCode : '',
    });
    getFieldDecorator('positionCategoryId', {
      initialValue: currentPosition ? currentPosition.positionCategoryId : '',
    });
    const title = currentPosition
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: '编辑',
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    const comboListProps = {
      form,
      name: 'positionCategoryName',
      store: {
        url: `${SERVER_PATH}/sei-basic/positionCategory/findAllUnfrozen`,
      },
      field: ['positionCategoryId', 'positionCategoryCode'],
      reader: {
        name: 'name',
        field: ['id', 'code'],
        description: 'code',
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
              initialValue: currentOrgNode && currentOrgNode.name,
            })(<Input disabled={!!currentOrgNode} />)}
          </FormItem>
          <FormItem label="岗位类别">
            {getFieldDecorator('positionCategoryName', {
              initialValue: currentPosition ? currentPosition.positionCategoryName : '',
              rules: [
                {
                  required: true,
                  message: '岗位类别不能为空',
                },
              ],
            })(<ComboList {...comboListProps} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('name', {
              initialValue: currentPosition ? currentPosition.name : '',
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
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
