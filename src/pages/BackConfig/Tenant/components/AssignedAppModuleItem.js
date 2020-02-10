import React, { Component, Fragment } from "react";
import { connect } from "dva";
import cls from "classnames";
import isEqual from 'react-fast-compare';
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Popconfirm, Button, Card, Drawer } from 'antd'
import { ExtTable, ExtIcon } from 'seid';
import { constants } from '@/utils';
import UnAssignAppModuleItem from './UnAssignAppModuleItem';
import styles from './AssignedAppModuleItem.less';

const { SERVER_PATH } = constants;

@connect(({ tenant, loading }) => ({ tenant, loading }))
class TenantAssignedAppModuleItem extends Component {

    static appModuleTableRef;

    constructor(props) {
        super(props);
        this.state = {
            removeAppModuleId: null,
            selectedRowKeys: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.tenant.currentTenant, this.props.tenant.currentTenant)) {
            this.setState({
                removeAppModuleId: null,
                selectedRowKeys: [],
            }, () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'tenant/updateState',
                    payload: {
                        showAssignAppModule: false,
                    }
                });
            });
        }
    }


    reloadData = () => {
        if (this.appModuleTableRef) {
            this.appModuleTableRef.remoteDataRefresh();
        }
    };


    showAssignAppModule = () => {
        const { tenant, dispatch } = this.props;
        const { currentTenant } = tenant;
        dispatch({
            type: 'tenant/updateState',
            payload: {
                showAssignAppModule: true,
            }
        });
        dispatch({
            type: 'tenant/getUnAssignedAppModuleItemList',
            payload: {
                parentId: currentTenant.id,
            }
        });
    };

    assignAppModuleItem = (childIds) => {
        const { tenant, dispatch } = this.props;
        const { currentTenant } = tenant;
        dispatch({
            type: "tenant/assignAppModuleItem",
            payload: {
                parentId: currentTenant.id,
                childIds,
            },
            callback: res => {
                if (res.success) {
                    this.reloadData();
                }
            }
        });
    };

    removeAssignedAppModuleItem = (childIds) => {
        const { tenant, dispatch } = this.props;
        const { currentTenant } = tenant;
        if (childIds.length === 1) {
            this.setState({
                removeAppModuleId: childIds[0],
            });
        }
        dispatch({
            type: 'tenant/removeAssignedAppModuleItem',
            payload: {
                parentId: currentTenant.id,
                childIds,
            },
            callback: res => {
                if (res.success) {
                    this.setState({
                        removeAppModuleId: null,
                        selectedRowKeys: [],
                    });
                    this.reloadData();
                }
            }
        })
    };

    batchRemoveAssignedAppModuleItem = () => {
        const { selectedRowKeys } = this.state;
        this.removeAssignedAppModuleItem(selectedRowKeys);
    };

    onCancelBatchRemoveAssignedAppModuleItem = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    handlerSelectRow = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
        });
    };


    closeAssignAppModuleItem = _ => {
        const { dispatch } = this.props;
        dispatch({
            type: "tenant/updateState",
            payload: {
                showAssignAppModule: false,
            }
        });
    };

    renderRemoveBtn = (row) => {
        const { loading } = this.props;
        const { removeAppModuleId } = this.state;
        if (loading.effects["tenant/removeAssignedAppModuleItem"] && removeAppModuleId === row.id) {
            return <ExtIcon className="del-loading" type="loading" antd />
        }
        return <ExtIcon className="del" type="export" antd />;
    };

    render() {
        const { selectedRowKeys } = this.state;
        const { tenant, loading } = this.props;
        const { currentTenant, unAssignListData, showAssignAppModule } = tenant;
        const columns = [
            {
                title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
                key: "operation",
                width: 80,
                align: "center",
                dataIndex: "id",
                className: "action",
                required: true,
                render: (text, record) => (
                    <span className={cls("action-box")} onClick={e => e.stopPropagation()}>
                        <Popconfirm
                            placement="topLeft"
                            title={formatMessage({ id: "global.remove.confirm", defaultMessage: "确定要移除吗？" })}
                            onConfirm={_ => this.removeAssignedAppModuleItem([record.id])}
                        >
                            {
                                this.renderRemoveBtn(record)
                            }
                        </Popconfirm>
                    </span>
                )
            },
            {
                title: formatMessage({ id: "global.code", defaultMessage: "代码" }),
                dataIndex: "code",
                width: 200,
                optional: true,
            },
            {
                title: formatMessage({ id: "global.name", defaultMessage: "名称" }),
                dataIndex: "name",
                width: 220,
                required: true,
            },
            {
                title: formatMessage({ id: "global.remark", defaultMessage: "说明" }),
                dataIndex: "remark",
                width: 320,
            }
        ];
        const hasSelected = selectedRowKeys.length > 0;
        const toolBarProps = {
            left: (
                <Fragment>
                    <Button
                        type="primary"
                        icon='plus'
                        onClick={this.showAssignAppModule}
                    >
                        分配应用模块
                    </Button>
                    <Button onClick={this.reloadData}>
                        <FormattedMessage id="global.refresh" defaultMessage="刷新" />
                    </Button>
                    <Drawer
                        placement="top"
                        closable={false}
                        mask={false}
                        height={44}
                        getContainer={false}
                        style={{ position: 'absolute' }}
                        visible={hasSelected}
                    >
                        <Button
                            onClick={this.onCancelBatchRemoveAssignedAppModuleItem}
                            disabled={loading.effects["tenant/removeAssignedAppModuleItem"]}
                        >
                            取消
                         </Button>
                        <Popconfirm
                            title="确定要移除选择的项目吗？"
                            onConfirm={this.batchRemoveAssignedAppModuleItem}
                        >
                            <Button type="danger" loading={loading.effects["tenant/removeAssignedAppModuleItem"]}>
                                批量移除
                         </Button>
                        </Popconfirm>
                        <span className={cls("select")}>
                            {`已选择 ${selectedRowKeys.length} 项`}
                        </span>
                    </Drawer>
                </Fragment>
            )
        };
        const extTableProps = {
            bordered: false,
            toolBar: toolBarProps,
            columns,
            checkbox: true,
            onSelectRow: this.handlerSelectRow,
            selectedRowKeys,
            cascadeParams: { parentId: currentTenant ? currentTenant.id : null },
            onTableRef: ref => this.appModuleTableRef = ref,
            store: {
                url: `${SERVER_PATH}/sei-basic/tenantAppModule/getChildrenFromParentId`
            }
        };
        const unAssignAppModuleItemProps = {
            loading: loading.effects["tenant/getUnAssignedAppModuleItemList"],
            unAssignListData,
            assignAppModuleItem: this.assignAppModuleItem,
            showAssignAppModule,
            closeAssignFeatureItem: this.closeAssignAppModuleItem,
            assigning: loading.effects["tenant/assignAppModuleItem"],
        };
        return (
            <div className={cls(styles['tenant-app-module-box'])}>
                <Card
                    title="可以使用的应用模块"
                    bordered={false}
                >
                    <ExtTable {...extTableProps} />
                </Card>
                <UnAssignAppModuleItem {...unAssignAppModuleItemProps} />
            </div>
        )
    }
}

export default TenantAssignedAppModuleItem;