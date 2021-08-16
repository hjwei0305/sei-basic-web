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
      <ColumnLayout title={[formatMessage({id: 'basic_000293', defaultMessage: '菜单LOGO'}), formatMessage({id: 'basic_000290', defaultMessage: '预览'})]}>
        <Form
          style={{ padding: 8 }}
          slot="left"
          {...formItemLayout}
          layout="horizontal"
          onSubmit={this.onSubmit}
        >
          <Spin spinning={!!opting}>
            <FormItem label={formatMessage({id: 'basic_000294', defaultMessage: '收缩LOGO'})} extra="{formatMessage({id: 'basic_000295', defaultMessage: '请上传40'})}*{formatMessage({id: 'basic_000296', defaultMessage: '40px或者整数倍数的，背景透明的svg格式的图片'})}">
              {getFieldDecorator('collapsedMenuLogo', {
                initialValue: collapsedMenuLogo,
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'basic_000297', defaultMessage: '收缩图标不能为空'}),
                  },
                ],
              })(<ExtUpload />)}
            </FormItem>
            <FormItem
              label={formatMessage({id: 'basic_000298', defaultMessage: '展开LOGO'})}
              extra="{formatMessage({id: 'basic_000299', defaultMessage: '请上传200'})}*{formatMessage({id: 'basic_000296', defaultMessage: '40px或者整数倍数的，背景透明的svg格式的图片'})}"
            >
              {getFieldDecorator('menuLogo', {
                initialValue: menuLogo,
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'basic_000300', defaultMessage: '展开图标不能为空'}),
                  },
                ],
              })(<ExtUpload />)}
            </FormItem>
            <FormItem label={formatMessage({id: 'basic_000289', defaultMessage: '禁用'})}>
              {getFieldDecorator('disabled', {
                valuePropName: 'checked',
                initialValue: disabled,
              })(<Switch />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button style={{ marginRight: 8 }} type="primary" onClick={this.handleSave}>
                {formatMessage({id: 'basic_000034', defaultMessage: '保存'})}
              </Button>
              <Button style={{ marginRight: 8 }} onClick={this.handlePreview}>
                {formatMessage({id: 'basic_000290', defaultMessage: '预览'})}
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
            <Empty description={formatMessage({id: 'basic_000301', defaultMessage: '暂无菜单logo'})} />
          </div>
        )}
      </ColumnLayout>
    );
  }
}

export default SystemLogo;
