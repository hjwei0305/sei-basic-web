import React, { Component } from 'react';
import { Form, Button, Spin } from 'antd';
import cls from 'classnames';
import { ComboList } from 'suid';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 5,
    },
  },
};

const FormItem = Form.Item;

@Form.create()
class FlowEngineCode extends Component {
  constructor(props) {
    super(props);
    const { editData = null } = props;
    const { menuLogo: menuLogoImg, collapsedMenuLogo: collapsedMenuLogoImg } = editData || {};
    this.state = {
      menuLogoImg,
      collapsedMenuLogoImg,
    };
  }

  onSubmit = () => {
    const { form } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFields((err, formData) => {
        if (err) {
          reject(err);
        }
        resolve(formData);
      });
    });
  };

  handleSave = () => {
    this.onSubmit().then(values => {
      const { onSave } = this.props;
      if (onSave) {
        onSave(values.flowEngineCode);
      }
    });
  };

  render() {
    const { form, opting, editData } = this.props;
    const { getFieldDecorator } = form;
    const flowEngineCodePros = {
      form,
      style: { width: 220 },
      name: 'flowEngineCode',
      field: ['code'],
      allowClear: true,
      placeholder: formatMessage({id: 'basic_000303', defaultMessage: '选择流程引擎代码'}),
      store: {
        url: `${SERVER_PATH}/flow-agent/commonComponent/getAgentType`,
      },
      reader: {
        name: 'code',
        description: 'name',
      },
    };

    return (
      <Form
        className={cls(styles['watermark-preview'])}
        style={{ padding: 8 }}
        {...formItemLayout}
        layout="horizontal"
        onSubmit={this.onSubmit}
      >
        <Spin spinning={!!opting}>
          <FormItem label={formatMessage({id: 'basic_000304', defaultMessage: '流程引擎代码'})}>
            {getFieldDecorator('flowEngineCode', {
              initialValue: editData,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000305', defaultMessage: '引擎代码不能为空'}),
                },
              ],
            })(<ComboList {...flowEngineCodePros} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button style={{ marginRight: 8 }} type="primary" onClick={this.handleSave}>
              {formatMessage({id: 'basic_000034', defaultMessage: '保存'})}
            </Button>
          </FormItem>
        </Spin>
      </Form>
    );
  }
}

export default FlowEngineCode;
