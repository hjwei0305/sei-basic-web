import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Card, Popconfirm, Button, Drawer, Empty, Tree, Input, Tooltip } from 'antd';
import { ScrollBar, ListLoader, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import RoleView from './RoleView';
import styles from './AssignedFeature.less';

const { FEATURE_TYPE } = constants;

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

@connect(({ featureRole, loading }) => ({ featureRole, loading }))
class FeaturePage extends Component {
  constructor(props) {
    super(props);
    const { featureRole } = props;
    const { assignListData = [] } = featureRole;
    this.state = {
      allValue: '',
      assignListData,
      checkedKeys: [],
      delRowId: null,
    };
  }

  componentDidMount() {
    this.getAssignData();
  }

  componentDidUpdate(prevProps) {
    const { featureRole } = this.props;
    if (!isEqual(prevProps.featureRole.currentRole, featureRole.currentRole)) {
      this.setState(
        {
          delRowId: null,
          checkedKeys: [],
        },
        this.getAssignData,
      );
    }
    if (!isEqual(prevProps.featureRole.assignListData, featureRole.assignListData)) {
      this.setState({
        allValue: '',
        assignListData: featureRole.assignListData,
      });
    }
  }

  getAssignData = () => {
    const { featureRole, dispatch } = this.props;
    const { currentRole } = featureRole;
    if (currentRole) {
      dispatch({
        type: 'featureRole/getAssignFeatureItem',
        payload: {
          featureRoleId: currentRole.id,
        },
      });
    }
  };

  showAssignFeature = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureRole/updateState',
      payload: {
        showAssignFeature: true,
      },
    });
  };

  assignFeatureItem = childIds => {
    const { featureRole, dispatch } = this.props;
    const { currentRole } = featureRole;
    dispatch({
      type: 'featureRole/assignFeatureItem',
      payload: {
        parentId: currentRole.id,
        childIds,
      },
      callback: res => {
        if (res.success) {
          this.getAssignData();
        }
      },
    });
  };

  removeAssignFeatureItem = childIds => {
    const { featureRole, dispatch } = this.props;
    const { currentRole } = featureRole;
    if (childIds.length === 1) {
      this.setState({
        delRowId: childIds[0],
      });
    }
    dispatch({
      type: 'featureRole/removeAssignedFeatureItem',
      payload: {
        parentId: currentRole.id,
        childIds,
      },
      callback: res => {
        if (res.success) {
          this.setState({
            delRowId: null,
            checkedKeys: [],
          });
          this.getAssignData();
        }
      },
    });
  };

  batchRemoveAssignedFeatureItem = () => {
    const { checkedKeys } = this.state;
    this.removeAssignFeatureItem(checkedKeys);
  };

  onCancelBatchRemoveAssignedFeatureItem = () => {
    this.setState({
      checkedKeys: [],
    });
  };

  handlerSelectRow = checkedKeys => {
    this.setState({
      checkedKeys,
    });
  };

  renderRemoveBtn = item => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    let icon = <ExtIcon className="del" type="minus-circle" antd />;
    if (loading.effects['featureRole/removeAssignedFeatureItem'] && delRowId === item.id) {
      icon = <ExtIcon className="del-loading" type="loading" antd />;
    }
    return (
      <Popconfirm
        title={formatMessage({ id: 'global.remove.confirm', defaultMessage: '确定要移除吗?' })}
        onConfirm={() => this.removeAssignFeatureItem([item.id])}
      >
        <Tooltip title="移除功能项" placement="right">
          {icon}
        </Tooltip>
      </Popconfirm>
    );
  };

  filterNodes = (valueKey, treeData) => {
    const newArr = [];
    treeData.forEach(treeNode => {
      const nodeChildren = treeNode[childFieldKey];
      const fieldValue = treeNode.name;
      if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
        newArr.push(treeNode);
      } else if (nodeChildren && nodeChildren.length > 0) {
        const ab = this.filterNodes(valueKey, nodeChildren);
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
    const { featureRole } = this.props;
    const { assignListData } = featureRole;
    const { allValue } = this.state;
    let newData = [...assignListData];
    const searchValue = allValue;
    if (searchValue) {
      newData = this.filterNodes(searchValue.toLowerCase(), newData);
    }
    return { assignListData: newData };
  };

  handlerSearchChange = v => {
    this.setState({ allValue: v });
  };

  handlerSearch = () => {
    const { assignListData } = this.getLocalFilterData();
    this.setState({ assignListData });
  };

  handlerCheckedChange = checkedKeys => {
    this.setState({ checkedKeys });
  };

  renderNodeIcon = featureType => {
    let icon = null;
    switch (featureType) {
      case FEATURE_TYPE.APP_MODULE:
        icon = (
          <ExtIcon
            type="appstore"
            tooltip={{ title: '应用模块' }}
            antd
            style={{ color: '#13c2c2' }}
          />
        );
        break;
      case FEATURE_TYPE.PAGE:
        icon = <ExtIcon type="doc" tooltip={{ title: '页面' }} style={{ color: '#722ed1' }} />;
        break;
      case FEATURE_TYPE.OPERATE:
        icon = <ExtIcon type="dian" tooltip={{ title: '功能项' }} />;
        break;
      default:
    }
    return icon;
  };

  getTooltip = code => {
    return {
      placement: 'top',
      title: (
        <>
          代码
          <br />
          <span style={{ fontSize: 12, color: '#d2d2d2' }}>{code}</span>
        </>
      ),
    };
  };

  renderTreeNodes = treeData => {
    const { allValue } = this.state;
    const searchValue = allValue || '';
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
      const nodeTitle = (
        <>
          <Tooltip {...this.getTooltip(item.code)}>{title}</Tooltip>
          {item.featureType === FEATURE_TYPE.PAGE || item.featureType === FEATURE_TYPE.OPERATE ? (
            <RoleView featureId={item.id} />
          ) : null}
          {this.renderRemoveBtn(item)}
        </>
      );
      if (readerChildren && readerChildren.length > 0) {
        return (
          <TreeNode title={nodeTitle} key={item.id} icon={this.renderNodeIcon(item.featureType)}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          icon={this.renderNodeIcon(item.featureType)}
          switcherIcon={<span />}
          title={nodeTitle}
          key={item.id}
        />
      );
    });
  };

  renderTree = () => {
    const { checkedKeys, assignListData } = this.state;
    if (assignListData.length === 0) {
      return (
        <div className="blank-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂时没有数据" />
        </div>
      );
    }
    return (
      <Tree
        className="assigned-tree"
        checkable
        defaultExpandAll
        blockNode
        showIcon
        switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
        onCheck={this.handlerCheckedChange}
        checkedKeys={checkedKeys}
      >
        {this.renderTreeNodes(assignListData)}
      </Tree>
    );
  };

  render() {
    const { featureRole, loading } = this.props;
    const { currentRole } = featureRole;
    const { checkedKeys, allValue } = this.state;
    const hasSelected = checkedKeys.length > 0;
    const loadingAssigned = loading.effects['featureRole/getAssignFeatureItem'];
    return (
      <div className={cls(styles['assigned-feature-box'])}>
        <Card title={<BannerTitle title={currentRole.name} subTitle="功能权限" />} bordered={false}>
          <div className={cls('tool-box')}>
            <Button
              icon="plus"
              type="primary"
              loading={loading.effects['featureRole/getUnAssignedFeatureItemList']}
              onClick={this.showAssignFeature}
            >
              我要分配功能项
            </Button>
            <Button onClick={this.getAssignData} loading={loadingAssigned} icon="reload">
              <FormattedMessage id="global.refresh" defaultMessage="刷新" />
            </Button>
            <div className="tool-search-box">
              <Search
                placeholder="输入名称关键字查询"
                value={allValue}
                onChange={e => this.handlerSearchChange(e.target.value)}
                onSearch={this.handlerSearch}
                onPressEnter={this.handlerSearch}
                style={{ width: 172 }}
              />
            </div>
            <Drawer
              placement="top"
              closable={false}
              mask={false}
              height={44}
              getContainer={false}
              style={{ position: 'absolute' }}
              visible={hasSelected}
            >
              <Button
                onClick={this.onCancelBatchRemoveAssignedFeatureItem}
                disabled={loading.effects['featureRole/removeAssignedFeatureItem']}
              >
                取消
              </Button>
              <Popconfirm
                title="确定要移除选择的项目吗？"
                onConfirm={this.batchRemoveAssignedFeatureItem}
              >
                <Button
                  type="danger"
                  loading={loading.effects['featureRole/removeAssignedFeatureItem']}
                >
                  批量移除
                </Button>
              </Popconfirm>
              <span className={cls('select')}>{`已选择 ${checkedKeys.length} 项`}</span>
            </Drawer>
          </div>
          <div className="assigned-body">
            <ScrollBar>{loadingAssigned ? <ListLoader /> : this.renderTree()}</ScrollBar>
          </div>
        </Card>
      </div>
    );
  }
}

export default FeaturePage;
