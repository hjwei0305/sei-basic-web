import React, { Component } from "react";
import { connect } from "dva";
import cls from "classnames";
import isEqual from 'react-fast-compare';
import { formatMessage } from "umi-plugin-react/locale";
import { Row, Col, Card, Input, Empty, Pagination, List, Skeleton, Popconfirm } from "antd";
import { ScrollBar, ExtIcon } from 'seid';
import empty from "@/assets/empty.svg";
import RoleGroupAdd from './components/RoleGroupForm/Add';
import RoleGroupEdit from './components/RoleGroupForm/Edit';
import Role from './components/Role';
import styles from "./index.less";

const Search = Input.Search;


@connect(({ featureRoleGroup, loading }) => ({ featureRoleGroup, loading }))
class FeatureRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            delGroupId: null,
            pagination: {
                current: 1,
                pageSize: 30,
                total: 0,
            },
        };
    }

    static allValue = '';
    static data = [];

    componentDidUpdate() {
        const { featureRoleGroup } = this.props;
        if (!isEqual(this.data, featureRoleGroup.listData)) {
            const { pagination } = this.state;
            const { listData } = featureRoleGroup;
            this.data = [...listData];
            this.setState({
                listData,
                pagination: {
                    ...pagination,
                    total: listData.length,
                },
            });
        }
    };

    handlerSearchChange = (v) => {
        this.allValue = v;
    };

    handlerSearch = () => {
        const { pagination } = this.state;
        let listData = [];
        if (this.allValue) {
            const valueKey = this.allValue.toLowerCase();
            listData = this.data.filter(ds => ds.name.toLowerCase().indexOf(valueKey) > -1 || ds.code.toLowerCase().indexOf(valueKey) > -1);
        } else {
            listData = [...this.data];
        }
        this.setState({
            listData,
            pagination: {
                ...pagination,
                total: listData.length,
            },
        });
    };

    reloadRoleGroupData = _ => {
        const { dispatch } = this.props;
        dispatch({
            type: "featureRoleGroup/getRoleGroupList"
        });
    };

    saveRoleGroup = (data, handlerPopoverHide) => {
        const { dispatch } = this.props;
        dispatch({
            type: "featureRoleGroup/saveRoleGroup",
            payload: {
                ...data
            },
            callback: res => {
                if (res.success) {
                    dispatch({
                        type: "featureRoleGroup/getRoleGroupList"
                    });
                    handlerPopoverHide && handlerPopoverHide();
                }
            }
        });
    };

    delRoleGroup = (data, e) => {
        e && e.stopPropagation();
        const { dispatch } = this.props;
        this.setState({
            delGroupId: data.id
        }, _ => {
            dispatch({
                type: "featureRoleGroup/delRoleGroup",
                payload: {
                    id: data.id
                },
                callback: res => {
                    if (res.success) {
                        this.setState({
                            delGroupId: null
                        });
                        this.reloadRoleGroupData();
                    }
                }
            });
        });
    };

    handlerPageChange = (current, pageSize) => {
        const { pagination } = this.state;
        this.setState(
            {
                pagination: {
                    ...pagination,
                    current,
                    pageSize,
                },
            },
            () => {
                const newData = this.getLocalFilterData();
                const listData = newData.slice((current - 1) * pageSize, current * pageSize);
                this.setState({
                    listData,
                });
            },
        );
    };

    handlerGroupSelect = (currentRoleGroup, e) => {
        e && e.stopPropagation();
        const { dispatch } = this.props;
        dispatch({
            type: 'featureRoleGroup/updateState',
            payload: {
                currentRoleGroup
            }
        });
        dispatch({
            type: "role/updateState",
            payload: {
                showAssignFeature: false,
                currentRole: null
            }
        });
    };

    render() {
        const { loading, featureRoleGroup } = this.props;
        const { currentRoleGroup } = featureRoleGroup;
        const { listData, pagination, delGroupId } = this.state;
        const listLoading = loading.effects["featureRoleGroup/getRoleGroupList"];
        const saving = loading.effects["featureRoleGroup/saveRoleGroup"];
        const roleProps = {
            currentRoleGroup,
        };
        return (
            <div className={cls(styles["container-box"])} >
                <Row gutter={4} className='auto-height'>
                    <Col span={4} className='auto-height'>
                        <Card
                            title="角色组"
                            bordered={false}
                            className="left-content"
                        >
                            <div className="header-tool-box">
                                <RoleGroupAdd
                                    saving={saving}
                                    saveRoleGroup={this.saveRoleGroup}
                                />
                                <Search
                                    placeholder="输入名称关键字查询"
                                    onChange={e => this.handlerSearchChange(e.target.value)}
                                    onSearch={this.handlerSearch}
                                    onPressEnter={this.handlerSearch}
                                    style={{ width: 172 }}
                                />
                            </div>
                            <div className="list-body">
                                <ScrollBar>
                                    <List
                                        dataSource={listData}
                                        loading={listLoading}
                                        renderItem={item => (
                                            <List.Item
                                                key={item.id}
                                                onClick={(e) => this.handlerGroupSelect(item, e)}
                                                className={cls({
                                                    [cls('row-selected')]: currentRoleGroup && item.id === currentRoleGroup.id,
                                                })}
                                            >
                                                <Skeleton loading={listLoading} active>
                                                    <List.Item.Meta
                                                        title={item.name}
                                                        description={item.code}
                                                    />
                                                    <div className='desc'>{item.appModuleName}</div>
                                                    <div className='arrow-box'>
                                                        <ExtIcon type="right" antd />
                                                    </div>
                                                </Skeleton>
                                                <div className='tool-action' onClick={e => e.stopPropagation()}>
                                                    <RoleGroupEdit
                                                        saving={saving}
                                                        saveRoleGroup={this.saveRoleGroup}
                                                        groupData={item}
                                                    />
                                                    <Popconfirm
                                                        placement="topLeft"
                                                        title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                                                        onConfirm={(e) => this.delRoleGroup(item, e)}
                                                    >
                                                        {
                                                            loading.effects["featureRoleGroup/delRoleGroup"] && delGroupId === item.id
                                                                ? <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
                                                                : <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
                                                        }
                                                    </Popconfirm>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </ScrollBar>
                            </div>
                            <div className="list-page-bar">
                                <Pagination
                                    simple
                                    onChange={this.handlerPageChange}
                                    {...pagination}
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col span={20} className={cls("main-content", 'auto-height','role-main')}>
                        {
                            currentRoleGroup
                                ? <Role {...roleProps} />
                                : <div className='blank-empty'>
                                    <Empty
                                        image={empty}
                                        description="可选择左边列表角色组操作"
                                    />
                                </div>

                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
export default FeatureRole