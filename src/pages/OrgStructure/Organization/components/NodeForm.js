import React, { PureComponent } from 'react';
import cls from 'classnames';
import { cloneDeep, get, isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Popconfirm, InputNumber, Switch } from 'antd';
import { ScrollBar, ExtIcon } from 'suid';
import styles from './NodeForm.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create({
  mapPropsToFields: props => {
    const { editData } = props;
    return {
      name: Form.createFormField({
        value: editData.name,
      }),
      code: Form.createFormField({
        value: editData.code,
      }),
      rank: Form.createFormField({
        value: editData.rank,
      }),
      shortName: Form.createFormField({
        value: editData.shortName,
      }),
      frozen: Form.createFormField({
        value: editData.frozen,
      }),
    };
  },
})
class NodeForm extends PureComponent {
  componentDidMount() {
    const { editData } = this.props;
    this.formEditData = cloneDeep(editData) || {};
  }

  componentDidUpdate(prevProps) {
    const { editData } = this.props;
    if (!isEqual(prevProps.editData, editData)) {
      this.formEditData = cloneDeep(editData) || {};
    }
  }

  onFormSubmit = e => {
    e && e.stopPropagation();
    const { form, saveOrg } = this.props;
    let formData = null;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        formData = values;
      }
    });
    if (formData) {
      Object.assign(this.formEditData, formData);
      saveOrg(this.formEditData);
    }
  };

  getInitValueByFields = (field, value) => {
    const { editData } = this.props;
    let tempData = value;
    if (!tempData) {
      tempData = get(editData, field);
    }
    return tempData;
  };

  handlerDelete = (e, id) => {
    e && e.stopPropagation();
    const { deleteOrg } = this.props;
    deleteOrg(id);
  };

  handlerAddChild = (e, editData) => {
    e && e.stopPropagation();
    const { addChild } = this.props;
    addChild(editData);
  };

  handlerGoBackParent = e => {
    e && e.stopPropagation();
    const { goBackToChildParent } = this.props;
    goBackToChildParent();
  };

  getExtAction = () => {
    const { editData, loading } = this.props;
    if (editData && editData.id) {
      return (
        <>
          <Button onClick={e => this.handlerAddChild(e, editData)}>新建下级组织</Button>
          {editData.parentId ? (
            <Popconfirm
              overlayClassName={cls(styles['pop-confirm-box'])}
              title="确定要删除吗？删除后不能恢复"
              placement="top"
              icon={<ExtIcon type="question-circle" antd />}
              onConfirm={e => this.handlerDelete(e, editData.id)}
            >
              <Button type="danger" loading={loading.effects['organization/del']}>
                删除
              </Button>
            </Popconfirm>
          ) : null}
        </>
      );
    }
    return (
      <Popconfirm
        overlayClassName={cls(styles['pop-confirm-box'])}
        title="确定要返回吗？未保存的数据将会丢失!"
        placement="top"
        icon={<ExtIcon type="question-circle" antd />}
        onConfirm={e => this.handlerGoBackParent(e)}
      >
        <Button type="danger">返回</Button>
      </Popconfirm>
    );
  };

  getFormTitle = () => {
    const { editData } = this.props;
    let title = '';
    if (editData) {
      title = editData.id ? editData.name : '新建下级组织';
    }
    return title;
  };

  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    const title = this.getFormTitle();
    return (
      <div key="node-form" className={cls(styles['node-form'])}>
        <div className="base-view-body">
          <div className="header">{title}</div>
          <div className="tool-bar-box">
            <div className="tool-action-box">
              <Button
                type="primary"
                loading={loading.effects['organization/save']}
                onClick={e => this.onFormSubmit(e)}
              >
                保存
              </Button>
              {this.getExtAction()}
            </div>
            <div className="tool-right-box" />
          </div>
          <div className="form-box">
            <ScrollBar>
              <Form {...formItemLayout} className="form-body">
                <FormItem label="代码">
                  {getFieldDecorator('code', {
                    initialValue: this.getInitValueByFields('code'),
                  })(<Input disabled placeholder="自动创建" />)}
                </FormItem>
                <FormItem label="名称">
                  {getFieldDecorator('name', {
                    initialValue: this.getInitValueByFields('name'),
                    rules: [
                      {
                        required: true,
                        message: '名称不能为空',
                      },
                    ],
                  })(<Input />)}
                </FormItem>
                <FormItem label="简称">
                  {getFieldDecorator('shortName', {
                    initialValue: this.getInitValueByFields('shortName'),
                  })(<Input />)}
                </FormItem>
                <FormItem label="序号">
                  {getFieldDecorator('rank', {
                    initialValue: this.getInitValueByFields('rank'),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'global.rank.required',
                          defaultMessage: '序号不能为空',
                        }),
                      },
                    ],
                  })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
                </FormItem>
                <FormItem label="冻结">
                  {getFieldDecorator('frozen', {
                    initialValue: this.getInitValueByFields('frozen'),
                    valuePropName: 'checked',
                  })(<Switch size="small" />)}
                </FormItem>
              </Form>
            </ScrollBar>
          </div>
        </div>
      </div>
    );
  }
}

export default NodeForm;
