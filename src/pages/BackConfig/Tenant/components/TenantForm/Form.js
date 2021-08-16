import React, { PureComponent } from 'react';
import cls from 'classnames';
import { omit } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Switch } from 'antd';
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
class TenantForm extends PureComponent {
  handlerFormSubmit = () => {
    const {
      form,
      saveTenant,
      tenantData: originTenantData,
      tenantRootOrganization: originTenantRootOrganization,
      handlerPopoverHide,
    } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) {
        return;
      }
      const formData = getFieldsValue();
      const tenantData = omit(Object.assign(originTenantData || {}, formData), [
        'tenantRootOrganizationName',
      ]);
      const tenantRootOrganization = {
        ...(originTenantRootOrganization || {}),
        name: formData.tenantRootOrganizationName,
      };
      if (!originTenantRootOrganization) {
        Object.assign(tenantRootOrganization, {
          tenantCode: formData.code,
          code: formData.code,
        });
      }
      saveTenant({ tenantData, tenantRootOrganization }, handlerPopoverHide);
    });
  };

  render() {
    const { form, tenantData, tenantRootOrganization, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = tenantData ? formatMessage({id: 'basic_000263', defaultMessage: '编辑租户'}) : formatMessage({id: 'basic_000264', defaultMessage: '新建租户'});
    const codeProps = {
      maxLength: 10,
      placeholder: formatMessage({id: 'basic_000265', defaultMessage: '租户代码一旦创建不能修改'}),
    };
    if (tenantData && tenantData.id) {
      codeProps.disabled = true;
    }
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <span className="title">{title}</span>
          </div>
          <Form {...formItemLayout}>
            <FormItem label={formatMessage({id: 'basic_000266', defaultMessage: '租户代码'})}>
              {getFieldDecorator('code', {
                initialValue: tenantData ? tenantData.code : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'global.code.required',
                      defaultMessage: '代码不能为空',
                    }),
                  },
                ],
              })(<Input {...codeProps} />)}
            </FormItem>
            <FormItem label={formatMessage({id: 'basic_000267', defaultMessage: '租户名称'})}>
              {getFieldDecorator('name', {
                initialValue: tenantData ? tenantData.name : '',
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
            <FormItem label={formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})}>
              {getFieldDecorator('tenantRootOrganizationName', {
                initialValue: tenantRootOrganization ? tenantRootOrganization.name : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'basic_000268', defaultMessage: '组织机构不能为空'}),
                  },
                ],
              })(<Input addonBefore={tenantRootOrganization ? tenantRootOrganization.code : ''} />)}
            </FormItem>
            {tenantData && tenantData.id ? (
              <FormItem label={formatMessage({id: 'basic_000140', defaultMessage: '冻结'})}>
                {getFieldDecorator('frozen', {
                  initialValue: tenantData ? tenantData.frozen || false : false,
                  valuePropName: 'checked',
                })(<Switch size="small" />)}
              </FormItem>
            ) : null}
            <FormItem wrapperCol={{ span: 4, offset: 5 }} className="btn-submit">
              <Button type="primary" loading={saving} onClick={this.handlerFormSubmit}>
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default TenantForm;
