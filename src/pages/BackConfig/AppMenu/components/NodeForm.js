import React, { Component, Fragment } from "react";
import cls from "classnames";
import { cloneDeep, get } from "lodash";
import isEqual from "react-fast-compare";
import { formatMessage } from "umi-plugin-react/locale";
import { Button, Form, Input, Popconfirm, InputNumber } from "antd";
import { ScrollBar, ExtIcon, ComboGrid } from 'seid';
import { constants } from '@/utils';
import styles from "./NodeForm.less";

const { SERVER_PATH } = constants;



const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 18
    }
};

@Form.create({
    mapPropsToFields: (props) => {
        const { editData } = props;
        return {
            name: Form.createFormField({
                value: editData.name
            }),
            iconCls: Form.createFormField({
                value: editData.iconCls
            }),
            rank: Form.createFormField({
                value: editData.rank
            }),
        }
    }
})
class NodeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    onFormSubmit = e => {
        e && e.stopPropagation();
        const { form, saveMenu } = this.props;
        let formData = null;
        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                formData = values;
            }
        });
        if (formData) {
            Object.assign(this.formEditData, formData);
            saveMenu(this.formEditData);
        }
    };

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.editData, this.props.editData)) {
            this.formEditData = cloneDeep(this.props.editData) || {};
        }
    }

    componentDidMount() {
        const { editData } = this.props;
        this.formEditData = cloneDeep(editData) || {};
    }

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

    getExtAction = _ => {
        const { editData, loading } = this.props;
        if (editData && editData.id) {
            return (
                <Fragment>
                    <Button
                        onClick={e => this.handlerAddChild(e, editData)}
                    >
                        新建子菜单
                     </Button>
                    {
                        editData.parentId
                            ? <Button
                                loading={loading.effects["appMenu/move"]}
                                onClick={e => this.handlerMove(e, editData)}
                            >
                                移动
                              </Button>
                            : null
                    }
                    <Popconfirm
                        overlayClassName={cls(styles["pop-confirm-box"])}
                        title="确定要删除吗？删除后不能恢复"
                        placement="top"
                        icon={<ExtIcon type="question-circle" antd />}
                        onConfirm={e => this.handlerDelete(e, editData.id)}
                    >
                        <Button
                            type="danger"
                            loading={loading.effects["appMenu/del"]}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Fragment>
            );
        } else {
            return (
                <Popconfirm
                    overlayClassName={cls(styles["pop-confirm-box"])}
                    title="确定要返回吗？未保存的数据将会丢失!"
                    placement="top"
                    icon={<ExtIcon type="question-circle" antd />}
                    onConfirm={e => this.handlerGoBackParent(e)}
                >
                    <Button
                        type="danger"
                    >
                        返回
                     </Button>
                </Popconfirm>
            )
        }
    };

    getFormTitle = () => {
        const { editData } = this.props;
        let title = '';
        if (editData) {
            if (editData.parentId) {
                title = editData.id ? "编辑菜单" : "新建子菜单";
            } else {
                title = editData.id ? "编辑根菜单" : "新建根菜单";
            }
        }
        return title;
    };

    render() {
        const { form, loading, editData } = this.props;
        const { getFieldDecorator } = form;
        const title = this.getFormTitle();
        getFieldDecorator("featureId", { initialValue: this.getInitValueByFields("featureId") });
        getFieldDecorator("featureCode", { initialValue: this.getInitValueByFields("featureCode") });
        const featureProps = {
            form,
            remotePaging: true,
            name: 'featureName',
            field: ['featureId', 'featureCode'],
            searchPlaceHolder: "输入关键字查询",
            searchProperties: ["name", "code"],
            width: 420,
            columns: [{
                title: "代码",
                width: 120,
                dataIndex: "code",
            }, {
                title: "名称",
                width: 220,
                dataIndex: "name",
            }, {
                title: "所属应用模块",
                width: 180,
                dataIndex: 'appModuleName'
            }],
            store: {
                type: 'POST',
                url: `${SERVER_PATH}/sei-basic/feature/findByPage`,
                params: {
                    filters: [
                        {
                            fieldName: 'canMenu',
                            fieldType: 'bool',
                            operator: 'EQ',
                            value: true
                        }
                    ],
                }
            },
            reader: {
                name: "name",
                field: ["id", 'code']
            }
        };
        return (
            <div key="node-form" className={cls(styles["node-form"])}>
                <div className="base-view-body">
                    <div className="header">
                        <span className="title">{title}</span>
                    </div>
                    <div className="tool-bar-box">
                        <div className="tool-action-box">
                            <Button
                                type="primary"
                                loading={loading.effects["appMenu/save"]}
                                onClick={e => this.onFormSubmit(e)}
                            >
                                保存
                            </Button>
                            {
                                this.getExtAction()
                            }
                        </div>
                        <div className="tool-right-box" />
                    </div>
                    <div className="form-box">
                        <ScrollBar>
                            <Form {...formItemLayout} className='form-body'>
                                <FormItem label="菜单名称">
                                    {
                                        getFieldDecorator("name", {
                                            initialValue: this.getInitValueByFields("name"),
                                            rules: [{
                                                required: true,
                                                message: "菜单名称不能为空"
                                            }]
                                        })(<Input />)
                                    }
                                </FormItem>
                                <FormItem label="图标类名">
                                    {
                                        getFieldDecorator("iconCls", {
                                            initialValue: this.getInitValueByFields("iconCls")
                                        })(<Input />)
                                    }
                                </FormItem>
                                <FormItem label='序号'>
                                    {getFieldDecorator("rank", {
                                        initialValue: this.getInitValueByFields("rank"),
                                        rules: [{
                                            required: true,
                                            message: formatMessage({ id: "global.rank.required", defaultMessage: "序号不能为空" })
                                        }]
                                    })(<InputNumber precision={0} style={{ width: '100%' }} />)}
                                </FormItem>
                                {
                                    editData.children && editData.children.length === 0
                                        ? <FormItem label='菜单项'>
                                            {
                                                getFieldDecorator("featureName", {
                                                    initialValue: this.getInitValueByFields("featureName"),
                                                    rules: [{
                                                        required: false,
                                                        message: "菜单项不能为空"
                                                    }]
                                                })(<ComboGrid {...featureProps} />)
                                            }
                                        </FormItem>
                                        : null
                                }
                            </Form>
                        </ScrollBar>
                    </div>
                </div>
            </div>
        );
    }
}

export default NodeForm;
