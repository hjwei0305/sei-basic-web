import React, { PureComponent, Fragment } from "react";
import { Form, Input, InputNumber, Button, } from "antd";
import { formatMessage, FormattedMessage, } from "umi-plugin-react/locale";
import { ComboGrid, ScrollBar, } from 'seid';
import { utils } from 'seid';
import { isEqual, } from 'lodash';
import { connect } from 'dva';
import { constants } from '@/utils';

const { objectAssignHave } = utils;
const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const buttonWrapper = { span: 18, offset: 6 };

@connect(({ region, loading, }) => ({ region, loading, }))
@Form.create()
class FormModal extends PureComponent {

  componentDidMount() {
    const { onRef } = this.props;
    if(onRef) {
      onRef(this);
    }
  }

  componentDidUpdate(_prevProps) {
    const { form, region, } = this.props;
    const { selectedTreeNode } = _prevProps.region;
    if (!isEqual(selectedTreeNode, region.selectedTreeNode)) {
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
      type: "region/save",
      payload: {
        ...data
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: "region/queryTree",
        });
      }
    });
  };

  getComboGridProps = () => {
    const { form, } = this.props;
    return {
      form,
      name: 'name',
      store: {
        autoLoad: false,
        url: `${SERVER_PATH}/sei-basic/country/findAll`,
      },
      field: ['countryId', 'code'],
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 220,
          dataIndex: 'name',
        },
      ],
      searchProperties: ['code', 'name'],
      rowKey: "id",
      reader: {
        name: 'name',
        field: ['id', 'code',],
      },
    };
  }

  getInitialValueObj = () => {
    const { formType, region, } = this.props;
    const { selectedTreeNode, } = region;
    let initialValueObj = { id: null, code: '', name: '', parentId: '', shortName: '', rank: '', pinYin: '', countryId: ''};
    if (formType === 'addRootNode') {
      initialValueObj = objectAssignHave(initialValueObj, {});
    } else if(formType === 'addChildNode') {
      initialValueObj = objectAssignHave(initialValueObj, { parentId: selectedTreeNode.id, countryId: selectedTreeNode.countryId });
    } else {
      initialValueObj = objectAssignHave(initialValueObj, selectedTreeNode || {});
    }

    return initialValueObj;
  }

  getFormItems = () => {
    const { formType, form, } = this.props;
    const { getFieldDecorator } = form;
    const { code='', name='', parentId, } = this.getInitialValueObj();
    let component = (
      <Fragment>
        <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
          {getFieldDecorator("code", {
            initialValue: code,
            rules: [{
              required: true,
              message: formatMessage({ id: "global.code.required", defaultMessage: "代码不能为空" })
            }]
          })(<Input  disabled={!parentId} />)}
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
      </Fragment>
    );
    if (formType === 'addRootNode') {
      component = (
        <Fragment>
          <FormItem label={formatMessage({ id: "global.code", defaultMessage: "代码" })}>
            {getFieldDecorator("code", {
              initialValue: code,
            })(<Input  disabled={true} />)}
          </FormItem>
          <FormItem label={formatMessage({ id: "global.name", defaultMessage: "名称" })}>
            {getFieldDecorator("name", {
              initialValue: name,
              rules: [{
                required: true,
                message: formatMessage({ id: "global.name.required", defaultMessage: "名称不能为空" })
              }]
            })(<ComboGrid {...this.getComboGridProps() }/>)}
          </FormItem>
        </Fragment>
      );
    }

    return component;
  }

  render() {
    const { form, region, formType } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: formType ? 18 : 10,
      }
    };

    const { id, parentId, shortName='', rank='', pinYin='', countryId=''} = this.getInitialValueObj();

    return (
      <ScrollBar>
        <Form {...formItemLayout} layout="horizontal">
          {this.getFormItems()}
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
          <FormItem label="拼音">
            {getFieldDecorator("pinYin", {
              initialValue: pinYin,
            })(<Input />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator("countryId", {
              initialValue: countryId,
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
