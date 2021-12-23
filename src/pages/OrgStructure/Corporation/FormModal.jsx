import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, InputNumber, Checkbox } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, ComboTree, ComboList } from 'suid';
import { get } from 'lodash';
import { constants } from '@/utils';

const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const colFormItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData, { code: formData.erpCode });
      save(params);
    });
  };

  getComboTreeProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'organizationName',
      field: ['organizationId'],
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
  };

  getCurrencyListProps = () => {
    const { form } = this.props;
    return {
      form,
      searchPlaceHolder: '请输入代码或名称搜索',
      remotePaging: true,
      name: 'baseCurrencyName',
      store: {
        type: 'POST',
        autoLoad: false,
        url: `${SERVER_PATH}/dms/currency/findByPage`,
      },
      rowKey: 'id',
      reader: {
        name: 'name',
        field: ['code'],
      },
      field: ['baseCurrencyCode'],
    };
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: formatMessage({id: 'basic_000020', defaultMessage: '编辑'}),
        })
      : formatMessage({ id: 'global.add', defaultMessage: formatMessage({id: 'basic_000028', defaultMessage: '新建'}) });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        title={title}
        width={750}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem
            label={formatMessage({ id: 'corporation.erpCode', defaultMessage: 'ERP公司代码' })}
          >
            {getFieldDecorator('erpCode', {
              initialValue: rowData ? rowData.erpCode : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'corporation.erpCode.required',
                    defaultMessage: 'ERP公司代码不能为空',
                  }),
                },
              ],
            })(<Input disabled={rowData} />)}
          </FormItem>
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
          <FormItem label={formatMessage({id: 'basic_000235', defaultMessage: '组织机构id'})} hidden>
            {getFieldDecorator('organizationId', {
              initialValue: get(rowData, 'organizationId', undefined),
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})}>
            {getFieldDecorator('organizationName', {
              initialValue: get(rowData, 'organization.name', ''),
            })(<ComboTree allowClear {...this.getComboTreeProps()} />)}
          </FormItem>
          <FormItem
            label={formatMessage({
              id: 'corporation.baseCurrencyName',
              defaultMessage: '本位币货币名称',
            })}
          >
            {getFieldDecorator('baseCurrencyName', {
              initialValue: get(rowData, 'baseCurrencyName', ''),

              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000237', defaultMessage: '本位币货币名称不能为空'}),
                },
              ],
            })(<ComboList {...this.getCurrencyListProps()} />)}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({ id: 'corporation.shortName', defaultMessage: '简称' })}
              >
                {getFieldDecorator('shortName', {
                  initialValue: rowData ? rowData.shortName : '',
                })(<Input />)}
              </FormItem>
            </Col>
            {/* <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({
                  id: 'corporation.baseCurrencyCode',
                  defaultMessage: '本位币货币代码',
                })}
              >
                {getFieldDecorator('baseCurrencyCode', {
                  initialValue: rowData ? rowData.baseCurrencyCode : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({id: 'basic_000236', defaultMessage: '本位币货币代码不能为空'}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({
                  id: 'corporation.baseCurrencyName',
                  defaultMessage: '本位币货币名称',
                })}
              >
                {getFieldDecorator('baseCurrencyName', {
                  initialValue: rowData ? rowData.baseCurrencyName : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({id: 'basic_000237', defaultMessage: '本位币货币名称不能为空'}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col> */}
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({
                  id: 'corporation.defaultTradePartner',
                  defaultMessage: '默认贸易伙伴代码',
                })}
              >
                {getFieldDecorator('defaultTradePartner', {
                  initialValue: rowData ? rowData.defaultTradePartner : '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({
                  id: 'corporation.relatedTradePartner',
                  defaultMessage: '关联交易贸易伙伴',
                })}
              >
                {getFieldDecorator('relatedTradePartner', {
                  initialValue: rowData ? rowData.relatedTradePartner : '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({
                  id: 'corporation.internalSupplier',
                  defaultMessage: '内部供应商代码',
                })}
              >
                {getFieldDecorator('internalSupplier', {
                  initialValue: rowData ? rowData.internalSupplier : '',
                  rules: [
                    {
                      max: 20,
                      message: formatMessage({id: 'basic_000238', defaultMessage: '内部供应商代码不能超过20个字符'}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({ id: 'global.rank', defaultMessage: '序号' })}
              >
                {getFieldDecorator('rank', {
                  initialValue: rowData ? rowData.rank : '',
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'global.rank.required',
                        defaultMessage: '序号不能为空',
                      }),
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} precision={0} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({
                  id: 'corporation.weixinAppid',
                  defaultMessage: '微信用户凭证',
                })}
              >
                {getFieldDecorator('weixinAppid', {
                  initialValue: rowData ? rowData.weixinAppid : '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({
                  id: 'corporation.weixinSecret',
                  defaultMessage: '微信用户凭证密钥',
                })}
              >
                {getFieldDecorator('weixinSecret', {
                  initialValue: rowData ? rowData.weixinSecret : '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...colFormItemLayout}
                label={formatMessage({ id: 'corporation.frozen', defaultMessage: '冻结' })}
              >
                {getFieldDecorator('frozen', {
                  valuePropName: 'checked',
                  initialValue: rowData ? rowData.frozen : false,
                })(<Checkbox />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
