import React, { PureComponent, Fragment } from "react";
import { Form, Input, Checkbox, InputNumber, Button, } from "antd";
import { formatMessage, FormattedMessage, } from "umi-plugin-react/locale";
import { ExtModal, ComboGrid, ScrollBar, } from 'seid';
import { utils } from 'seid';
import { isEqual, } from 'lodash';
import { connect } from 'dva';
import { constants } from '@/utils';

const { objectAssignHave } = utils;
const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const buttonWrapper = { span: 18, offset: 6 };

@connect(({ professionalDomain, loading, }) => ({ professionalDomain, loading, }))
@Form.create()
class FormModal extends PureComponent {

  componentDidMount() {
    const { onRef } = this.props;
    if(onRef) {
      onRef(this);
    }
  }

  componentDidUpdate(_prevProps) {
    const { form, professionalDomain, } = this.props;
    const { selectedTreeNode } = _prevProps.professionalDomain;
    if (!isEqual(selectedTreeNode, professionalDomain.selectedTreeNode)) {
      form.setFieldsValue(this.getInitialValueObj());
    }
  }

  onFormSubmit = _ => {
    const { form, } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      this.save(formData);
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: "professionalDomain/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "professionalDomain/queryTree",
        });
      }
    });
  };

  getInitialValueObj = () => {
    const { formType, professionalDomain, } = this.props;
    const { selectedTreeNode, } = professionalDomain;
    let initialValueObj = { id: null, code: '', name: '', parentId: '', rank: 0, parentName: '',};
    if (formType === 'addRootNode') {
      initialValueObj = objectAssignHave(initialValueObj, {});
    } else if(formType === 'addChildNode') {
      initialValueObj = objectAssignHave(initialValueObj, { parentId: selectedTreeNode.id, parentName: selectedTreeNode.name });
    } else {
      initialValueObj = objectAssignHave(initialValueObj, selectedTreeNode || {});
    }

    return initialValueObj;
  }

  render() {
    const { form, professionalDomain, formType } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: formType ? 18 : 10,
      }
    };

    const { id, parentId, parentName, rank=0, name, code, } = this.getInitialValueObj();

    return (
      <ScrollBar>
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="父节点" style={{ display: formType === 'addChildNode' ? '' : 'none' }}>
            {getFieldDecorator("parentName", {
              initialValue: parentName,
            })(<Input disabled={true}/>)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
            {getFieldDecorator("code", {
              initialValue: code,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
              }]
            })(<Input/>)}
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
          <FormItem label="排序">
            {getFieldDecorator("rank", {
              initialValue: rank,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.rank.required", defaultMessage: "序号不能为空" })
              }]
            })(<InputNumber style={{ width: '100%', }} precision={0} />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator("parentId", {
              initialValue: parentId,
            })(<Input />)}
          </FormItem>
          {!formType ? (
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
      </ScrollBar>
    );
  }
}

export default FormModal;
