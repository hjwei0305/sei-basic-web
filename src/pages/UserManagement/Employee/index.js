import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual, trim } from 'lodash';
import { Card, Input, Tree, Empty, Layout } from 'antd';
import { ScrollBar, ExtIcon, ListLoader } from 'suid';
import empty from '@/assets/item_empty.svg';
import { formatMessage } from 'umi-plugin-react/locale';
import Employee from './components/Employee';
import styles from './index.less';

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';
const { Sider, Content } = Layout;

@connect(({ employee, loading }) => ({ employee, loading }))
class PositionHome extends Component {
  static allValue = '';

  static data = [];

  constructor(props) {
    super(props);
    const { employee } = props;
    const { currentOrgNode } = employee;
    this.state = {
      treeData: [],
      expandedKeys: [],
      selectedKeys: currentOrgNode ? [currentOrgNode.id] : [],
      autoExpandParent: true,
    };
  }

  componentDidUpdate(preProps) {
    const { employee, dispatch } = this.props;
    const { treeData: dataSource } = employee;
    if (!isEqual(preProps.employee.treeData, dataSource)) {
      this.data = [...dataSource];
      this.setState(
        {
          treeData: dataSource,
        },
        () => {
          const { currentOrgNode } = employee;
          let expandedKeys = [];
          const { selectedKeys } = this.state;
          let keys = [...selectedKeys];
          if (currentOrgNode && currentOrgNode.id) {
            const parentData = this.getCurrentNodeAllParents(this.data, currentOrgNode.id);
            expandedKeys = parentData.map(p => p.id);
          } else {
            expandedKeys = dataSource.map(p => p.id);
            keys = expandedKeys.filter((_e, idx) => idx === 0);
            dispatch({
              type: 'employee/updateState',
              payload: {
                currentOrgNode: keys.length > 0 ? dataSource[0] : null,
              },
            });
          }
          this.setState({ expandedKeys, selectedKeys: keys });
        },
      );
    }
    if (
      !isEqual(preProps.employee.currentOrgNode, employee.currentOrgNode) &&
      employee.currentOrgNode &&
      employee.currentOrgNode.id
    ) {
      const { currentOrgNode } = employee;
      const parentData = this.getCurrentNodeAllParents(this.data, currentOrgNode.id);
      this.setState({
        selectedKeys: [currentOrgNode.id],
        expandedKeys: parentData.map(p => p.id),
      });
    }
  }

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

  getSelectData = (selectedKey, treeData, currentOrgNode) => {
    for (let i = 0; i < treeData.length; i += 1) {
      const item = treeData[i];
      const childData = item[childFieldKey];
      if (item.id === selectedKey) {
        Object.assign(currentOrgNode, item);
        break;
      }
      if (childData && childData.length > 0) {
        this.getSelectData(selectedKey, childData, currentOrgNode);
      }
    }
  };

  handlerSelect = (selectedKeys, e) => {
    const { treeData } = this.state;
    const { dispatch } = this.props;
    let currentOrgNode = null;
    if (e.selected) {
      currentOrgNode = {};
      this.getSelectData(selectedKeys[0], treeData, currentOrgNode);
      this.setState(
        {
          selectedKeys,
        },
        () => {
          dispatch({
            type: 'employee/updateState',
            payload: {
              currentOrgNode,
            },
          });
        },
      );
    }
  };

  handlerExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

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
          <TreeNode title={title} key={item.id}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          switcherIcon={<ExtIcon type="dian" style={{ fontSize: 12 }} />}
          title={title}
          key={item.id}
        />
      );
    });
  };

  render() {
    const { loading, employee } = this.props;
    const { allValue, treeData, expandedKeys, selectedKeys, autoExpandParent } = this.state;
    const { currentOrgNode } = employee;
    return (
      <div className={cls(styles['container-box'])}>
        <Layout className="auto-height">
          <Sider width={380} className="auto-height" theme="light">
            <Card title={formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})} bordered={false} className="left-content">
              <div className="header-tool-box">
                <Search
                  placeholder={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}
                  defaultValue={allValue}
                  onChange={e => this.handlerSearchChange(e.target.value)}
                  onSearch={this.handlerSearch}
                  onPressEnter={this.handlerSearch}
                />
              </div>
              <div className="tree-body">
                <ScrollBar>
                  {loading.effects['employee/getOrgList'] ? (
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
            {currentOrgNode ? (
              <Employee />
            ) : (
              <div className="blank-empty">
                <Empty image={empty} description={formatMessage({id: 'basic_000143', defaultMessage: '可选择左侧节点获得相关的操作'})} />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}
export default PositionHome;
