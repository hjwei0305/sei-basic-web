import React, { PureComponent } from "react";
import cls from "classnames";
import { connect } from "dva";
import { Row, Col, Empty, Input, message, Tag, Button, Tooltip } from 'antd';
import { ListCard } from 'suid';
import empty from "@/assets/item_empty.svg";
import DataAuthorType from './components/DataAuthorType';
import styles from './index.less';

@connect(({ dataView, loading }) => ({ dataView, loading }))
class DataView extends PureComponent {

    static account = '';

    handlerAccountChange = (v) => {
        this.account = v;
    };

    getRoleList = (e) => {
        e && e.stopPropagation();
        if (this.account) {
            const { dispatch } = this.props;
            dispatch({
                type: 'dataView/getRoleList',
                payload: {
                    account: this.account,
                }
            });
        } else {
            message.warning('请输入用户账号');
        }
    };

    handlerRoleSelect = (keys, items) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dataView/updateState',
            payload: {
                currentRoleId: keys[0],
            }
        });
    };

    renderRoleName = (item) => {
        let tag;
        if (item.publicUserType && item.publicOrgId) {
            tag = <Tag color='green' style={{ marginLeft: 8 }}>公共角色</Tag>;
        }
        return (
            <>
                {item.name}
                {tag}
            </>
        );
    };

    renderRoleDescription = (item) => {
        let pubUserType;
        let publicOrg;
        if (item.publicUserType) {
            pubUserType = (
                <div className='field-item info'>
                    <span className='label'>用户类型</span>
                    <span className='value'>{item.userTypeRemark}</span>
                </div>
            );
        }
        if (item.publicOrgId) {
            publicOrg = (
                <div className='field-item info'>
                    <span className='label'>组织机构</span>
                    <span className='value'>{item.publicOrgName}</span>
                </div>
            );
        }
        return (
            <div className='desc-box'>
                <div className='field-item'>{item.code}</div>
                {
                    publicOrg || pubUserType
                        ? <div className='public-box'>
                            {pubUserType}
                            {publicOrg}
                        </div>
                        : null
                }
            </div>
        );
    };

    renderCustomTool = ({ total }) => {
        const { loading } = this.props;
        const roleListLoading = loading.effects["dataView/getRoleList"];
        return (
            <>
                <span style={{ marginLeft: 8 }}>{`共 ${total} 项`}</span>
                <div>
                    <Tooltip
                        trigger={["hover"]}
                        title='用户账号'
                        placement="top"
                    >
                        <Input
                            style={{ width: 220, marginRight: 8 }}
                            placeholder='输入查询的用户账号'
                            onChange={e => this.handlerAccountChange(e.target.value)}
                            onPressEnter={e => this.getRoleList(e)}
                        />
                    </Tooltip>
                    <Button
                        type='primary'
                        icon='search'
                        loading={roleListLoading}
                        onClick={e => this.getRoleList(e)}
                    >
                        查询
                </Button>
                </div>
            </>
        );
    };

    render() {
        const { loading, dataView } = this.props;
        const { currentRoleId, roleList } = dataView;
        const roleListLoading = loading.effects["dataView/getRoleList"];
        const roleListProps = {
            title: '用户角色列表',
            dataSource: roleList,
            showSearch: false,
            loading: roleListLoading,
            onSelectChange: this.handlerRoleSelect,
            customTool: this.renderCustomTool,
            itemField: {
                title: this.renderRoleName,
                description: this.renderRoleDescription,
            }
        };
        return (
            <div className={cls(styles['role-box'])}>
                <Row gutter={4} className='auto-height'>
                    <Col span={7} className={cls('left-content', 'auto-height')}>
                        <ListCard {...roleListProps} />
                    </Col>
                    <Col span={17} className={cls("main-content", 'auto-height')}>
                        {
                            currentRoleId
                                ? <DataAuthorType currentRoleId={currentRoleId} />
                                : <div className='blank-empty'>
                                    <Empty
                                        image={empty}
                                        description="选择相应的角色项显示权限"
                                    />
                                </div>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DataView;