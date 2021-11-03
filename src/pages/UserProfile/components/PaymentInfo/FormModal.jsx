import React, { PureComponent } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, ComboGrid } from 'suid';
import { userUtils, constants } from '@/utils';

const { getCurrentUser } = userUtils;
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
    const { form, save, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData || {});
      Object.assign(params);
      Object.assign(params, formData);
      save(params);
    });
  };

  getComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      allowClear: true,
      remotePaging: true,
      name: 'bankName',
      field: ['bankId'],
      searchPlaceHolder: formatMessage({id: 'basic_000030', defaultMessage: '输入代码或名称关键字查询'}),
      searchProperties: ['name', 'code'],
      searchWidth: 220,
      width: 420,
      columns: [
        {
          title: formatMessage({id: 'basic_000031', defaultMessage: '代码'}),
          width: 180,
          dataIndex: 'code',
        },
        {
          title: formatMessage({id: 'basic_000032', defaultMessage: '名称'}),
          width: 220,
          dataIndex: 'name',
        },
        {
          title: formatMessage({id: 'basic_000033', defaultMessage: '银行类别'}),
          width: 180,
          dataIndex: 'bankCategoryName',
        },
      ],
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/dms/bank/findByPage`,
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const user = getCurrentUser();
    const { account: receiverCode, userId: receiverId, userName: receiverName } = user;
    const title = editData
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: formatMessage({id: 'basic_000020', defaultMessage: '编辑'}),
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText={formatMessage({id: 'basic_000034', defaultMessage: '保存'})}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({id: 'basic_000035', defaultMessage: '收款方类型'})} hidden>
            {getFieldDecorator('receiverType', {
              initialValue: 'H',
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000036', defaultMessage: '收款方Id'})} hidden>
            {getFieldDecorator('receiverId', {
              initialValue: editData ? editData.receiverId : receiverId,
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000037', defaultMessage: '收款方代码'})} hidden>
            {getFieldDecorator('receiverCode', {
              initialValue: editData ? editData.receiverCode : receiverCode,
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000022', defaultMessage: '收款方名称'})}>
            {getFieldDecorator('receiverName', {
              initialValue: editData ? editData.receiverName : receiverName,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000038', defaultMessage: '请输入收款方名称'}),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000023', defaultMessage: '银行开户名'})}>
            {getFieldDecorator('bankAccountName', {
              initialValue: editData ? editData.bankAccountName : receiverName,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000039', defaultMessage: '请输入银行开户名'}),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000040', defaultMessage: '银行id'})} hidden>
            {getFieldDecorator('bankId', {
              initialValue: editData ? editData.bankId : '',
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000041', defaultMessage: '银行'})}>
            {getFieldDecorator('bankName', {
              initialValue: editData ? editData.bankName : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000042', defaultMessage: '请输入银行'}),
                },
              ],
            })(<ComboGrid {...this.getComboGridProps()} />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000043', defaultMessage: '银行帐号'})}>
            {getFieldDecorator('bankAccountNumber', {
              initialValue: editData ? editData.bankAccountNumber : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000044', defaultMessage: '请输入银行帐号'}),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000027', defaultMessage: '排序'})}>
            {getFieldDecorator('rank', {
              initialValue: editData ? editData.rank : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000045', defaultMessage: '请输入排序'}),
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
