import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, trim, } from 'lodash';
import { Card, Input, Tree, Empty, Layout, Tag } from 'antd';
import { ScrollBar, ExtIcon, ListLoader } from 'suid';
import empty from '@/assets/item_empty.svg';
import NodeForm from './components/NodeForm';
import styles from './index.less';
import MoveNodeDrawer from './components/MoveNodeDrawer';

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';
const { Sider, Content } = Layout;

@connect(({ organization, loading }) => ({ organization, loading }))
class Organization extends Component {
  static allValue = '';

  static data = [];

  constructor(props) {
    super(props);
    const { organization } = props;
    const { currentNode } = organization;
    this.state = {
      treeData: [],
      expandedKeys: [],
      selectedKeys: currentNode ? [currentNode.id] : [],
      autoExpandParent: true,
      childParentNode: null,
    };
  }

  componentDidUpdate(preProps) {
    const { organization, dispatch } = this.props;
    const { treeData: dataSource } = organization;
    if (!isEqual(preProps.organization.treeData, dataSource)) {
      this.data = [...dataSource];
      this.setState(
        {
          treeData: dataSource,
        },
        () => {
          const { currentNode } = organization;
          let expandedKeys = [];
          const { selectedKeys } = this.state;
          let keys = [...selectedKeys];
          if (currentNode && currentNode.id) {
            const { treeData } = this.state;
            const parentData = this.getCurrentNodeAllParents(treeData, currentNode.id);
            expandedKeys = parentData.map(p => p.id);
          } else {
            expandedKeys = dataSource.map(p => p.id);
            keys = expandedKeys.filter((_e, idx) => idx === 0);
            dispatch({
              type: 'organization/updateState',
              payload: {
                currentNode: keys.length > 0 ? dataSource[0] : null,
              },
            });
          }
          this.setState({ expandedKeys, selectedKeys: keys });
        },
      );
    }
    if (
      !isEqual(preProps.organization.currentNode, organization.currentNode) &&
      organization.currentNode &&
      organization.currentNode.id
    ) {
      const { currentNode } = organization;
      this.setState({
        selectedKeys: [currentNode.id],
      });
    }
  }

  addParent = e => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    this.setState({
      selectedKeys: [],
    });
    dispatch({
      type: 'organization/updateState',
      payload: {
        currentNode: {},
      },
    });
  };

  moveChild = (e) => {
    e && e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/updateState',
      payload: {
        moveVisible: true,
      },
    });
  }

  addChild = parent => {
    if (parent) {
      this.setState({ childParentNode: parent });
      const currentNode = {
        parentId: parent.id,
        parentName: parent.name,
        [childFieldKey]: [],
      };
      const { dispatch } = this.props;
      dispatch({
        type: 'organization/updateState',
        payload: {
          currentNode,
        },
      });
    }
  };

  goBackToChildParent = () => {
    const { childParentNode } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/updateState',
      payload: {
        currentNode: childParentNode,
      },
    });
    this.setState({ childParentNode: null });
  };

  deleteOrg = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/del',
      payload: {
        id,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'organization/getOrgList',
          });
        }
      },
    });
  };

  saveOrg = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/save',
      payload: {
        ...data,
      },
      callback: res => {
        if (res.success) {
          dispatch({
            type: 'organization/getOrgList',
          });
          this.setState({ childParentNode: null });
        }
      },
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
    const { expandedKeys: expKeys } = this.state;
    let newData = [...this.data];
    const expandedKeys = [...expKeys];
    const searchValue = this.allValue;
    if (searchValue) {
      newData = this.filterNodes(searchValue.toLowerCase(), newData, expandedKeys);
    }
    return { treeData: newData, expandedKeys };
  };

  handlerSearchChange = v => {
    this.allValue = trim(v);
  };

  handlerSearch = () => {
    const { treeData, expandedKeys } = this.getLocalFilterData();
    this.setState({
      treeData,
      expandedKeys,
      autoExpandParent: true,
    });
  };

  getSelectData = (selectedKey, treeData, currentNode) => {
    for (let i = 0; i < treeData.length; i += 1) {
      const item = treeData[i];
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
    this.setState(
      {
        selectedKeys,
      },
      () => {
        dispatch({
          type: 'organization/updateState',
          payload: {
            currentNode,
          },
        });
      },
    );
  };

  handlerExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  handleCloseMoveDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/updateState',
      payload: {
        moveVisible: false,
      },
    });
  }

  handleMoveNode = (targetNode) => {
    const { organization, dispatch } = this.props;
    const { currentNode, } = organization;
    dispatch({
      type: 'organization/move',
      payload: {
        nodeId: currentNode.id,
        targetParentId: targetNode.id,
      },
    });
  }

  getCurrentNodeAllParents = (treeData, id) => {
    const temp = [];
    const forFn = (arr, tempId) => {
      for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        if (item.id === tempId) {
          temp.push(item);
          forFn(treeData, item.parentId);
          break;
        } else if (item.children && item.children.length > 0) {
          forFn(item.children, tempId);
        }
      }
    };
    forFn(treeData, id);
    return temp;
  };

  renderNodeTitle = (title, frozen) => {
    if (frozen) {
      return (
        <>
          {title}
          <Tag color="red" style={{ marginLeft: 8 }}>
            已冻结
          </Tag>
        </>
      );
    }
    return title;
  };

  renderTreeNodes = treeData => {
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
          <TreeNode title={this.renderNodeTitle(title, item.frozen)} key={item.id}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          switcherIcon={<ExtIcon type="dian" style={{ fontSize: 12 }} />}
          title={this.renderNodeTitle(title, item.frozen)}
          key={item.id}
        />
      );
    });
  };

  excludeNode = (treeData, excludeNodeId) => {
    const tempData = treeData.map(treeNode => {
      if(treeNode.id !== excludeNodeId) {
        const node = { ...treeNode };
        if(node.children && node.children.length) {
          node.children = this.excludeNode(node.children, excludeNodeId);
        }

        return node;
      }
      return null;
    });

    return tempData.filter(node => !!node);
  }

  render() {
    const { loading, organization } = this.props;
    const { allValue, treeData, expandedKeys, selectedKeys, autoExpandParent } = this.state;
    const { currentNode, moveVisible, } = organization;
    const nodeFormProps = {
      loading,
      editData: currentNode,
      saveOrg: this.saveOrg,
      addChild: this.addChild,
      deleteOrg: this.deleteOrg,
      moveChild: this.moveChild,
      goBackToChildParent: this.goBackToChildParent,

    };

    const moveNodeProps = {
      title: `移动节点【${currentNode && currentNode.name}】到`,
      treeData: this.excludeNode(treeData, currentNode && currentNode.id),
      visible: moveVisible,
      onClose: this.handleCloseMoveDrawer,
      onMove: this.handleMoveNode,
      saveing: loading.effects['organization/move'],
    };
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={380} className="auto-height" theme="light">
            <Card title="组织机构" bordered={false} className="left-content">
              <div className="header-tool-box">
                <Search
                  placeholder="输入名称关键字查询"
                  defaultValue={allValue}
                  onChange={e => this.handlerSearchChange(e.target.value)}
                  onSearch={this.handlerSearch}
                  onPressEnter={this.handlerSearch}
                />
              </div>
              <div className="tree-body">
                <ScrollBar>
                  {loading.effects['organization/getOrgList'] ? (
                    <ListLoader />
                  ) : (
                    <Tree
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
                  )}
                </ScrollBar>
              </div>
            </Card>
          </Sider>
          <Content className={cls('main-content', 'auto-height')} style={{ paddingLeft: 8 }}>
            {currentNode ? (
              <NodeForm {...nodeFormProps} />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description="可选择左侧节点获得相关的操作" />
              </div>
            )}
            { moveVisible ? <MoveNodeDrawer {...moveNodeProps} /> : null }
          </Content>
        </Layout>
      </div>
    );
  }
}
export default Organization;
