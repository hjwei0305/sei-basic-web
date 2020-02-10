import React, { PureComponent } from "react";
import { Form, Input, Checkbox, } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal, ComboGrid, ScrollBar, } from 'seid';
import { constants } from "@/utils";

const { SERVER_PATH, } = constants;
const FormItem = Form.Item;

@Form.create()
class FormModal extends PureComponent {

  onFormSubmit = _ => {
    const { form, save } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      Object.assign(params, formData);
      save(params);
    });
  };

  getComboGridProps = () => {
    const { form, } = this.props;
    return {
      form,
      name: 'tenantCode',
      store: {
        autoLoad: false,
        url: `${SERVER_PATH}/sei-basic/tenant/findAllUnfrozen`,
      },
      field: ['tenantCode'],
      columns: [
        {
          title: '代码',
          width: 100,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 200,
          dataIndex: 'name',
        },
      ],
      searchProperties: ['code', 'name'],
      rowKey: "id",
      reader: {
        name: 'name',
        field: ['code',],
      },
    };
  }

  render() {
    const { form, saving, visible, onCancel, rowData, dictType, } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18,
      }
    };
    const title = rowData ? '编辑' : formatMessage({ id: "global.add", defaultMessage: "新建" });
    const { id, code='', name='', tenantCode, valueName,rank, value, remark, frozen=false, } = rowData || {};

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={() => {this.onFormSubmit()}}
        width={500}
        okText="保存"
      >
        <div style={{
          height: 400,
        }}>
          <ScrollBar>

            <Form style={{ padding: '0 10px',}} {...formItemLayout} layout="horizontal">
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator("id", {
                  initialValue: id,
                })(<Input />)}
              </FormItem>
              <FormItem label="数据字典类型" style={{ display: 'none' }}>
                {getFieldDecorator("categoryCode", {
                  initialValue: dictType && dictType.code,
                })(<Input />)}
              </FormItem>
              <FormItem label="租户">
                {getFieldDecorator("tenantCode", {
                  initialValue: tenantCode,
                })(<ComboGrid {...this.getComboGridProps()} />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
                {getFieldDecorator("code", {
                  initialValue: code,
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
                  }]
                })(<Input  disabled={!!rowData} />)}
              </FormItem>
              <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
                {getFieldDecorator("name", {
                  initialValue: name,
                  rules: [{
                    required: true,
                    message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label="值">
                {getFieldDecorator("value", {
                  initialValue: value,
                  rules: [{
                    required: true,
                    message: "值不能为空",
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label="值描述">
                {getFieldDecorator("valueName", {
                  initialValue: valueName,
                  rules: [{
                    required: true,
                    message: "值描述不能为空"
                  }]
                })(<Input />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator("remark", {
                  initialValue: remark,
                })(<Input />)}
              </FormItem>
              <FormItem label="排序">
                {getFieldDecorator("rank", {
                  initialValue: rank,
                })(<Input />)}
              </FormItem>
              <FormItem label="冻结">
                {getFieldDecorator("frozen", {
                  valuePropName: 'checked',
                  initialValue: frozen,
                })(<Checkbox />)}
              </FormItem>
            </Form>
          </ScrollBar>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
