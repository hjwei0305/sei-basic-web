import React, { Component } from "react";
import { connect } from "dva";
import cls from "classnames";
import isEqual from 'react-fast-compare';
import { Button, Row, Col, Card, Input, Tree, Empty } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { ScrollBar, ExtIcon, ListLoader } from 'seid';
import { constants } from "@/utils";
import empty from "@/assets/item_empty.svg";
import NodeForm from './components/NodeForm';
import MenuMoveModal from './components/MenuMoveModal'
import styles from "./index.less";

const Search = Input.Search;
const { TreeNode } = Tree;
const { APP_MENU_BTN_KEY } = constants;
const childFieldKey = 'children';
const hightLightColor = '#f50';


@connect(({ appMenu, loading }) => ({ appMenu, loading }))
class AppMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            expandedKeys: [],
            selectedKeys: [],
            autoExpandParent: true,
            childParentNode: null,
        };
    }

    static allValue = '';

    componentDidUpdate(preProps) {
        const { appMenu } = this.props;
        if (!isEqual(this.state.treeData, appMenu.treeData)) {
            this.setState({
                treeData: appMenu.treeData,
            }, _ => {
                const { currentNode } = appMenu;
                if (currentNode && currentNode.id) {
                    const { treeData } = this.state;
                    const parentData = this.getCurrentNodeAllParents(treeData, currentNode.id);
                    this.setState({
                        expandedKeys: parentData.map(p => p.id),
                    });
                }
            });
        }
        if (!isEqual(preProps.appMenu.currentNode, appMenu.currentNode) && appMenu.currentNode && appMenu.currentNode.id) {
            const { currentNode } = appMenu;
            this.setState({
                selectedKeys: [currentNode.id],
            });
        }
    };

    addParent = e => {
        e && e.stopPropagation();
        this.setState({
            selectedKeys: []
        });
        this.props.dispatch({
            type: "appMenu/updateState",
            payload: {
                currentNode: {},
            }
        });
    };

    addChild = parent => {
        if (parent) {
            this.setState({ childParentNode: parent });
            const currentNode = {
                parentId: parent.id,
            };
            this.props.dispatch({
                type: "appMenu/updateState",
                payload: {
                    currentNode,
                }
            });
        }
    };

    goBackToChildParent = () => {
        const { childParentNode } = this.state;
        this.props.dispatch({
            type: "appMenu/updateState",
            payload: {
                currentNode: childParentNode,
            }
        });
        this.setState({ childParentNode: null });
    };

    moveChild = currentNode => {
        if (currentNode) {
            this.props.dispatch({
                type: "appMenu/updateState",
                payload: {
                    currentNode,
                    showMove: true,
                }
            });
        }
    };

    submitMove = (data) => {
        const { dispatch } = this.props;
        dispatch({
            type: "appMenu/move",
            payload: {
                ...data,
            },
            callback: res => {
                if (res.success) {
                    dispatch({
                        type: "appMenu/getMenuList"
                    });
                }
            }
        });
    };

    closeMenuMoveModal = () => {
        this.props.dispatch({
            type: "appMenu/updateState",
            payload: {
                showMove: false,
            }
        });
    };

    deleteMenu = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: "appMenu/del",
            payload: {
                id
            },
            callback: res => {
                if (res.success) {
                    dispatch({
                        type: "appMenu/getMenuList"
                    });
                }
            }
        });
    };

    saveMenu = data => {
        const { dispatch } = this.props;
        dispatch({
            type: "appMenu/save",
            payload: {
                ...data
            },
            callback: res => {
                if (res.success) {
                    dispatch({
                        type: "appMenu/getMenuList"
                    });
                    this.setState({ childParentNode: null });
                }
            }
        });
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
        const { expandedKeys: expKeys, treeData } = this.state;
        let newData = [...treeData];
        const expandedKeys = [...expKeys];
        const searchValue = this.allValue;
        if (searchValue) {
            newData = this.filterNodes(searchValue.toLowerCase(), newData, expandedKeys);
        }
        return { treeData: newData, expandedKeys };
    };

    handlerSearchChange = (v) => {
        this.allValue = v;
    };

    handlerSearch = () => {
        const { treeData, expandedKeys } = this.getLocalFilterData();
        this.setState(
            {
                treeData,
                expandedKeys,
                autoExpandParent: true,
            }
        );
    };

    getSelectData = (selectedKey, treeData, currentNode) => {
        for (let i = 0; i < treeData.length; i += 1) {
            let item = treeData[i];
            const childData = item[childFieldKey];
            if (item.id === selectedKey) {
                Object.assign(currentNode, item);
                break;
            }
            if (childData && childData.length > 0) {
                this.getSelectData(selectedKey, childData, currentNode);
            }
        }
    };

    handlerSelect = (selectedKeys, e) => {
        const { treeData } = this.state;
        const { dispatch } = this.props;
        let currentNode = null;
        if (e.selected) {
            currentNode = {};
            this.getSelectData(selectedKeys[0], treeData, currentNode);
        }
        this.setState({
            selectedKeys
        }, _ => {
            dispatch({
                type: "appMenu/updateState",
                payload: {
                    currentNode,
                }
            });
        });
    };

    handlerExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    getCurrentNodeAllParents = (treeData, id) => {
        const temp = [];
        const forFn = function (arr, id) {
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i]
                if (item.id === id) {
                    temp.push(item)
                    forFn(treeData, item.parentId)
                    break;
                } else {
                    if (item.children && item.children.length > 0) {
                        forFn(item.children, id)
                    }
                }
            }
        }
        forFn(treeData, id)
        return temp;
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
                switcherIcon={<ExtIcon type="star" antd style={{ fontSize: 12 }} />}
                title={title}
                key={item.id}
            />;
        });
    };

    render() {
        const { loading, appMenu } = this.props;
        const { allValue, treeData, expandedKeys, selectedKeys, autoExpandParent } = this.state;
        const { currentNode, showMove } = appMenu;
        const nodeFormProps = {
            loading,
            editData: currentNode,
            saveMenu: this.saveMenu,
            addChild: this.addChild,
            deleteMenu: this.deleteMenu,
            moveChild: this.moveChild,
            goBackToChildParent: this.goBackToChildParent,
        };
        const menuMoveModalProps = {
            loading,
            currentNode,
            submitMove: this.submitMove,
            showMove,
            treeData,
            closeMenuMoveModal: this.closeMenuMoveModal,
        };
        return (
            <div className={cls(styles["container-box"])} >
                <Row gutter={4} className='auto-height'>
                    <Col span={8} className='auto-height'>
                        <Card
                            title="应用菜单"
                            bordered={false}
                            className="left-content"
                            extra={
                                <div className="header-tool-box">
                                    <Search
                                        placeholder="输入名称关键字查询"
                                        defaultValue={allValue}
                                        onChange={e => this.handlerSearchChange(e.target.value)}
                                        onSearch={this.handlerSearch}
                                        onPressEnter={this.handlerSearch}
                                        style={{ width: 172 }}
                                    />
                                    <Button
                                        icon="plus"
                                        onClick={e => this.addParent(e)}
                                    >
                                        根菜单
                                    </Button>
                                </div>
                            }
                        >
                            <ScrollBar>
                                {
                                    loading.effects["appMenu/getMenuList"]
                                        ? <ListLoader />
                                        : <Tree
                                            blockNode
                                            autoExpandParent={autoExpandParent}
                                            selectedKeys={selectedKeys}
                                            expandedKeys={expandedKeys}
                                            switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
                                            onSelect={this.handlerSelect}
                                            onExpand={this.handlerExpand}
                                        >
                                            {this.renderTreeNodes(treeData)}
                                        </Tree>
                                }
                            </ScrollBar>
                        </Card>
                    </Col>
                    <Col span={16} className={cls("main-content")}>
                        {
                            currentNode
                                ? <NodeForm {...nodeFormProps} />
                                : <div className='blank-empty'>
                                    <Empty
                                        image={empty}
                                        description="可选择左侧菜单节点获得相关的操作"
                                    />
                                </div>

                        }
                    </Col>
                </Row>
                <MenuMoveModal {...menuMoveModalProps} />
            </div>
        )
    }
}
export default AppMenu