import React, { PureComponent } from 'react';
import cls from 'classnames';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './Form.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class TenantAdminForm extends PureComponent {
  onFormSubmit = () => {
    const { form, saveTenantAdmin, tenantData, tenantAdmin, handlerPopoverHide } = this.props;
    const { organizationDto, code } = tenantData;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const data = Object.assign(
        tenantAdmin || { organizationId: organizationDto.id },
        getFieldsValue(),
      );
      data.tenantCode = code;
      saveTenantAdmin(data, handlerPopoverHide);
    });
  };

  render() {
    const { form, tenantData, tenantAdmin, saving } = this.props;
    const { organizationDto } = tenantData;
    const { getFieldDecorator } = form;
    const title = tenantAdmin ? formatMessage({id: 'basic_000312', defaultMessage: '编辑租户管理员'}) : formatMessage({id: 'basic_000313', defaultMessage: '新建租户管理员'});
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <span className="title">{title}</span>
          </div>
          <Form {...formItemLayout}>
            <FormItem label={formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})}>
              {getFieldDecorator('tenantRootOrganizationName', {
                initialValue: organizationDto ? organizationDto.name : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'basic_000268', defaultMessage: '组织机构不能为空'}),
                  },
                ],
              })(<Input disabled addonBefore={organizationDto ? organizationDto.code : ''} />)}
            </FormItem>
            <FormItem label={formatMessage({id: 'basic_000059', defaultMessage: '员工编号'})}>
              {getFieldDecorator('code', {
                initialValue: tenantAdmin ? tenantAdmin.code : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'basic_000148', defaultMessage: '员工编号不能为空'}),
                  },
                ],
              })(<Input maxLength={10} />)}
            </FormItem>
            <FormItem label={formatMessage({id: 'basic_000314', defaultMessage: '用户名称'})}>
              {getFieldDecorator('userName', {
                initialValue: tenantAdmin ? tenantAdmin.userName : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'basic_000315', defaultMessage: '用户名称不能为空'}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({id: 'basic_000316', defaultMessage: '电子邮箱'})}>
              {getFieldDecorator('email', {
                initialValue: tenantAdmin ? tenantAdmin.email : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'basic_000317', defaultMessage: '电子邮箱不能为空'}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({id: 'basic_000318', defaultMessage: '手机号'})}>
              {getFieldDecorator('mobile', {
                initialValue: tenantAdmin ? tenantAdmin.mobile : '',
              })(<Input />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 4, offset: 5 }} className="btn-submit">
              <Button type="primary" loading={saving} onClick={this.onFormSubmit}>
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default TenantAdminForm;
