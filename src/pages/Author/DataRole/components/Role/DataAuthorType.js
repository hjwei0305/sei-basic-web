import React, { Component, Fragment } from "react";
import cls from "classnames";
import { isEqual } from 'lodash';
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Card, Button } from 'antd'
import { ExtTable, ExtIcon, ComboList } from 'suid';
import { constants } from '@/utils';
import Assign from './Assign';
import styles from './DataAuthorType.less';

const { SERVER_PATH } = constants;

class DataAuthorType extends Component {
    static dataAutorTypeTableRef;

    constructor(props) {
        super(props);
        const { currentRole } = props;
        this.state = {
            currentAppModuleId: null,
            currentRole,
        };
    }

    componentDidUpdate(preProps) {
        const { currentRole } = this.props;
        if (!isEqual(preProps.currentRole, currentRole)) {
            this.setState({ currentRole });
        }
    }

    reloadData = () => {
        if (this.dataAutorTypeTableRef) {
            this.dataAutorTypeTableRef.remoteDataRefresh();
        }
    };

    renderAssign = (record) => {
        const { currentRole } = this.state;
        return (
            <span className={cls("action-box")} onClick={e => e.stopPropagation()}>
                <Assign currentDataAuthorType={record} currentRole={currentRole} />
            </span>
        )
    };

    render() {
        const { currentAppModuleId, currentRole } = this.state;
        const columns = [
            {
                title: formatMessage({ id: "global.operation", defaultMessage: "操作" }),
                key: "operation",
                width: 60,
                align: "center",
                dataIndex: "id",
                className: "action",
                required: true,
                render: (_text, record) => this.renderAssign(record),
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
                title: '树形结构',
                dataIndex: "beTree",
                width: 80,
                align: "center",
                required: true,
                render: (text, record) => {
                    if (record.beTree) {
                        return <ExtIcon type="check" antd />;
                    }
                }
            },
            {
                title: '应用模块',
                dataIndex: "appModuleName",
                width: 200,
            },
        ];
        const appModulePros = {
            style: { width: 220 },
            allowClear: true,
            placeholder: '所有应用模块',
            store: {
                url: `${SERVER_PATH}/sei-basic/tenantAppModule/getTenantAppModules`,
            },
            afterSelect: item => {
                this.setState({
                    currentAppModuleId: item.id,
                });
            },
            afterClear: () => {
                this.setState({
                    currentAppModuleId: null,
                });
            },
            reader: {
                name: 'name',
                description: 'code',
            }
        };
        const toolBarProps = {
            layout: {
                leftSpan: 14,
                rightSpan: 10,
            },
            left: (
                <Fragment>
                    <div className='app-module-box'>
                        <span className='label'>应用模块</span>
                        <ComboList {...appModulePros} />
                    </div>
                    <Button onClick={this.reloadData}>
                        <FormattedMessage id="global.refresh" defaultMessage="刷新" />
                    </Button>
                </Fragment >
            )
        };
        const extTableProps = {
            bordered: false,
            toolBar: toolBarProps,
            columns,
            cascadeParams: { roleId: currentRole ? currentRole.id : null },
            onTableRef: ref => this.dataAutorTypeTableRef = ref,
            store: {
                url: `${SERVER_PATH}/sei-basic/dataAuthorizeType/getByDataRole`
            }
        };
        if (currentAppModuleId) {
            extTableProps.store = {
                url: `${SERVER_PATH}/sei-basic/dataAuthorizeType/getByAppModuleAndDataRole`
            }
            extTableProps.cascadeParams.appModuleId = currentAppModuleId;
        }
        return (
            <div className={cls(styles['data-author-type-box'])
            }>
                <Card
                    title="数据权限类型"
                    bordered={false}
                >
                    <ExtTable {...extTableProps} />
                </Card>
            </div >
        )
    }
}

export default DataAuthorType;