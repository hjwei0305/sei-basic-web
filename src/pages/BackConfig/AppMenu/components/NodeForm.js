import React, { PureComponent } from 'react';
import cls from 'classnames';
import { cloneDeep, get, isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Popconfirm, InputNumber, Upload } from 'antd';
import { ScrollBar, ExtIcon, ComboGrid, message } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import styles from './NodeForm.less';

const { SERVER_PATH } = constants;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const defaultAppIcon =
  'data:image/png;base64,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';

@Form.create({
  mapPropsToFields: props => {
    const { editData } = props;
    return {
      name: Form.createFormField({
        value: editData.name,
      }),
      iconCls: Form.createFormField({
        value: editData.iconCls,
      }),
      rank: Form.createFormField({
        value: editData.rank,
      }),
    };
  },
})
class NodeForm extends PureComponent {
  constructor(props) {
    super(props);
    const { editData } = props;
    this.state = {
      appIcon: editData.iconFileData,
    };
  }

  componentDidMount() {
    const { editData } = this.props;
    this.formEditData = cloneDeep(editData) || {};
  }

  componentDidUpdate(prevProps) {
    const { editData } = this.props;
    if (!isEqual(prevProps.editData, editData)) {
      this.formEditData = cloneDeep(editData) || {};
      this.setState({ appIcon: editData.iconFileData });
    }
  }

  onFormSubmit = e => {
    e && e.stopPropagation();
    const { form, saveMenu } = this.props;
    const { appIcon } = this.state;
    let formData = null;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        formData = values;
      }
    });
    if (formData) {
      if (!this.formEditData.parentId) {
        if (!appIcon) {
          message.error(formatMessage({id: 'basic_000361', defaultMessage: '应用的图标不能为空'}));
          return false;
        }
        formData.iconFileData = appIcon;
      }
      Object.assign(this.formEditData, formData);
      saveMenu(this.formEditData);
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
    const { deleteMenu } = this.props;
    deleteMenu(id);
  };

  handlerAddChild = (e, editData) => {
    e && e.stopPropagation();
    const { addChild } = this.props;
    addChild(editData);
  };

  handlerMove = (e, editData) => {
    e && e.stopPropagation();
    const { moveChild } = this.props;
    moveChild(editData);
  };

  handlerGoBackParent = e => {
    e && e.stopPropagation();
    const { goBackToChildParent } = this.props;
    goBackToChildParent();
  };

  renderPopconfirmTitle = (title, subTitle) => {
    return (
      <>
        <span style={{ fontWeight: 700, marginBottom: 8, display: 'inline-block' }}>{title}</span>
        <br />
        {subTitle}
      </>
    );
  };

  getExtAction = () => {
    const { editData, loading } = this.props;
    if (editData && editData.id) {
      return (
        <>
          <Button onClick={e => this.handlerAddChild(e, editData)}>{formatMessage({id: 'basic_000362', defaultMessage: '新建子菜单'})}</Button>
          {editData.parentId ? (
            <Button
              loading={loading.effects['appMenu/move']}
              onClick={e => this.handlerMove(e, editData)}
            >
              {formatMessage({id: 'basic_000185', defaultMessage: '移动'})}
            </Button>
          ) : null}
          <Popconfirm
            overlayClassName={cls(styles['pop-confirm-box'])}
            title={this.renderPopconfirmTitle(formatMessage({id: 'basic_000216', defaultMessage: '确定要删除吗？'}), formatMessage({id: 'basic_000217', defaultMessage: '提示：删除后不能恢复'}))}
            placement="top"
            icon={<ExtIcon type="question-circle" antd />}
            onConfirm={e => this.handlerDelete(e, editData.id)}
          >
            <Button type="danger" loading={loading.effects['appMenu/del']}>
              {formatMessage({id: 'basic_000186', defaultMessage: '删除'})}
            </Button>
          </Popconfirm>
        </>
      );
    }
    return (
      <Popconfirm
        overlayClassName={cls(styles['pop-confirm-box'])}
        title={this.renderPopconfirmTitle(formatMessage({id: 'basic_000218', defaultMessage: '确定要返回吗？'}), formatMessage({id: 'basic_000219', defaultMessage: '提示：未保存的数据将会丢失'}))}
        placement="top"
        icon={<ExtIcon type="question-circle" antd />}
        onConfirm={e => this.handlerGoBackParent(e)}
      >
        <Button type="danger">{formatMessage({id: 'basic_000220', defaultMessage: '返回'})}</Button>
      </Popconfirm>
    );
  };

  getFormTitle = () => {
    const { editData } = this.props;
    let title = '';
    let subTitle = '';
    if (editData.parentId) {
      if (editData.id) {
        title = editData.name;
        subTitle = formatMessage({id: 'basic_000020', defaultMessage: '编辑'});
      } else {
        title = editData.parentName;
        subTitle =formatMessage({id: 'basic_000362', defaultMessage: '新建子菜单'});
      }
    } else if (editData.id) {
      title = editData.name;
      subTitle = formatMessage({id: 'basic_000020', defaultMessage: '编辑'});
    } else {
      title =formatMessage({id: 'basic_000359', defaultMessage: '新建应用'});
    }
    return <BannerTitle title={title} subTitle={subTitle} />;
  };

  customRequest = option => {
    const formData = new FormData();
    formData.append('files[]', option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = e => {
      if (e && e.target && e.target.result) {
        option.onSuccess();
        this.setState({ appIcon: e.target.result });
      }
    };
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(formatMessage({id: 'basic_000052', defaultMessage: '只能上传PNG文件!'}));
      return false;
    }
    const isLt10K = file.size / 1024 <= 10;
    if (!isLt10K) {
      message.error(formatMessage({id: 'basic_000053', defaultMessage: '图片大小需小于10Kb!'}));
      return false;
    }
    return isJpgOrPng && isLt10K;
  };

  render() {
    const { appIcon } = this.state;
    const { form, loading, editData } = this.props;
    const { getFieldDecorator } = form;
    const title = this.getFormTitle();
    getFieldDecorator('featureId', { initialValue: this.getInitValueByFields('featureId') });
    getFieldDecorator('featureCode', { initialValue: this.getInitValueByFields('featureCode') });
    const featureProps = {
      form,
      allowClear: true,
      remotePaging: true,
      name: 'featureName',
      field: ['featureId', 'featureCode'],
      searchPlaceHolder: formatMessage({id: 'basic_000030', defaultMessage: '输入代码或名称关键字查询'}),
      searchProperties: ['name', 'code'],
      searchWidth: 220,
      width: 420,
      columns: [
        {
          title: formatMessage({id: 'basic_000031', defaultMessage: '代码'}),
          width: 120,
          dataIndex: 'code',
        },
        {
          title: formatMessage({id: 'basic_000032', defaultMessage: '名称'}),
          width: 220,
          dataIndex: 'name',
        },
        {
          title: formatMessage({id: 'basic_000108', defaultMessage: '应用模块'}),
          width: 180,
          dataIndex: 'appModuleName',
        },
      ],
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/feature/findByPage`,
        params: {
          filters: [
            {
              fieldName: 'canMenu',
              fieldType: 'bool',
              operator: 'EQ',
              value: true,
            },
          ],
        },
      },
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
    };
    const hasAppIcon = (!editData.id && !editData.parentId) || editData.nodeLevel === 0;
    const hasIcon =
      (!editData.id && editData.parentId && editData.parentNodeLevel === 0) ||
      editData.nodeLevel === 1;
    const uploadProps = {
      customRequest: this.customRequest,
      showUploadList: false, // 不展示文件列表
      beforeUpload: this.beforeUpload,
    };
    return (
      <div key="node-form" className={cls(styles['node-form'])}>
        <div className="base-view-body">
          <div className="header">{title}</div>
          <div className="tool-bar-box">
            <div className="tool-action-box">
              <Button
                type="primary"
                loading={loading.effects['appMenu/save']}
                onClick={e => this.onFormSubmit(e)}
              >
                {formatMessage({id: 'basic_000034', defaultMessage: '保存'})}
              </Button>
              {this.getExtAction()}
            </div>
            <div className="tool-right-box" />
          </div>
          <div className="form-box">
            <ScrollBar>
              <Form {...formItemLayout} className="form-body" layout="vertical">
                {hasAppIcon ? (
                  <>
                    <div className="box-item">
                      <div className="title">{formatMessage({id: 'basic_000363', defaultMessage: '应用图标'})}</div>
                      <div className="app-icon-box horizontal">
                        <div className="row-start app-icon">
                          <img alt="" src={appIcon || defaultAppIcon} />
                        </div>
                        <div className="tool-box vertical">
                          <Upload {...uploadProps}>
                            <Button type="primary" icon="upload" ghost>
                              {formatMessage({id: 'basic_000364', defaultMessage: '上传图标'})}
                            </Button>
                          </Upload>
                          <div className="desc">
                            {formatMessage({id: 'basic_000365', defaultMessage: '请为应用上传图标,图片为png格式,图片长宽都为44px，大小在10Kb以内'})};
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormItem label={formatMessage({id: 'basic_000366', defaultMessage: '应用名称'})}>
                      {getFieldDecorator('name', {
                        initialValue: this.getInitValueByFields('name'),
                        rules: [
                          {
                            required: true,
                            message: formatMessage({id: 'basic_000367', defaultMessage: '应用名称不能为空'}),
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                  </>
                ) : (
                  <FormItem label={formatMessage({id: 'basic_000368', defaultMessage: '菜单名称'})}>
                    {getFieldDecorator('name', {
                      initialValue: this.getInitValueByFields('name'),
                      rules: [
                        {
                          required: true,
                          message: formatMessage({id: 'basic_000369', defaultMessage: '菜单名称不能为空'}),
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                )}
                {hasIcon ? (
                  <FormItem label={formatMessage({id: 'basic_000370', defaultMessage: '图标类名'})}>
                    {getFieldDecorator('iconCls', {
                      initialValue: this.getInitValueByFields('iconCls'),
                      rules: [
                        {
                          required: true,
                          message: formatMessage({id: 'basic_000371', defaultMessage: '图标类名不能为空'}),
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                ) : null}
                <FormItem label={formatMessage({id: 'basic_000224', defaultMessage: '序号'})}>
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
                {editData.children && editData.children.length === 0 && editData.parentId ? (
                  <FormItem label={formatMessage({id: 'basic_000372', defaultMessage: '菜单项'})}>
                    {getFieldDecorator('featureName', {
                      initialValue: this.getInitValueByFields('featureName'),
                      rules: [
                        {
                          required: false,
                          message: formatMessage({id: 'basic_000373', defaultMessage: '菜单项不能为空'}),
                        },
                      ],
                    })(<ComboGrid {...featureProps} />)}
                  </FormItem>
                ) : null}
              </Form>
            </ScrollBar>
          </div>
        </div>
      </div>
    );
  }
}

export default NodeForm;
