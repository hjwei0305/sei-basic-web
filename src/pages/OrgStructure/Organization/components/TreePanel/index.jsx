import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Tree, Empty, Popconfirm, Button, message, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ToolBar, ScrollBar, ExtIcon } from 'suid';
import { cloneDeep, isEqual } from 'lodash';
import cls from 'classnames';
import FormModal from './FormModal';
import styles from './index.less';

const { TreeNode } = Tree;

const { Search } = Input;

@connect(({ organization }) => ({ organization }))
class TreePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      filterTreeData: [],
    };
  }

  componentDidUpdate() {
    const {
      organization: { treeData },
    } = this.props;
    const { searchValue } = this.state;
    if (!isEqual(this.treeData, treeData)) {
      this.treeData = treeData;
      this.updateTreeState(searchValue, treeData);
    }
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  updateTreeState = (searchValue, treeData) => {
    this.keyList = [];
    const filterTreeData = this.findNode(searchValue, cloneDeep(treeData));
    this.getExpandedKeys(filterTreeData);
    // 没有搜索关键字
    if (searchValue === '') {
      this.setState({
        filterTreeData,
        searchValue,
        autoExpandParent: false,
        expandedKeys: [],
      });
    } else {
      this.setState({
        filterTreeData,
        searchValue,
        autoExpandParent: true,
        expandedKeys: this.keyList,
      });
    }
  };

  handleSearch = value => {
    this.updateTreeState(value, this.treeData);
  };

  handleCheck = (checkedKeys, info) => {
    const { dispatch } = this.props;
    const checkedItems = [];
    info.checkedNodes.forEach(item => {
      checkedItems.push(item.props.dataRef);
    });

    this.setState(
      {
        checkedKeys,
      },
      () => {
        dispatch({
          type: 'organization/updateState',
          payload: {
            selectedTreeNode: checkedItems,
          },
        });
      },
    );
  };

  handleSelect = (selectedKeys, info) => {
    if (selectedKeys && selectedKeys.length) {
      const { dispatch } = this.props;
      const selectedItems = [];
      info.selectedNodes.forEach(item => {
        selectedItems.push(item.props.dataRef);
      });
      this.setState(
        {
          selectedKeys,
        },
        () => {
          dispatch({
            type: 'organization/updateState',
            payload: {
              selectedTreeNode: selectedItems[0],
            },
          });
        },
      );
    }
  };

  handleCreate = () => {
    const { organization, dispatch } = this.props;
    if (organization.selectedTreeNode) {
      dispatch({
        type: 'organization/updateState',
        payload: {
          showCreateModal: true,
        },
      });
    } else {
      message.warn('请选择父亲节点！');
    }
  };

  handleDel = () => {
    const { organization, dispatch } = this.props;
    const { selectedTreeNode } = organization;
    if (selectedTreeNode) {
      dispatch({
        type: 'organization/del',
        payload: {
          id: selectedTreeNode.id,
        },
      }).then(res => {
        if (res.success) {
          dispatch({
            type: 'organization/updateState',
            payload: {
              selectedTreeNode: null,
            },
          });
          this.reloadData();
        }
      });
    } else {
      message.warn('请选择要删除的节点！');
    }
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/updateState',
      payload: {
        showCreateModal: false,
      },
    });
  };

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/queryTree',
    });
  };

  // 查找关键字节点
  findNode = (value, tree) =>
    tree
      .map(treeNode => {
        const node = { ...treeNode };
        const isInclude = node.name.includes(value);
        // 如果有子节点
        if (node.children && node.children.length > 0) {
          node.children = this.findNode(value, node.children);
          // 如果标题匹配
          if (isInclude) {
            return node;
          } // 如果标题不匹配，则查看子节点是否有匹配标题
          node.children = this.findNode(value, node.children);
          if (node.children && node.children.length > 0) {
            return node;
          }
          return null;
        }
        // 没子节点
        if (isInclude) {
          return treeNode;
        }
        return null;
      })
      .filter(treeNode => treeNode);

  getToolBarProps = () => ({
    className: cls(styles['tool-bar-customer-wrapper']),
    left: (
      <>
        <Button style={{ marginRight: 8 }} type="primary" onClick={this.handleCreate}>
          创建节点
        </Button>
        <Popconfirm
          // key={APP_MODULE_BTN_KEY.DELETE}
          placement="topLeft"
          title={formatMessage({
            id: 'global.delete.confirm',
            defaultMessage: '确定要删除吗？提示：删除后不可恢复',
          })}
          onConfirm={() => this.handleDel()}
        >
          <Button type="danger">删除</Button>
        </Popconfirm>
      </>
    ),
    right: (
      <Search
        allowClear
        placeholder="请输入名称搜索"
        onSearch={this.handleSearch}
        style={{ width: 200 }}
      />
    ),
  });

  getExpandedKeys = data => {
    data.forEach(item => {
      this.keyList.push(item.id);
      if (item.children && item.children.length > 0) {
        this.getExpandedKeys(item.children);
      }
    });
  };

  getTreeNodes = data =>
    data.map(item => {
      const { children, name, id } = item;
      const { selectable } = this.props;

      if (children && children.length > 0) {
        return (
          <TreeNode title={name} key={id} dataRef={item} selectable={selectable}>
            {this.getTreeNodes(children)}
          </TreeNode>
        );
      }

      return (
        <TreeNode
          switcherIcon={<ExtIcon type="dian" />}
          title={name}
          key={id}
          dataRef={item}
          isLeaf
        />
      );
    });

  render() {
    const {
      expandedKeys,
      autoExpandParent,
      checkedKeys,
      selectedKeys,
      filterTreeData,
    } = this.state;
    const { organization } = this.props;
    const { showCreateModal } = organization;

    return (
      <div style={{ height: '100%' }}>
        <ToolBar {...this.getToolBarProps()} />
        <div style={{ height: 'calc(100% - 46px)' }}>
          <ScrollBar>
            {filterTreeData && filterTreeData.length ? (
              <Tree
                onCheck={this.handleCheck}
                onSelect={this.handleSelect}
                checkable={false}
                blockNode
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                checkedKeys={checkedKeys}
                autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                switcherIcon={<Icon type="down" />}
              >
                {this.getTreeNodes(filterTreeData)}
              </Tree>
            ) : (
              <Empty className={cls('empty-wrapper')} description="暂无数据" />
            )}
          </ScrollBar>
        </div>
        {showCreateModal ? (
          <FormModal visible={showCreateModal} onCancel={this.handleCancel} />
        ) : null}
      </div>
    );
  }
}

export default TreePanel;
