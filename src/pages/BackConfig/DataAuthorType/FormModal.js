import React, { PureComponent } from 'react';
import { toUpper, trim } from 'lodash';
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
  handlerFormSubmit = () => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      params.code = toUpper(trim(params.code));
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? formatMessage({id: 'basic_000343', defaultMessage: '修改数据权限类型'}) : formatMessage({id: 'basic_000344', defaultMessage: '新建数据权限类型'});
    getFieldDecorator('authorizeEntityTypeId', {
      initialValue: rowData ? rowData.authorizeEntityTypeId : null,
    });
    const authorizeEntityTypeNameProps = {
      form,
      name: 'authorizeEntityTypeName',
      field: ['authorizeEntityTypeId'],
      searchPlaceHolder: formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'}),
      store: {
        url: `${SERVER_PATH}/sei-basic/authorizeEntityType/findAll`,
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={title}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('name', {
              initialValue: rowData ? rowData.name : '',
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
          <FormItem label={formatMessage({ id: 'global.code', defaultMessage: '代码' })}>
            {getFieldDecorator('code', {
              initialValue: rowData ? rowData.code : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.code.required',
                    defaultMessage: '代码不能为空',
                  }),
                },
              ],
            })(
              <Input
                placeholder={formatMessage({
                  id: 'global.code.tip',
                  defaultMessage: '规则:名称各汉字首字母大写',
                })}
              />,
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000341', defaultMessage: '权限对象类型'})}>
            {getFieldDecorator('authorizeEntityTypeName', {
              initialValue: rowData ? rowData.authorizeEntityTypeName : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000345', defaultMessage: '权限对象类型不能为空'}),
                },
              ],
            })(<ComboList {...authorizeEntityTypeNameProps} />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000342', defaultMessage: '功能码'})}>
            {getFieldDecorator('featureCode', {
              initialValue: rowData ? rowData.featureCode : null,
              rules: [
                {
                  max: 50,
                  message: formatMessage({id: 'basic_000346', defaultMessage: '功能码不能超过50个字符'}),
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
