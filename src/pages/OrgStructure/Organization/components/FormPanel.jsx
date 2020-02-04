import React, { PureComponent } from "react";
import { Form, Input, Checkbox, InputNumber, Button, } from "antd";
import { formatMessage, FormattedMessage, } from "umi-plugin-react/locale";
import { ExtModal } from 'seid'
import { connect } from 'dva';

const FormItem = Form.Item;
const buttonWrapper = { span: 18, offset: 6 };

@connect(({ organization, loading, }) => ({ organization, loading, }))
@Form.create()
class FormModal extends PureComponent {

  componentDidMount() {
    const { onRef } = this.props;
    if(onRef) {
      onRef(this);
    }
  }

  onFormSubmit = _ => {
    const { form, organization, isCreate } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      let params = {};
      const selectedTreeNode = organization.selectedTreeNode || {};
      if (isCreate) {
        Object.assign(params, { parentId: selectedTreeNode.id });
      } else {
        Object.assign(params, selectedTreeNode);
      }
      Object.assign(params, formData);
      this.save(params);
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "organization/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "organization/queryTree",
        });
      }
    });
  };

  render() {
    const { form, showModal, organization, isCreate } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: isCreate ? 18 : 10,
      }
    };
    let tempSelectedNode = organization.selectedTreeNode || {};
    if (isCreate) {
      tempSelectedNode = { parentName: tempSelectedNode.name };
    }
    const { code='', parentName='', name='', shortName='', rank='', frozen=false} = tempSelectedNode;

    return (
      <Form {...formItemLayout} layout="horizontal">
        {!isCreate ? (
          <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
            {getFieldDecorator("code", {
              initialValue: code,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
              }]
            })(<Input  disabled={true} />)}
          </FormItem>
        ) : (
          <FormItem label="父亲节点">
            {getFieldDecorator("parentName", {
              initialValue: parentName,
            })(<Input  disabled={true} />)}
          </FormItem>
        )}
        <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
          {getFieldDecorator("name", {
            initialValue: name,
            rules: [{
              required: true,
              message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
            }]
          })(<Input />)}
        </FormItem>
        <FormItem label="简称">
          {getFieldDecorator("shortName", {
            initialValue: shortName,
          })(<Input />)}
        </FormItem>
        <FormItem label="排序">
          {getFieldDecorator("rank", {
            initialValue: rank,
            rules: [{
              required: true,
              message: formatMessage({ id: "global.rank.required", defaultMessage: "序号不能为空" })
            }]
          })(<InputNumber style={{ width: '100%', }} precision={0} />)}
        </FormItem>
        <FormItem label="冻结">
          {getFieldDecorator("frozen", {
            valuePropName: 'checked',
            initialValue: frozen,
          })(<Checkbox />)}
        </FormItem>
        {!isCreate ? (
          <FormItem wrapperCol={buttonWrapper}>
            <Button
              type="primary"
              onClick={this.onFormSubmit}
            >
              <FormattedMessage id="global.ok" defaultMessage="确定" />
            </Button>
          </FormItem>
        ) : (null)
        }
      </Form>
    );
  }
}

export default FormModal;
