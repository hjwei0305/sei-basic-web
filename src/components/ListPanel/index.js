import React, { Component } from "react";
import cls from 'classnames';
import PropTypes from "prop-types";
import isEqual from 'react-fast-compare';
import { cloneDeep } from 'lodash'
import { Input, Pagination, List, Skeleton, Checkbox, Card } from "antd";
import { ScrollBar } from 'seid';
import styles from "./index.less";

const Search = Input.Search;

class ListPanel extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        dataSource: PropTypes.array,
        loading: PropTypes.bool,
        onSelectChange: PropTypes.func,
    };

    static defaultProps = {
        dataSource: [],
        loading: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectAll: false,
            selectIndeterminate: false,
            checkedList: {},
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 30,
                total: 0,
            },
        };
    }

    static allValue = '';
    static data = [];

    componentDidUpdate(prevProps) {
        const { dataSource } = this.props;
        if (!isEqual(prevProps.dataSource, dataSource)) {
            const { pagination } = this.state;
            this.data = [...dataSource];
            this.setState({
                dataSource,
                checkedList: {},
                pagination: {
                    ...pagination,
                    total: dataSource.length,
                },
            });
        }
    };

    handlerSearchChange = (v) => {
        this.allValue = v;
    };

    handlerSearch = () => {
        const { pagination, } = this.state;
        const dataSource = this.getLocalFilterData();
        this.setState({
            selectAll: false,
            selectIndeterminate: false,
            checkedList: {},
            dataSource,
            pagination: {
                ...pagination,
                total: dataSource.length,
            },
        });
    };

    getLocalFilterData = () => {
        let dataSource = [];
        if (this.allValue) {
            const valueKey = this.allValue.toLowerCase();
            dataSource = this.data.filter(ds => ds.name.toLowerCase().indexOf(valueKey) > -1 || ds.code.toLowerCase().indexOf(valueKey) > -1);
        } else {
            dataSource = [...this.data];
        }
        return dataSource;
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
                const dataSource = newData.slice((current - 1) * pageSize, current * pageSize);
                this.setState({
                    dataSource,
                });
            },
        );
    };

    assignFeatureItem = (e) => {
        e && e.stopPropagation();
        const { assignFeatureItem } = this.props;
        const { checkedList } = this.state;
        let childIds = [];
        if (Object.keys(checkedList).length > 0) {
            Object.keys(checkedList).forEach(key => childIds.push(key));
        }
        if (assignFeatureItem) {
            assignFeatureItem(childIds);
        }
    };

    onItemCheck = (e, item) => {
        const { checkedList, dataSource } = this.state;
        let checkedKeys = cloneDeep(checkedList);
        let selectAll = false;
        let selectIndeterminate = false;
        if (e.target.checked) {
            checkedKeys[item.id] = item.id;
        } else {
            delete checkedKeys[item.id];
        }
        const keys = Object.keys(checkedKeys);
        if (keys.length > 0) {
            selectIndeterminate = true;
            if (keys.length === dataSource.length) {
                selectAll = true;
                selectIndeterminate = false;
            }
        }
        this.setState({
            selectIndeterminate,
            selectAll,
            checkedList: checkedKeys
        }, this.handlerSelectChange);
    };

    onSelectAllChange = e => {
        const { checkedList, dataSource } = this.state;
        let checkedKeys = cloneDeep(checkedList);
        let selectAll = false;
        if (e.target.checked) {
            dataSource.forEach(row => {
                checkedKeys[row.id] = row.id;
            });
            selectAll = true;
        } else {
            checkedKeys = {};
        }
        this.setState({
            selectAll,
            selectIndeterminate: false,
            checkedList: checkedKeys
        }, this.handlerSelectChange);
    };

    handlerSelectChange = () => {
        const { onSelectChange } = this.props
        const { checkedList } = this.state;
        if (onSelectChange) {
            onSelectChange(checkedList)
        }
    };

    render() {
        const { loading, title } = this.props;
        const { allValue, dataSource, pagination, checkedList, selectAll, selectIndeterminate } = this.state;
        return (
            <Card
                title={title}
                className={cls(styles['list-panel-box'])}
                bordered={false}
                extra={
                    <Search
                        placeholder="输入名称关键字查询"
                        defaultValue={allValue}
                        onChange={e => this.handlerSearchChange(e.target.value)}
                        onSearch={this.handlerSearch}
                        onPressEnter={this.handlerSearch}
                        style={{ width: 172 }}
                    />
                }
            >
                <div className="list-tool-box">
                    <Checkbox
                        checked={selectAll}
                        indeterminate={selectIndeterminate}
                        onChange={this.onSelectAllChange}
                    >
                        全选
                    </Checkbox>
                    <span className='tool-desc'>{`共 ${dataSource.length} 项`}</span>
                </div>
                <div className="list-body">
                    <ScrollBar>
                        <List
                            dataSource={dataSource}
                            loading={loading}
                            renderItem={item => (
                                <List.Item key={item.id} className={cls({ 'checked': !!checkedList[item.id] })} actions={[]}>
                                    <Skeleton avatar loading={loading} active>
                                        <List.Item.Meta
                                            avatar={
                                                <Checkbox
                                                    checked={!!checkedList[item.id]}
                                                    onChange={(e) => this.onItemCheck(e, item)}
                                                />
                                            }
                                            title={item.name}
                                            description={item.code}
                                        />
                                    </Skeleton>
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
        )
    }
}

export default ListPanel;