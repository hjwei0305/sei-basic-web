import React, { PureComponent } from "react";
import { toUpper, trim } from 'lodash'
import { Button, Form, Input, Tag } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ExtModal, ComboList, ComboGrid } from 'seid';
import { constants } from "@/utils";

const { SERVER_PATH, FEATURE_TYPE } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const buttonWrapper = { span: 18, offset: 6 };

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
      params.code = toUpper(trim(params.code));
      save(params);
    });
  };

  renderFeatureType = (row) => {
    switch (row.featureType) {
      case FEATURE_TYPE.PAGE:
        return <Tag color='cyan'>菜单项</Tag>;
      case FEATURE_TYPE.OPERATE:
        return <Tag color='blue'>操作项</Tag>;
      default:
    }
  };


  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData ? '修改数据权限类型' : '新建数据权限类型';
    getFieldDecorator("authorizeEntityTypeId", { initialValue: rowData ? rowData.authorizeEntityTypeId : "" });
    getFieldDecorator("featureId", { initialValue: rowData ? rowData.featureId : "" });
    const authorizeEntityTypeNameProps = {
      form,
      name: 'authorizeEntityTypeName',
      field: ['authorizeEntityTypeId'],
      searchPlaceHolder: "输入名称关键字查询",
      store: {
        url: `${SERVER_PATH}/sei-basic/authorizeEntityType/findAll`
      },
      reader: {
        name: 'name',
        field: ['id']
      }
    };
    const featureNameProps = {
      form,
      remotePaging: true,
      name: 'featureName',
      field: ['featureId'],
      searchPlaceHolder: "输入关键字查询",
      searchProperties: ["name", "code"],
      allowClear: true,
      width: 520,
      columns: [{
        title: "名称",
        width: 220,
        dataIndex: "name",
      }, {
        title: '类别',
        dataIndex: "featureType",
        width: 80,
        required: true,
        align: 'center',
        render: (_text, record) => this.renderFeatureType(record),
      }, {
        title: "代码",
        width: 180,
        dataIndex: "code",
      }, {
        title: "所属应用模块",
        width: 180,
        dataIndex: 'appModuleName'
      }],
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/feature/findByPage`,
      },
      reader: {
        name: "name",
        field: ["id"]
      }
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        footer={null}
        title={title}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: rowData ? rowData.name : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<Input />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
            {getFieldDecorator("code", {
              initialValue: rowData ? rowData.code : "",
              rules: [{
                required: true,
                message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
              }]
            })(<Input
              placeholder={formatMessage({ id: "global.code.tip", defaultMessage: "规则:名称各汉字首字母大写" })}
            />)}
          </FormItem>
          <FormItem label="权限对象类型">
            {getFieldDecorator("authorizeEntityTypeName", {
              initialValue: rowData ? rowData.authorizeEntityTypeName : "",
              rules: [{
                required: true,
                message: '权限对象类型不能为空'
              }]
            })(
              <ComboList {...authorizeEntityTypeNameProps} />
            )}
          </FormItem>
          <FormItem label="功能项">
            {getFieldDecorator("featureName", {
              initialValue: rowData ? rowData.featureName : "",
            })(
              <ComboGrid {...featureNameProps} />
            )}
          </FormItem>
          <FormItem wrapperCol={buttonWrapper} className="btn-submit">
            <Button
              type="primary"
              loading={saving}
              onClick={this.onFormSubmit}
            >
              <FormattedMessage id="global.ok" defaultMessage="确定" />
            </Button>
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
