import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Form, Input, Checkbox } from 'antd';
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
  onFormSubmit = (_) => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params);
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal, parentData } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ? formatMessage({
        id: 'global.edit',
        defaultMessage: '编辑',
      })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });

    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText="保存"
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="组织机构">
            {getFieldDecorator('organizationName', {
              initialValue: get(rowData, 'organizationName', parentData && parentData.name),
            })(<Input disabled={!!parentData} />)}
          </FormItem>
          <FormItem label="员工编号">
            {getFieldDecorator('code', {
              initialValue: rowData ? rowData.code : '',
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
            })(<Input disabled={!!rowData} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('userName', {
              initialValue: rowData ? rowData.userName : '',
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
          {rowData ? (
            <FormItem label="冻结">
              {getFieldDecorator('frozen', {
                initialValue: rowData ? rowData.frozen : false,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </FormItem>
          ) : null}
          {/* 以下为隐藏的formItem */}
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('organizationId', {
              initialValue: get(rowData, 'organizationId', parentData && parentData.id),
            })(<Input />)}
          </FormItem>
          {/*          <FormItem
            style={{display: "none"}}>
            {getFieldDecorator('organizationCode', {
              initialValue: parentData && parentData.code,
            })(<Input />)}
          </FormItem> */}
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
