import React, { Component } from "react";
import { connect } from "dva";
import cls from "classnames";
import isEqual from 'react-fast-compare';
import { formatMessage } from "umi-plugin-react/locale";
import { Avatar, Card, Row, Col, Empty, Input, List, Skeleton, Popconfirm, Tag } from 'antd';
import { ScrollBar, ExtIcon } from 'seid';
import empty from "@/assets/item_empty.svg";
import RoleAdd from './Form/add';
import RoleEdit from './Form/edit';
import ExtAction from './ExtAction';
import { constants } from '@/utils'
import styles from './index.less';

const Search = Input.Search;
const { ROLE_VIEW } = constants;

@connect(({ role, roleGroup, loading }) => ({ role, roleGroup, loading }))
class Role extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            delRoleId: null,
        };
    }

    static allValue = '';

    componentDidMount() {
        this.loadRoleList();
    };

    componentDidUpdate(prevProps) {
        const { role, roleGroup } = this.props;
        if (!isEqual(prevProps.roleGroup.currentRoleGroup, roleGroup.currentRoleGroup)) {
            this.loadRoleList();
        }
        if (!isEqual(prevProps.role.listData, role.listData)) {
            this.setState({
                listData: role.listData,
            });
        }
    };

    loadRoleList = () => {
        const { dispatch, currentRoleGroup } = this.props;
        dispatch({
            type: 'role/getFeatureRoleList',
            payload: {
                roleGroupId: currentRoleGroup.id,
            }
        })
    };

    handlerSearchChange = (v) => {
        this.allValue = v;
    };

    handlerSearch = () => {
        const { role } = this.props;
        let listData = [];
        if (this.allValue) {
            const valueKey = this.allValue.toLowerCase();
            listData = role.listData.filter(ds => ds.name.toLowerCase().indexOf(valueKey) > -1 || ds.code.toLowerCase().indexOf(valueKey) > -1);
        } else {
            listData = [...role.listData];
        }
        this.setState({
            listData,
        });
    };

    saveFeatureRole = (data, handlerPopoverHide) => {
        const { dispatch } = this.props;
        dispatch({
            type: "role/saveFeatureRole",
            payload: {
                ...data
            },
            callback: res => {
                if (res.success) {
                    this.loadRoleList();
                    handlerPopoverHide && handlerPopoverHide();
                }
            }
        });
    };

    delFeatureRole = (data, e) => {
        e && e.stopPropagation();
        const { dispatch } = this.props;
        this.setState({
            delRoleId: data.id
        }, _ => {
            dispatch({
                type: "role/delFeatureRole",
                payload: {
                    id: data.id
                },
                callback: res => {
                    if (res.success) {
                        this.setState({
                            delRoleId: null
                        });
                        this.loadRoleList();
                    }
                }
            });
        });
    };

    handlerRoleSelect = (currentRole, e) => {
        e && e.stopPropagation();
        const { dispatch } = this.props;
        dispatch({
            type: 'role/updateState',
            payload: {
                currentRole
            }
        });
    };

    handlerExtAction = (key, roleData) => {
        console.log(key, roleData);
        switch (key) {
            case ROLE_VIEW.SATION:
                break;
            case ROLE_VIEW.USER:
                break;
            default:
        }
    };


    renderName = (row) => {
        let tag;
        if (row.publicUserType && row.publicOrgId) {
            tag = <Tag color='green' style={{ marginLeft: 8 }}>公共角色</Tag>;
        }
        return (
            <>
                {row.name}
                {tag}
            </>
        );
    };

    renderDescription = (row) => {
        let pubUserType;
        let publicOrg;
        if (row.publicUserType) {
            pubUserType = (
                <div className='field-item info'>
                    <span className='label'>用户类型</span>
                    <span className='value'>{row.userTypeRemark}</span>
                </div>
            );
        }
        if (row.publicOrgId) {
            publicOrg = (
                <div className='field-item info'>
                    <span className='label'>组织机构</span>
                    <span className='value'>{row.publicOrgName}</span>
                </div>
            );
        }
        return (
            <div className='desc-box'>
                <div className='field-item'>{row.code}</div>
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

    render() {
        const { loading, role, roleGroup } = this.props;
        const { currentRole } = role;
        const { listData, delRoleId } = this.state;
        const listLoading = loading.effects["role/getFeatureRoleList"];
        const saving = loading.effects["role/saveFeatureRole"];
        const { currentRoleGroup } = roleGroup;
        return (
            <div className={cls(styles['role-box'])}>
                <Card
                    title="功能角色管理"
                    className={cls('auto-height')}
                    bordered={false}
                >
                    <Row gutter={4} className='auto-height'>
                        <Col span={8} className={cls('left-content', 'auto-height')}>
                            <Card
                                title="角色列表"
                                bordered={false}
                                className={cls('list-box', 'auto-height')}
                            >
                                <div className="header-tool-box">
                                    <RoleAdd
                                        currentRoleGroup={currentRoleGroup}
                                        saving={saving}
                                        saveFeatureRole={this.saveFeatureRole}
                                    />
                                    <Search
                                        placeholder="输入名称关键字查询"
                                        onChange={e => this.handlerSearchChange(e.target.value)}
                                        onSearch={this.handlerSearch}
                                        onPressEnter={this.handlerSearch}
                                        style={{ width: 172 }}
                                    />
                                </div>
                                <div className="role-list-body">
                                    <ScrollBar>
                                        <List
                                            dataSource={listData}
                                            loading={listLoading}
                                            renderItem={item => (
                                                <List.Item
                                                    key={item.id}
                                                    onClick={(e) => this.handlerRoleSelect(item, e)}
                                                    className={cls({
                                                        [cls('row-selected')]: currentRole && item.id === currentRole.id,
                                                    })}
                                                >
                                                    <Skeleton avatar loading={listLoading} active>
                                                        <List.Item.Meta
                                                            avatar={<Avatar icon='user' shape='square' />}
                                                            title={this.renderName(item)}
                                                            description={this.renderDescription(item)}
                                                        />
                                                        <div className='desc'>{item.roleTypeRemark}</div>
                                                        <div className='arrow-box'>
                                                            <ExtIcon type="right" antd />
                                                        </div>
                                                    </Skeleton>
                                                    <div className='tool-action' onClick={e => e.stopPropagation()}>
                                                        <RoleEdit
                                                            currentRoleGroup={currentRoleGroup}
                                                            saving={saving}
                                                            saveFeatureRole={this.saveFeatureRole}
                                                            roleData={item}
                                                        />
                                                        <Popconfirm
                                                            placement="topLeft"
                                                            title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                                                            onConfirm={(e) => this.delFeatureRole(item, e)}
                                                        >
                                                            {
                                                                loading.effects["role/delFeatureRole"] && delRoleId === item.id
                                                                    ? <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
                                                                    : <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
                                                            }
                                                        </Popconfirm>
                                                        <ExtAction
                                                            roleData={item}
                                                            action={this.handlerExtAction}
                                                        />
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </ScrollBar>
                                </div>
                            </Card>
                        </Col>
                        <Col span={16} className={cls("main-content", 'auto-height')}>
                            {
                                currentRole
                                    ? ''
                                    : <div className='blank-empty'>
                                        <Empty
                                            image={empty}
                                            description="可选择角色列表项进行角色功能项管理"
                                        />
                                    </div>
                            }
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default Role;