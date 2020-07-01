import React, { Component } from 'react';
import { Empty, Form, Button, Spin, Switch } from 'antd';
import cls from 'classnames';
import { ColumnLayout } from '@/components';
import ExtUpload from './Upload';
import SiderDemo from './SiderDemo';
import styles from './index.less';

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
class SystemLogo extends Component {
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
      const { menuLogo: menuLogoImg, collapsedMenuLogo: collapsedMenuLogoImg } = values;

      this.setState(
        {
          menuLogoImg,
          collapsedMenuLogoImg,
        },
        () => {
          const { onSave } = this.props;
          if (onSave) {
            onSave(values);
          }
        },
      );
    });
  };

  handlePreview = () => {
    this.onSubmit().then(values => {
      const { menuLogo: menuLogoImg, collapsedMenuLogo: collapsedMenuLogoImg } = values;

      this.setState({
        menuLogoImg,
        collapsedMenuLogoImg,
      });
    });
  };

  render() {
    const { menuLogoImg, collapsedMenuLogoImg } = this.state;
    const { editData, form, opting } = this.props;
    const { getFieldDecorator } = form;
    const { collapsedMenuLogo = '', menuLogo = '', disabled = false } = editData || {};

    return (
      <ColumnLayout title={['菜单LOGO', '预览']}>
        <Form
          style={{ padding: 8 }}
          slot="left"
          {...formItemLayout}
          layout="horizontal"
          onSubmit={this.onSubmit}
        >
          <Spin spinning={!!opting}>
            <FormItem label="收缩LOGO">
              {getFieldDecorator('collapsedMenuLogo', {
                initialValue: collapsedMenuLogo,
                rules: [
                  {
                    required: true,
                    message: '收缩图标不能为空',
                  },
                ],
              })(<ExtUpload />)}
            </FormItem>
            <FormItem label="展开LOGO">
              {getFieldDecorator('menuLogo', {
                initialValue: menuLogo,
                rules: [
                  {
                    required: true,
                    message: '展开图标不能为空',
                  },
                ],
              })(<ExtUpload />)}
            </FormItem>
            <FormItem label="禁用">
              {getFieldDecorator('disabled', {
                valuePropName: 'checked',
                initialValue: disabled,
              })(<Switch />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button style={{ marginRight: 8 }} type="primary" onClick={this.handleSave}>
                保存
              </Button>
              <Button style={{ marginRight: 8 }} onClick={this.handlePreview}>
                预览
              </Button>
            </FormItem>
          </Spin>
        </Form>
        {menuLogoImg && collapsedMenuLogoImg ? (
          <SiderDemo
            slot="right"
            menuLogoImg={menuLogoImg}
            collapsedMenuLogoImg={collapsedMenuLogoImg}
          />
        ) : (
          <div className={cls(styles['empty-warpper'])} slot="right">
            <Empty description="暂无菜单logo" />
          </div>
        )}
      </ColumnLayout>
    );
  }
}

export default SystemLogo;
