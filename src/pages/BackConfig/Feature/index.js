import React, { Component } from "react";
import { connect } from "dva";
import cls from "classnames";
import isEqual from 'react-fast-compare';
import { formatMessage } from "umi-plugin-react/locale";
import { Row, Col, Input, Empty, Popconfirm, Tooltip } from "antd";
import { ExtIcon, ListCard } from 'suid';
import empty from "@/assets/item_empty.svg";
import GroupAdd from './components/FeatureGroupForm/Add';
import GroupEdit from './components/FeatureGroupForm/Edit';
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
        };
    }

    componentDidUpdate() {
        const { featureGroup } = this.props;
        if (!isEqual(this.state.listData, featureGroup.listData)) {
            const { listData } = featureGroup;
            this.setState({
                listData,
            });
        }
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

    handlerGroupSelect = (keys, items) => {
        const { dispatch } = this.props;
        const currentFeatureGroup = keys.length === 1 ? items[0] : null;
        dispatch({
            type: 'featureGroup/updateState',
            payload: {
                currentFeatureGroup,
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

    handlerSearchChange = v => {
        this.listCardRef.handlerSearchChange(v);
    };

    handlerSearch = () => {
        this.listCardRef.handlerSearch();
    };

    renderCustomTool = ({ total }) => {
        const { loading } = this.props;
        const saving = loading.effects["featureGroup/saveFeatureGroup"];
        return (
            <>
                <GroupAdd
                    saving={saving}
                    saveFeatureGroup={this.saveFeatureGroup}
                />
                <div>
                    <span style={{ marginRight: 8 }}>{`共 ${total} 项`}</span>
                    <Tooltip
                        trigger={["hover"]}
                        title='输入代码、名称、应用模块关键字查询'
                        placement="top"
                    >
                        <Search
                            placeholder="输入代码、名称、应用模块关键字查询"
                            onChange={e => this.handlerSearchChange(e.target.value)}
                            onSearch={this.handlerSearch}
                            onPressEnter={this.handlerSearch}
                            style={{ width: 220 }}
                        />
                    </Tooltip>
                </div>
            </>
        );
    };

    renderItemAction = (item) => {
        const { loading } = this.props;
        const { delGroupId } = this.state;
        const saving = loading.effects["featureGroup/saveFeatureGroup"];
        return (
            <>
                <div className='tool-action' onClick={e => e.stopPropagation()}>
                    <GroupEdit
                        saving={saving}
                        saveFeatureGroup={this.saveFeatureGroup}
                        groupData={item}
                    />
                    <Popconfirm
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
            </>
        )
    };

    renderTitle = (item) => {
        return (
            <>
                {item.name}
                <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>{item.code}</span>
            </>
        )
    };

    render() {
        const { loading, featureGroup } = this.props;
        const { currentFeatureGroup } = featureGroup;
        const { listData } = this.state;
        const listLoading = loading.effects["featureGroup/queryFeatureGroupList"];
        const selectedKeys = currentFeatureGroup ? [currentFeatureGroup.id] : [];
        const featureGroupprops = {
            className: 'left-content',
            title: '功能组',
            showSearch: false,
            loading: listLoading,
            dataSource: listData,
            onSelectChange: this.handlerGroupSelect,
            customTool: this.renderCustomTool,
            onListCardRef: ref => (this.listCardRef = ref),
            searchProperties: ['code', 'name', 'appModuleName'],
            selectedKeys,
            itemField: {
                title: this.renderTitle,
                description: item => item.appModuleName,
            },
            itemTool: this.renderItemAction,
        };
        const pageFeatureProps = {
            currentFeatureGroup,
        };
        return (
            <div className={cls(styles["container-box"])} >
                <Row gutter={8} className='auto-height'>
                    <Col span={7} className='auto-height'>
                        <ListCard {...featureGroupprops} />
                    </Col>
                    <Col span={17} className={cls("main-content", 'auto-height')}>
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