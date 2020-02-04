import React, { Component } from "react";
import { connect } from "dva";
import cls from "classnames";
import isEqual from 'react-fast-compare';
import { formatMessage } from "umi-plugin-react/locale";
import { Row, Col, Card, Input, Empty, Pagination, List, Skeleton, Popconfirm } from "antd";
import { ScrollBar, ExtIcon } from 'seid';
import empty from "@/assets/item_empty.svg";
import GroupAdd from './components/FeatureGroupForm/add';
import GroupEdit from './components/FeatureGroupForm/edit';
import PageFeature from './components/FeaturePage';
import styles from "./index.less";

const Search = Input.Search;


@connect(({ featureGroup, loading }) => ({ featureGroup, loading }))
class Feature extends Component {

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
        const { featureGroup } = this.props;
        if (!isEqual(this.data, featureGroup.listData)) {
            const { pagination } = this.state;
            const { listData } = featureGroup;
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
        const { pagination, } = this.state;
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

    reloadFeatureGroupData = _ => {
        const { dispatch } = this.props;
        dispatch({
            type: "featureGroup/queryFeatureGroupList"
        });
    };

    saveFeatureGroup = (data, handlerPopoverHide) => {
        const { dispatch } = this.props;
        dispatch({
            type: "featureGroup/saveFeatureGroup",
            payload: {
                ...data
            },
            callback: res => {
                if (res.success) {
                    dispatch({
                        type: "featureGroup/queryFeatureGroupList"
                    });
                    handlerPopoverHide && handlerPopoverHide();
                }
            }
        });
    };

    delFeatureGroup = (data, e) => {
        e && e.stopPropagation();
        const { dispatch } = this.props;
        this.setState({
            delGroupId: data.id
        }, _ => {
            dispatch({
                type: "featureGroup/delFeatureGroup",
                payload: {
                    id: data.id
                },
                callback: res => {
                    if (res.success) {
                        this.setState({
                            delGroupId: null
                        });
                        this.reloadFeatureGroupData();
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

    handlerGroupSelect = (currentFeatureGroup, e) => {
        e && e.stopPropagation();
        const { dispatch } = this.props;
        dispatch({
            type: 'featureGroup/updateState',
            payload: {
                currentFeatureGroup
            }
        });
        dispatch({
            type: "feature/updateState",
            payload: {
                showFeatureItem: false,
                currentPageRow: null
            }
        });
    };

    render() {
        const { loading, featureGroup } = this.props;
        const { currentFeatureGroup } = featureGroup;
        const { allValue, listData, pagination, delGroupId } = this.state;
        const listLoading = loading.effects["featureGroup/queryFeatureGroupList"];
        const saving = loading.effects["featureGroup/saveFeatureGroup"];
        const pageFeatureProps = {
            currentFeatureGroup,
        };
        return (
            <div className={cls(styles["container-box"])} >
                <Row gutter={4} className='auto-height'>
                    <Col span={6} className='auto-height'>
                        <Card
                            title="功能组"
                            bordered={false}
                            className="left-content"
                        >
                            <div className="header-tool-box">
                                <GroupAdd
                                    saving={saving}
                                    saveFeatureGroup={this.saveFeatureGroup}
                                />
                                <Search
                                    placeholder="输入名称关键字查询"
                                    defaultValue={allValue}
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
                                                    [cls('row-selected')]: currentFeatureGroup && item.id === currentFeatureGroup.id,
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
                                                    <GroupEdit
                                                        saving={saving}
                                                        saveFeatureGroup={this.saveFeatureGroup}
                                                        groupData={item}
                                                    />
                                                    <Popconfirm
                                                        placement="topLeft"
                                                        title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                                                        onConfirm={(e) => this.delFeatureGroup(item, e)}
                                                    >
                                                        {
                                                            loading.effects["featureGroup/delFeatureGroup"] && delGroupId === item.id
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
                    <Col span={18} className={cls("main-content")}>
                        {
                            currentFeatureGroup
                                ? <PageFeature {...pageFeatureProps} />
                                : <div className='blank-empty'>
                                    <Empty
                                        image={empty}
                                        description="可选择左边列表项进行相应的操作"
                                    />
                                </div>

                        }
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Feature