import React, { Component } from "react";
import cls from 'classnames';
import PropTypes from "prop-types";
import isEqual from 'react-fast-compare';
import { Input, Tree, Card, Empty } from "antd";
import { ScrollBar, ListLoader, ExtIcon } from 'suid';
import styles from "./index.less";

const Search = Input.Search;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

class TreePanel extends Component {

    static propTypes = {
        title: PropTypes.string,
        dataSource: PropTypes.array,
        loading: PropTypes.bool,
        onSelectChange: PropTypes.func,
        className: PropTypes.string,
        checkable: PropTypes.bool,
        checkStrictly: PropTypes.bool,
    };

    static defaultProps = {
        dataSource: [],
        loading: false,
        checkable: true,
        checkStrictly: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            expandedKeys: [],
            checkedKeys: [],
            autoExpandParent: true,
        };
    }

    static allValue = '';

    componentDidUpdate() {
        const { dataSource } = this.props;
        if (!isEqual(this.state.dataSource, dataSource)) {
            this.setState({
                dataSource,
                expandedKeys: [],
                checkedKeys: [],
                autoExpandParent: true,
            });
        }
    };

    filterNodes = (valueKey, treeData, expandedKeys) => {
        const newArr = [];
        treeData.forEach(treeNode => {
            const nodeChildren = treeNode[childFieldKey];
            const fieldValue = treeNode.name;
            if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
                newArr.push(treeNode);
                expandedKeys.push(treeNode.id);
            } else if (nodeChildren && nodeChildren.length > 0) {
                const ab = this.filterNodes(valueKey, nodeChildren, expandedKeys);
                const obj = {
                    ...treeNode,
                    [childFieldKey]: ab,
                };
                if (ab && ab.length > 0) {
                    newArr.push(obj);
                }
            }
        });
        return newArr;
    };

    getLocalFilterData = () => {
        const { expandedKeys: expKeys, dataSource } = this.state;
        let newData = [...dataSource];
        const expandedKeys = [...expKeys];
        const searchValue = this.allValue;
        if (searchValue) {
            newData = this.filterNodes(searchValue.toLowerCase(), newData, expandedKeys);
        }
        return { dataSource: newData, expandedKeys };
    };

    handlerSearchChange = (v) => {
        this.allValue = v;
    };

    handlerSearch = () => {
        const { dataSource, expandedKeys } = this.getLocalFilterData();
        this.setState(
            {
                dataSource,
                expandedKeys,
                autoExpandParent: true,
            }
        );
    };

    handlerExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    handlerCheckedChange = (checkedKeys) => {
        this.setState({ checkedKeys }, () => {
            const { onSelectChange } = this.props
            if (onSelectChange) {
                const { checked } = checkedKeys;
                onSelectChange(checked)
            }
        });
    };

    renderTreeNodes = (treeData) => {
        const searchValue = this.allValue || '';
        return treeData.map(item => {
            const readerValue = item.name;
            const readerChildren = item[childFieldKey];
            const i = readerValue.toLowerCase().indexOf(searchValue.toLowerCase());
            const beforeStr = readerValue.substr(0, i);
            const afterStr = readerValue.substr(i + searchValue.length);
            const title =
                i > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: hightLightColor }}>{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                        <span>{readerValue}</span>
                    );
            if (readerChildren && readerChildren.length > 0) {
                return (
                    <TreeNode
                        title={title}
                        key={item.id}
                    >
                        {this.renderTreeNodes(readerChildren)}
                    </TreeNode>
                );
            }
            return <TreeNode
                switcherIcon={<ExtIcon type="dian" style={{ fontSize: 12 }} />}
                title={title}
                key={item.id}
            />;
        });
    };

    renderTree = () => {
        const { dataSource, autoExpandParent, checkedKeys, expandedKeys } = this.state;
        const { checkable, checkStrictly } = this.props;
        if (dataSource.length === 0) {
            return (
                <div className='blank-empty'>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂时没有数据"
                    />
                </div>
            )
        }
        return (
            <Tree
                checkable={checkable}
                checkStrictly={checkStrictly}
                autoExpandParent={autoExpandParent}
                expandedKeys={expandedKeys}
                switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
                onCheck={this.handlerCheckedChange}
                checkedKeys={checkedKeys}
                onExpand={this.handlerExpand}
            >
                {this.renderTreeNodes(dataSource)}
            </Tree>
        )
    };

    render() {
        const { loading, title, className } = this.props;
        const { allValue } = this.state;
        return (
            <Card
                title={title}
                className={cls(styles['tree-panel-box'], className)}
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
                <div className="tree-body">
                    <ScrollBar>
                        {
                            loading
                                ? <ListLoader />
                                : this.renderTree()
                        }
                    </ScrollBar>
                </div>
            </Card>
        )
    }
}

export default TreePanel;