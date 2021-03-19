import React, { PureComponent } from 'react';
import cls from 'classnames';
import { isEqual, trim, get } from 'lodash';
import PropTypes from 'prop-types';
import { Input, Tree, Card, Empty } from 'antd';
import { ScrollBar, ListLoader, ExtIcon } from 'suid';
import styles from './index.less';

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

class TreePanel extends PureComponent {
  static data = [];

  static propTypes = {
    title: PropTypes.string,
    dataSource: PropTypes.array,
    selectedKeys: PropTypes.array,
    loading: PropTypes.bool,
    onSelectChange: PropTypes.func,
    className: PropTypes.string,
    checkable: PropTypes.bool,
    checkStrictly: PropTypes.bool,
    showSearch: PropTypes.bool,
  };

  static defaultProps = {
    dataSource: [],
    loading: false,
    checkable: true,
    showSearch: true,
    checkStrictly: true,
    selectedKeys: [],
  };

  static allValue = '';

  constructor(props) {
    super(props);
    const { dataSource } = props;
    this.data = [...dataSource];
    this.state = {
      dataSource,
      expandedKeys: this.getDefaultExpandKeys(dataSource),
      checkedKeys: [],
      autoExpandParent: true,
    };
  }

  componentDidMount() {
    const { onTreeRef } = this.props;
    if (onTreeRef) {
      onTreeRef(this);
    }
  }

  componentDidUpdate(prevProps) {
    const { dataSource, selectedKeys } = this.props;
    if (!isEqual(prevProps.selectedKeys, selectedKeys)) {
      this.setState({
        checkedKeys: selectedKeys,
        autoExpandParent: true,
      });
    }
    if (!isEqual(prevProps.dataSource, dataSource)) {
      this.data = [...dataSource];
      this.setState({
        dataSource,
        expandedKeys: this.getDefaultExpandKeys(dataSource),
        checkedKeys: [],
        autoExpandParent: true,
      });
    }
  }

  getDefaultExpandKeys = dataSource => {
    return dataSource.map(d => d.id);
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
    return { dataSource: newData, expandedKeys };
  };

  handlerSearchChange = v => {
    this.allValue = trim(v);
  };

  handlerSearch = () => {
    const { dataSource, expandedKeys } = this.getLocalFilterData();
    this.setState({
      dataSource,
      expandedKeys,
      autoExpandParent: true,
    });
  };

  handlerExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  handlerCheckedChange = checkedKeys => {
    this.setState({ checkedKeys }, () => {
      const { onSelectChange } = this.props;
      if (onSelectChange) {
        const { checked } = checkedKeys;
        onSelectChange(checked);
      }
    });
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
          <TreeNode title={<span title={get(item, 'namePath')}>{title}</span>} key={item.id}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          switcherIcon={<ExtIcon type="dian" style={{ fontSize: 12 }} />}
          title={<span title={get(item, 'namePath')}>{title}</span>}
          key={item.id}
        />
      );
    });
  };

  renderTree = () => {
    const { dataSource, autoExpandParent, checkedKeys, expandedKeys } = this.state;
    const { checkable, checkStrictly } = this.props;
    if (dataSource.length === 0) {
      return (
        <div className="blank-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        </div>
      );
    }
    return (
      <Tree
        blockNode
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
    );
  };

  render() {
    const { loading, title, className, showSearch } = this.props;
    const { allValue } = this.state;
    return (
      <Card
        title={title}
        className={cls(
          styles['tree-panel-box'],
          className,
          !title ? styles['tree-panel-box-no-title'] : null,
        )}
        bordered={false}
        extra={
          showSearch ? (
            <Search
              placeholder="输入名称关键字查询"
              defaultValue={allValue}
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerSearch}
              style={{ width: 172 }}
            />
          ) : null
        }
      >
        <div className="tree-body">
          <ScrollBar>{loading ? <ListLoader /> : this.renderTree()}</ScrollBar>
        </div>
      </Card>
    );
  }
}

export default TreePanel;
