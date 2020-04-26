import React, { PureComponent } from 'react';
import cls from 'classnames';
import { toUpper, trim } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input } from 'antd';
import { utils } from 'suid';
import { userUtils } from '@/utils';
import styles from './Form.less';

const { objectAssignAppend } = utils;
const { getCurrentUser } = userUtils;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

@Form.create()
class RoleGroupForm extends PureComponent {
  constructor(props) {
    super(props);
    const user = getCurrentUser();
    const { tenantCode = '' } = user || {};
    this.state = {
      tenantCode: toUpper(tenantCode),
    };
  }

  handlerFormSubmit = (_) => {
    const { tenantCode } = this.state;
    const { form, saveRoleGroup, groupData, handlerPopoverHide } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = objectAssignAppend(getFieldsValue(), groupData || {});
      data.code = `${tenantCode}-${toUpper(trim(data.code))}`;
      saveRoleGroup(data, handlerPopoverHide);
    });
  };

  getCode = () => {
    const { tenantCode } = this.state;
    const { groupData } = this.props;
    let newCode = '';
    if (groupData) {
      const { code } = groupData;
      newCode = code.substring(tenantCode.length + 1);
    }
    return newCode;
  };

  render() {
    const { tenantCode } = this.state;
    const { form, groupData, saving } = this.props;
    const { getFieldDecorator } = form;
    const title = groupData ? '编辑角色组' : '新建角色组';
    return (
      <div key="form-box" className={cls(styles['form-box'])}>
        <div className="base-view-body">
          <div className="header">
            <span className="title">
              {title}
            </span>
          </div>
          <Form {...formItemLayout}>
            <FormItem label="代码">
              {getFieldDecorator('code', {
                initialValue: this.getCode(),
                rules: [{
                  required: true,
                  message: formatMessage({ id: 'global.code.required', defaultMessage: '代码不能为空' }),
                }],
              })(
                <Input
                  disabled={!!groupData}
                  addonBefore={`${tenantCode}-`}
                  maxLength={20 - `${tenantCode}-`.length}
                  placeholder={formatMessage({ id: 'global.code.tip', defaultMessage: '规则:名称各汉字首字母大写' })}
                />,
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
              {getFieldDecorator('name', {
                initialValue: groupData ? groupData.name : '',
                rules: [{
                  required: true,
                  message: formatMessage({ id: 'global.name.required', defaultMessage: '名称不能为空' }),
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 4, offset: 4 }} className="btn-submit">
              <Button
                type="primary"
                loading={saving}
                onClick={this.handlerFormSubmit}
              >
                <FormattedMessage id="global.save" defaultMessage="保存" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default RoleGroupForm;
