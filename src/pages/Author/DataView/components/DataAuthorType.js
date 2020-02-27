import React, { Component } from "react";
import cls from "classnames";
import { isEqual } from 'lodash';
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Card, Button } from 'antd'
import { ExtTable, ExtIcon } from 'seid';
import { constants } from '@/utils';
import Assign from './Assign';
import styles from './DataAuthorType.less';

const { SERVER_PATH } = constants;

class DataAuthorType extends Component {

    static dataAutorTypeTableRef;

    constructor(props) {
        super(props);
        const { currentRoleId } = props;
        this.state = {
            currentRoleId,
        };
    }

    componentDidUpdate(preProps) {
        const { currentRoleId } = this.props;
        if (!isEqual(preProps.currentRoleId, currentRoleId)) {
            this.setState({ currentRoleId });
        }
    }

    reloadData = () => {
        if (this.dataAutorTypeTableRef) {
            this.dataAutorTypeTableRef.remoteDataRefresh();
        }
    };

    renderAssign = (record) => {
        const { currentRoleId } = this.state;
        return (
            <span className={cls("action-box")} onClick={e => e.stopPropagation()}>
                <Assign currentDataAuthorType={record} currentRoleId={currentRoleId} />
            </span>
        )
    };

    render() {
        const { currentRoleId } = this.props;
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
                    if (record.authorizeEntityTypeBeTree) {
                        return <ExtIcon type="check" antd />;
                    }
                }
            },
            {
                title: '应用模块',
                dataIndex: "authorizeEntityTypeAppModuleName",
                width: 200,
            },
        ];
        const toolBarProps = {
            layout: {
                leftSpan: 14,
                rightSpan: 10,
            },
            left: (
                <Button onClick={this.reloadData}>
                    <FormattedMessage id="global.refresh" defaultMessage="刷新" />
                </Button>
            )
        };
        const extTableProps = {
            bordered: false,
            toolBar: toolBarProps,
            columns,
            cascadeParams: { roleId: currentRoleId ? currentRoleId : null },
            searchPlaceHolder: '可输入名称或应用模块关键字查询',
            searchProperties: ['name', 'authorizeEntityTypeAppModuleName'],
            searchWidth: 260,
            onTableRef: ref => this.dataAutorTypeTableRef = ref,
            store: {
                url: `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getAuthorizeTypesByRoleId`
            }
        };
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