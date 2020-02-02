import React, { PureComponent } from "react";
import { Form, Input, InputNumber, Tabs, Checkbox } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal } from 'seid'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

@Form.create()
class FormModal extends PureComponent {

  onFormSubmit = _ => {
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ? formatMessage({
        id: "global.edit",
        defaultMessage: "编辑"
      })
      : formatMessage({ id: "global.add", defaultMessage: "新建" });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <Tabs defaultActiveKey="1">
            <TabPane tab="通用" key="1">
              <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
                {getFieldDecorator("code", {
                  initialValue: rowData ? rowData.code : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
                {getFieldDecorator("name", {
                  initialValue: rowData ? rowData.name : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.shortName", defaultMessage: "简称" })}>
                {getFieldDecorator("shortName", {
                  initialValue: rowData ? rowData.shortName : "",
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.erpCode", defaultMessage: "ERP公司代码" })}>
                {getFieldDecorator("erpCode", {
                  initialValue: rowData ? rowData.erpCode : "",
                  rules: [{
                    required: true,
                    message: "ERP公司代码不能为空",
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.baseCurrencyCode", defaultMessage: "本位币货币代码" })}>
                {getFieldDecorator("baseCurrencyCode", {
                  initialValue: rowData ? rowData.baseCurrencyCode : "",
                  rules: [{
                    required: true,
                    message: "本位币货币代码不能为空",
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.baseCurrencyName", defaultMessage: "本位币货币名称" })}>
                {getFieldDecorator("baseCurrencyName", {
                  initialValue: rowData ? rowData.baseCurrencyName : "",
                  rules: [{
                    required: true,
                    message: "本位币货币名称不能为空",
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.defaultTradePartner", defaultMessage: "默认贸易伙伴代码" })}>
                {getFieldDecorator("defaultTradePartner", {
                  initialValue: rowData ? rowData.defaultTradePartner : "",
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.relatedTradePartner", defaultMessage: "关联交易贸易伙伴" })}>
                {getFieldDecorator("relatedTradePartner", {
                  initialValue: rowData ? rowData.relatedTradePartner : "",
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.rank", defaultMessage: "序号" })}>
                {getFieldDecorator("rank", {
                  initialValue: rowData ? rowData.rank : "",
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.rank.required", defaultMessage: "序号不能为空" })
                  }]
                })(<InputNumber precision={0} />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.frozen", defaultMessage: "冻结" })}>
                {getFieldDecorator("frozen", {
                  valuePropName: 'checked',
                  initialValue: rowData ? rowData.frozen : false,
                })(<Checkbox />)}
              </FormItem>
            </TabPane>
            <TabPane tab="微信" key="2">
              <FormItem label={formatMessage({ id: "corporation.weixinAppid", defaultMessage: "微信用户凭证" })}>
                {getFieldDecorator("weixinAppid", {
                  initialValue: rowData ? rowData.weixinAppid : "",
                })(<Input />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "corporation.weixinSecret", defaultMessage: "微信用户凭证密钥" })}>
                {getFieldDecorator("weixinSecret", {
                  initialValue: rowData ? rowData.weixinSecret : "",
                })(<Input />)}
              </FormItem>
            </TabPane>
          </Tabs>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
