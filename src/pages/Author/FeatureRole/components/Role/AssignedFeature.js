import React, { Component, Fragment } from "react";
import { connect } from "dva";
import cls from "classnames";
import isEqual from 'react-fast-compare';
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Card, Popconfirm, Button, Tag, Drawer } from 'antd'
import { ExtTable, ExtIcon } from 'seid';
import { constants } from '@/utils';
import UnAssignFeatureItem from './UnAssignFeatureItem';
import styles from './AssignedFeature.less';

const { SERVER_PATH, FEATURE_TYPE } = constants;

@connect(({ featureRole, loading }) => ({ featureRole, loading }))
class FeaturePage extends Component {

    static assignedTableRef;

    constructor(props) {
        super(props);
        this.state = {
            delRowId: null,
            selectedRowKeys: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.featureRole.currentRole, this.props.featureRole.currentRole)) {
            this.setState({
                delRowId: null,
                selectedRowKeys: [],
            });
        }
    }

    reloadData = () => {
        if (this.assignedTableRef) {
            this.assignedTableRef.remoteDataRefresh();
        }
    };

    showAssignFeature = () => {
        const { featureRole, dispatch } = this.props;
        const { currentRole } = featureRole;
        dispatch({
            type: 'featureRole/updateState',
            payload: {
                showAssignFeature: true,
            }
        });
        dispatch({
            type: 'featureRole/getUnAssignedFeatureItemList',
            payload: {
                parentId: currentRole.id,
            }
        });
    };

    assignFeatureItem = (childIds) => {
        const { featureRole, dispatch } = this.props;
        const { currentRole } = featureRole;
        dispatch({
            type: "featureRole/assignFeatureItem",
            payload: {
                parentId: currentRole.id,
                childIds,
            },
            callback: res => {
                if (res.success) {
                    this.reloadData();
                }
            }
        });
    };

    removeAssignFeatureItem = (childIds) => {
        const { featureRole, dispatch } = this.props;
        const { currentRole } = featureRole;
        if (childIds.length === 1) {
            this.setState({
                delRowId: childIds[0],
            });
        }
        dispatch({
            type: 'featureRole/removeAssignedFeatureItem',
            payload: {
                parentId: currentRole.id,
                childIds,
            },
            callback: res => {
                if (res.success) {
                    this.setState({
                        delRowId: null,
                        selectedRowKeys: [],
                    });
                    this.reloadData();
                }
            }
        });
    };

    batchRemoveAssignedFeatureItem = () => {
        const { selectedRowKeys } = this.state;
        this.removeAssignFeatureItem(selectedRowKeys);
    };

    onCancelBatchRemoveAssignedFeatureItem = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    handlerSelectRow = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
        });
    };


    closeAssignFeatureItem = _ => {
        const { dispatch } = this.props;
        dispatch({
            type: "featureRole/updateState",
            payload: {
                showAssignFeature: false,
            }
        });
    };

    renderRemoveBtn = (row) => {
        const { loading } = this.props;
        const { delRowId } = this.state;
        if (loading.effects["featureRole/removeAssignedFeatureItem"] && delRowId === row.id) {
            return <ExtIcon className="del-loading" type="loading" antd />
        }
        return <ExtIcon className="del" type="export" antd />;
    };

    renderFeatureType = (row) => {
        switch (row.featureType) {
            case FEATURE_TYPE.PAGE:
                return <Tag color='cyan'>菜单项</Tag>;
            case FEATURE_TYPE.OPERATE:
                return <Tag color='blue'>操作项</Tag>;
            default:
        }
    };

    render() {
        const { featureRole, loading } = this.props;
        const { currentRole, showAssignFeature, unAssignListData } = featureRole;
        const { selectedRowKeys } = this.state;
        const columns = [
            {
                title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
                key: "operation",
                width: 60,
                align: "center",
                dataIndex: "id",
                className: "action",
                required: true,
                render: (text, record) => (
                    <span className={cls("action-box")} onClick={e => e.stopPropagation()}>
                        <Popconfirm
                            placement="topLeft"
                            title={formatMessage({ id: "global.remove.confirm", defaultMessage: "确定要移除吗？" })}
                            onConfirm={_ => this.removeAssignFeatureItem([record.id])}
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
                title: '类别',
                dataIndex: "featureType",
                width: 80,
                required: true,
                align: 'center',
                render: (_text, record) => this.renderFeatureType(record),
            },
            {
                title: '租户可用',
                dataIndex: "tenantCanUse",
                width: 80,
                align: 'center',
                render: (text, record) => {
                    if (record.tenantCanUse) {
                        return <ExtIcon type="check" antd />;
                    }
                }
            },
            {
                title: '所属应用模块',
                dataIndex: "appModuleName",
                width: 200,
                optional: true,
            },
        ];
        const hasSelected = selectedRowKeys.length > 0;
        const toolBarProps = {
            left: (
                <Fragment>
                    <Button
                        icon='plus'
                        type="primary"
                        loading={loading.effects["featureRole/getUnAssignedFeatureItemList"]}
                        onClick={this.showAssignFeature}
                    >
                        我要分配功能项
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
                            onClick={this.onCancelBatchRemoveAssignedFeatureItem}
                            disabled={loading.effects["featureRole/removeAssignedFeatureItem"]}
                        >
                            取消
                         </Button>
                        <Popconfirm
                            title="确定要移除选择的项目吗？"
                            onConfirm={this.batchRemoveAssignedFeatureItem}
                        >
                            <Button type="danger" loading={loading.effects["featureRole/removeAssignedFeatureItem"]}>
                                批量移除
                         </Button>
                        </Popconfirm>
                        <span className={cls("select")}>
                            {`已选择 ${selectedRowKeys.length} 项`}
                        </span>
                    </Drawer>
                </Fragment >
            )
        };
        const extTableProps = {
            bordered: false,
            toolBar: toolBarProps,
            columns,
            checkbox: true,
            cascadeParams: { parentId: currentRole ? currentRole.id : null },
            onTableRef: ref => this.assignedTableRef = ref,
            onSelectRow: this.handlerSelectRow,
            selectedRowKeys,
            store: {
                url: `${SERVER_PATH}/sei-basic/featureRoleFeature/getChildrenFromParentId`
            }
        };
        const unAssignFeatureItemProps = {
            loading: loading.effects["featureRole/getUnAssignedFeatureItemList"],
            unAssignListData,
            assignFeatureItem: this.assignFeatureItem,
            showAssignFeature,
            closeAssignFeatureItem: this.closeAssignFeatureItem,
            assigning: loading.effects["featureRole/assignFeatureItem"],
        };
        return (
            <div className={cls(styles['assigned-feature-box'])
            }>
                <Card
                    title="角色功能项管理"
                    bordered={false}
                >
                    <ExtTable {...extTableProps} />
                </Card>
                <UnAssignFeatureItem {...unAssignFeatureItemProps} />
            </div >
        )
    }
}

export default FeaturePage;