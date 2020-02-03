import React, { Component, Fragment } from "react";
import { connect } from "dva";
import cls from "classnames";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Popconfirm, Button, Card } from 'antd'
import { ExtTable, ExtIcon } from 'seid';
import { constants } from '@/utils';
import FeaturePageFormModal from './FeaturePageFormModal'
import styles from './FeaturePage.less';

const { SERVER_PATH } = constants;

@connect(({ featurePage, featureGroup, loading }) => ({ featurePage, featureGroup, loading }))
class FeaturePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            delRowId: null,
        };
    }

    static pageTableRef;

    reloadData = () => {
        if (this.pageTableRef) {
            this.pageTableRef.remoteDataRrefresh();
        }
    };

    add = _ => {
        const { dispatch } = this.props;
        dispatch({
            type: "featurePage/updateState",
            payload: {
                showFormModal: true,
                currentPageRow: null
            }
        });
    };

    edit = currentPageRow => {
        const { dispatch } = this.props;
        dispatch({
            type: "featurePage/updateState",
            payload: {
                showFormModal: true,
                currentPageRow,
            }
        });
    };

    save = data => {
        const { dispatch } = this.props;
        dispatch({
            type: "featurePage/saveFeature",
            payload: {
                ...data
            },
            callback: res => {
                if (res.success) {
                    dispatch({
                        type: "featurePage/updateState",
                        payload: {
                            showFormModal: false
                        }
                    });
                    this.reloadData();
                }
            }
        });
    };

    del = record => {
        const { dispatch } = this.props;
        this.setState({
            delRowId: record.id
        }, _ => {
            dispatch({
                type: "featurePage/delFeature",
                payload: {
                    id: record.id
                },
                callback: res => {
                    if (res.success) {
                        this.setState({
                            delRowId: null
                        });
                        this.reloadData();
                    }
                }
            });
        });
    };

    closePageFormModal = _ => {
        const { dispatch } = this.props;
        dispatch({
            type: "featurePage/updateState",
            payload: {
                showFormModal: false,
                currentPageRow: null
            }
        });
    };

    renderDelBtn = (row) => {
        const { loading } = this.props;
        const { delRowId } = this.state;
        if (loading.effects["featurePage/delFeature"] && delRowId === row.id) {
            return <ExtIcon className="del-loading" type="loading" antd />
        }
        return <ExtIcon className="del" type="delete" antd />;
    };

    render() {
        const { loading, featureGroup, featurePage } = this.props;
        const { currentFeatureGroup } = featureGroup;
        const { showFormModal, currentPageRow } = featurePage;
        const columns = [
            {
                title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
                key: "operation",
                width: 120,
                align: "center",
                dataIndex: "id",
                className: "action",
                required: true,
                render: (text, record) => (
                    <span className={cls("action-box")}>
                        <ExtIcon
                            className="edit"
                            onClick={_ => this.edit(record)}
                            type="edit"
                            antd
                        />
                        <Popconfirm
                            placement="topLeft"
                            title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                            onConfirm={_ => this.del(record)}
                        >
                            {
                                this.renderDelBtn(record)
                            }
                        </Popconfirm>
                        <ExtIcon
                            className="edit"
                            onClick={_ => this.edit(record)}
                            type="safety"
                            tooltip={{ title: '页面功能项' }}
                            antd
                        />
                    </span>
                )
            },
            {
                title: formatMessage({ id: "global.code", defaultMessage: "代码" }),
                dataIndex: "code",
                width: 120,
                required: true,
            },
            {
                title: formatMessage({ id: "global.name", defaultMessage: "名称" }),
                dataIndex: "name",
                width: 220,
                required: true,
            },
            {
                title: '页面路由地址',
                dataIndex: "groupCode",
                width: 320,
            },
            {
                title: '租户可用',
                align: "center",
                dataIndex: "tenantCanUse",
                className: "checked",
                render: (_text, record) => {
                    if (record.tenantCanUse) {
                        return <ExtIcon type="check" antd />;
                    }
                },
            },
        ];
        const toolBarProps = {
            layout: {
                leftSpan: 10,
                rightSpan: 14,
            },
            left: (
                <Fragment>
                    <Button
                        type="primary"
                        onClick={this.add}
                        ignore='true'
                    >
                        <FormattedMessage id="global.add" defaultMessage="新建" />
                    </Button>
                    <Button onClick={this.reloadData}>
                        <FormattedMessage id="global.refresh" defaultMessage="刷新" />
                    </Button>
                </Fragment>
            )
        };
        const extTableProps = {
            bordered: false,
            toolBar: toolBarProps,
            columns,
            cascadeParams: { featureGroupId: currentFeatureGroup ? currentFeatureGroup.id : null },
            onTableRef: ref => this.pageTableRef = ref,
            store: {
                url: `${SERVER_PATH}/sei-basic/feature/findByFeatureGroupAndType?featureTypes=Page`
            }
        };
        const formModalProps = {
            save: this.save,
            currentPageRow,
            showFormModal,
            currentFeatureGroup,
            closePageFormModal: this.closePageFormModal,
            saving: loading.effects["featurePage/saveFeature"]
        };
        return (
            <>
                <Card
                    title="菜单项管理"
                    bordered={false}
                    className={cls(styles['feature-page-box'])}
                >
                    <ExtTable {...extTableProps} />

                </Card>
                <FeaturePageFormModal {...formModalProps} />
            </>
        )
    }
}

export default FeaturePage;