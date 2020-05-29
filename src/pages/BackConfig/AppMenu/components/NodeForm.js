import React, { PureComponent } from 'react';
import cls from 'classnames';
import { cloneDeep, get, isEqual } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Form, Input, Popconfirm, InputNumber, Upload, message } from 'antd';
import { ScrollBar, ExtIcon, ComboGrid } from 'suid';
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
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAEY0lEQVRYR+2ZT2hcVRTGz3dfEhy1KBUFhUCZeW9mdLYxKJYideUfBBftQrHWFqOxdFV0rS6zEkSrcYgW0to/1C5UcKMWpZi6sCQ4ZObdN3mSKFSCQqMik8zcIyfOhHEy7828eTOLQi5klXO+83v3fffed8+AbrKBfvCurq7uWltbGzfGjAN4kJnHicgQ0RyAq8aYhaGhoYVkMvlb3HqxgJeWlvbVarWDRHSAiO7pAMNE9CkRXbJt+xMA8kCRR2TglZWV3ZVK5QAzC+j+yBX/S/AFnJnPp9Ppq1E0ugb2PO8RmUlmPkJEu6IU6RB72RhzsVqtTudyufVOuqHA5XL5DmOMvG6BfLiTWMz/32DmS8aYfDabvRKk1RZYa/1QHfKlmBA9pTPzgmVZMyMjI9Ojo6P/NItsARcKhduHh4ePAJggolxPlQaTdNqyrOlkMvmtyG8Cu657fx1UYG8dTN1YqgI77TjO6W2W8DxPbDDBzGOxSsRPZgAfMLOAXmvIBS66Uqm0VyklM/58/NqRFH4SSAACWmnNRKFQ2J3L5f4IkvR9/85qtTrJzBMA9kQqHS34nEDatv11UNri4uJd0FrLCfShZVn5ZDL5Q1gNrfXTRPQKET0ejaV9NIDrzHxyfX1d9uDrQZpaa9lSj8pfA7gRe5mI8mLuMCDXdZNKKZn1l3s5RAB8ZYw5mU6nL4bV8TzvsDHmKIC9Wx6uz3Br3i8CrpR6O5VK3egAfxjAJBHJB0/YqAJ4zxjzfjqdXgwKXF5evq9SqRyvz+jd2zwcANwcN2uMeSeTyYTapVgsjlmWJeByKjaPeQG1bXs67GnK5fJjtVrtGIBnwuJaLREWO0dE7zqOMxsW5Pv+LbJIiWisDhp4zIqO67rHAci6eKCbdREFuKH3u4BUKpWpXC73VzdFWmN839+zsbHxOgDZ84eiaPQC3Kx/joimHMf5sZuipVLpCaXUa0T0aDfx7WLiAjc0rwGYsm37bLsipVLphGVZJ5j53l5BO+0Sver+rZSaSqVSb4mA1jpfX+296m3L69cMbwkbY97MZDJv1IG/ifP6B2mJHeAgD+1YYsfDLd7YscSOJW56S3ie5zNz3+5qg7QEgJ/hed7nzPxkvw77QQIz8xdwXfdZAKF3uCgPM2Dg5zb7Elrr8/UebxS2trEDBL7gOM7BTWBmlv34IwAvxCUeBDAzn3Ic50UA/L/Oj1yr61d36V72NPoMfAVA3rbtj7c+4NtRaa2lJ3yIiJ6KSt0PYGY+C+CM4ziftdYPbWgXi8X9SqlDAAS+q259DOBfmfmMMWY2m80uBH5edjODxWIxY1mW3HAFfFtzo1mjB+A5AU0kEvnW5nXbG0c3wI2Y+fn52xKJxDEikgWQbZcbAfgCgBnbtr+MwtDVa24nKPs3EU02970krgOwNPxkAUn/rhwFNHTRRRFyXXcfAJl1+RksCPj7OuRMFO3YlggrprVOEdGrxpg/G7dmz/NOKaWkjftdXNBG/r/4hnQwy6nGTgAAAABJRU5ErkJggg==';

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
          message.error('应用的图标不能为空');
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
          <Button onClick={e => this.handlerAddChild(e, editData)}>新建子菜单</Button>
          {editData.parentId ? (
            <Button
              loading={loading.effects['appMenu/move']}
              onClick={e => this.handlerMove(e, editData)}
            >
              移动
            </Button>
          ) : null}
          <Popconfirm
            overlayClassName={cls(styles['pop-confirm-box'])}
            title={this.renderPopconfirmTitle('确定要删除吗？', '提示：删除后不能恢复')}
            placement="top"
            icon={<ExtIcon type="question-circle" antd />}
            onConfirm={e => this.handlerDelete(e, editData.id)}
          >
            <Button type="danger" loading={loading.effects['appMenu/del']}>
              删除
            </Button>
          </Popconfirm>
        </>
      );
    }
    return (
      <Popconfirm
        overlayClassName={cls(styles['pop-confirm-box'])}
        title={this.renderPopconfirmTitle('确定要返回吗？', '提示：未保存的数据将会丢失')}
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
    let subTitle = '';
    if (editData.parentId) {
      if (editData.id) {
        title = editData.name;
        subTitle = '编辑';
      } else {
        title = editData.parentName;
        subTitle = '新建子菜单';
      }
    } else if (editData.id) {
      title = editData.name;
      subTitle = '编辑';
    } else {
      title = '新建应用';
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
      message.error('只能上传PNG文件!');
      return false;
    }
    const isLt10K = file.size / 1024 <= 10;
    if (!isLt10K) {
      message.error('图片大小需小于10Kb!');
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
      remotePaging: true,
      name: 'featureName',
      field: ['featureId', 'featureCode'],
      searchPlaceHolder: '输入代码或名称关键字查询',
      searchProperties: ['name', 'code'],
      searchWidth: 220,
      width: 420,
      columns: [
        {
          title: '代码',
          width: 120,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 220,
          dataIndex: 'name',
        },
        {
          title: '应用模块',
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
    const hasAppIcon = !editData.id || editData.nodeLevel === 0;
    const hasIcon = editData.nodeLevel === 1;
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
                保存
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
                      <div className="title">应用图标</div>
                      <div className="app-icon-box horizontal">
                        <div className="row-start app-icon">
                          <img alt="" src={appIcon || defaultAppIcon} />
                        </div>
                        <div className="tool-box vertical">
                          <Upload {...uploadProps}>
                            <Button type="primary" icon="upload" ghost>
                              上传图标
                            </Button>
                          </Upload>
                          <div className="desc">
                            请为应用上传图标,图片为png格式,图片长宽都为44px，大小在10Kb以内;
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormItem label="应用名称">
                      {getFieldDecorator('name', {
                        initialValue: this.getInitValueByFields('name'),
                        rules: [
                          {
                            required: true,
                            message: '应用名称不能为空',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                  </>
                ) : (
                  <FormItem label="菜单名称">
                    {getFieldDecorator('name', {
                      initialValue: this.getInitValueByFields('name'),
                      rules: [
                        {
                          required: true,
                          message: '菜单名称不能为空',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                )}
                {hasIcon ? (
                  <FormItem label="图标类名">
                    {getFieldDecorator('iconCls', {
                      initialValue: this.getInitValueByFields('iconCls'),
                      rules: [
                        {
                          required: true,
                          message: '图标类名不能为空',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                ) : null}
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
                {editData.children && editData.children.length === 0 && editData.parentId ? (
                  <FormItem label="菜单项">
                    {getFieldDecorator('featureName', {
                      initialValue: this.getInitValueByFields('featureName'),
                      rules: [
                        {
                          required: false,
                          message: '菜单项不能为空',
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
