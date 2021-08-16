import React, { PureComponent } from 'react';
import { Input, Tree } from 'antd';
import { ScrollBar, ExtIcon, ListLoader, utils } from 'suid';
import { constants } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';

const { request } = utils;
const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';
const { SERVER_PATH } = constants;

class Organization extends PureComponent {
  static allValue = '';

  static data = [];

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      treeData: [],
      expandedKeys: [],
      selectedKeys: [],
      autoExpandParent: true,
    };
  }

  componentDidMount() {
    const { onAfterLoaded } = this.props;
    this.setState({ loading: true });
    const params = {
      url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
    };
    request(params)
      .then(res => {
        if (res.success) {
          this.data = [...res.data];
          let selectedKeys = [];
          let expandedKeys = [];
          let orgId = null;
          if (this.data.length > 0) {
            orgId = this.data[0].id;
            selectedKeys = [orgId];
            expandedKeys = [orgId];
          }
          this.setState(
            {
              selectedKeys,
              expandedKeys,
              treeData: res.data,
            },
            () => {
              if (onAfterLoaded) {
                onAfterLoaded(orgId);
              }
            },
          );
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
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
    this.allValue = v || '';
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
        const { onSelectChange } = this.props;
        if (onSelectChange) {
          const orgId = selectedKeys.length > 0 ? selectedKeys[0] : null;
          onSelectChange(orgId);
        }
      },
    );
  };

  handlerExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
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
    const {
      allValue,
      treeData,
      expandedKeys,
      selectedKeys,
      autoExpandParent,
      loading,
    } = this.state;
    return (
      <div className="org-box">
        <div className="search-box">
          <Search
            placeholder={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}
            defaultValue={allValue}
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: '100%' }}
          />
        </div>
        <div className="org-body">
          <ScrollBar>
            {loading ? (
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
      </div>
    );
  }
}
export default Organization;
