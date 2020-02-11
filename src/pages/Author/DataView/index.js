import React, { Component } from "react";
import cls from "classnames";
import { connect } from "dva";
import { Avatar, Card, Row, Col, Empty, Input, List, Skeleton, Tag, Button } from 'antd';
import { ScrollBar, ExtIcon } from 'seid';
import empty from "@/assets/item_empty.svg";
import styles from './index.less';

@connect(({ role, loading }) => ({ role, loading }))
class Role extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listData: [],
        };
    }

    static allValue = '';

    static data = [];

    handlerSearchChange = (v) => {
        this.allValue = v;
    };

    handlerSearch = () => {
        let listData = [];
        if (this.allValue) {
            const valueKey = this.allValue.toLowerCase();
            listData = this.data.filter(ds => ds.name.toLowerCase().indexOf(valueKey) > -1 || ds.code.toLowerCase().indexOf(valueKey) > -1);
        } else {
            listData = [...this.data];
        }
        this.setState({
            listData,
        });
    };

    handlerRoleSelect = (currentRole, e) => {
        e && e.stopPropagation();
        const { dispatch } = this.props;
        dispatch({
            type: 'role/updateState',
            payload: {
                currentRole,
            }
        });
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
        const { loading, role } = this.props;
        const { currentRole } = role;
        const { listData } = this.state;
        const listLoading = loading.effects["role/getDataRoleList"];
        return (
            <div className={cls(styles['role-box'])}>
                <Row gutter={4} className='auto-height'>
                    <Col span={8} className={cls('left-content', 'auto-height')}>
                        <Card
                            title="角色列表"
                            bordered={false}
                            className={cls('list-box', 'auto-height')}
                        >
                            <div className="header-tool-box">
                                <div className='field-box'>
                                    <span className='label'>租户代码</span>
                                    <Input style={{ width: 120 }} />
                                </div>
                                <div className='field-box'>
                                    <span className='label'>用户账号</span>
                                    <Input style={{ width: 120 }} />
                                </div>
                                <Button type='primary'>查询</Button>
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
                                        description="选择角色项进行权限配置"
                                    />
                                </div>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Role;