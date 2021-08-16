import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { ExtModal, ComboTree, utils } from 'suid';
import { constants } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';

const { objectAssignHave } = utils;
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
class CopyModal extends PureComponent {
  static copyToOrgNode = null;

  onFormSubmit = () => {
    const { form, save } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        positionId: '',
        copyFeatureRole: false,
        targetOrgIds: [formData.orgId],
      };
      objectAssignHave(params, formData);
      save(params, this.copyToOrgNode);
    });
  };

  getComboGridProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'positionCategoryName',
      store: {
        autoLoad: false,
        url: `${SERVER_PATH}/sei-basic/positionCategory/findAllUnfrozen`,
      },
      field: ['positionCategoryId', 'positionCategoryCode'],
      columns: [
        {
          title: formatMessage({id: 'basic_000031', defaultMessage: '代码'}),
          width: 80,
          dataIndex: 'code',
        },
        {
          title: formatMessage({id: 'basic_000032', defaultMessage: '名称'}),
          width: 220,
          dataIndex: 'name',
        },
      ],
      searchProperties: ['code', 'name'],
      rowKey: 'id',
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
    };
  };

  getComboTreeProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'orgName',
      field: ['orgId'],
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
      },
      afterSelect: item => {
        this.copyToOrgNode = item;
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
  };

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      closeModal();
    }
  };

  render() {
    const { form, currentPosition, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.handlerCloseModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={formatMessage({id: 'basic_000202', defaultMessage: '复制岗位到指定组织机构'})}
        okText={formatMessage({id: 'basic_000034', defaultMessage: '保存'})}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({id: 'basic_000203', defaultMessage: '源岗位Id'})} style={{ display: 'none' }}>
            {getFieldDecorator('positionId', {
              initialValue: currentPosition ? currentPosition.id : '',
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000204', defaultMessage: '源岗位'})}>
            {getFieldDecorator('positionName', {
              initialValue: currentPosition ? currentPosition.name : '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000205', defaultMessage: '目标组织机构id'})} style={{ display: 'none' }}>
            {getFieldDecorator('orgId', {
              initialValue: '',
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000206', defaultMessage: '目标组织机构'})}>
            {getFieldDecorator('orgName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000207', defaultMessage: '目标组织机构不能为空'}),
                },
              ],
            })(<ComboTree {...this.getComboTreeProps()} />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000208', defaultMessage: '复制功能角色'})}>
            {getFieldDecorator('copyFeatureRole', {
              initialValue: false,
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default CopyModal;
