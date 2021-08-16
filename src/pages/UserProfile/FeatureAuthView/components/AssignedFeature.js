import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Card, Button, Empty, Tree, Input, Tooltip } from 'antd';
import { ScrollBar, ListLoader, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './AssignedFeature.less';

const { FEATURE_TYPE } = constants;

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

@connect(({ userFeatureAuthView, loading }) => ({ userFeatureAuthView, loading }))
class FeatureView extends Component {
  constructor(props) {
    super(props);
    const { userFeatureAuthView } = props;
    const { assignListData = [] } = userFeatureAuthView;
    this.state = {
      allValue: '',
      assignListData,
    };
  }

  componentDidMount() {
    this.getAssignData();
  }

  componentDidUpdate(prevProps) {
    const { userFeatureAuthView } = this.props;
    const { currentRoleId, assignListData } = userFeatureAuthView;
    if (!isEqual(prevProps.userFeatureAuthView.currentRoleId, currentRoleId)) {
      this.getAssignData();
    }
    if (!isEqual(prevProps.userFeatureAuthView.assignListData, assignListData)) {
      this.setState({
        allValue: '',
        assignListData,
      });
    }
  }

  getAssignData = () => {
    const { userFeatureAuthView, dispatch } = this.props;
    const { currentRoleId } = userFeatureAuthView;
    if (currentRoleId) {
      dispatch({
        type: 'userFeatureAuthView/getAssignFeatureItem',
        payload: {
          featureRoleId: currentRoleId,
        },
      });
    }
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
    const { userFeatureAuthView } = this.props;
    const { assignListData } = userFeatureAuthView;
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

  renderNodeIcon = featureType => {
    let icon = null;
    switch (featureType) {
      case FEATURE_TYPE.APP_MODULE:
        icon = (
          <ExtIcon
            type="appstore"
            tooltip={{ title: formatMessage({id: 'basic_000108', defaultMessage: '应用模块'}) }}
            antd
            style={{ color: '#13c2c2' }}
          />
        );
        break;
      case FEATURE_TYPE.PAGE:
        icon = <ExtIcon type="doc" tooltip={{ title: formatMessage({id: 'basic_000109', defaultMessage: '页面'}) }} style={{ color: '#722ed1' }} />;
        break;
      case FEATURE_TYPE.OPERATE:
        icon = <ExtIcon type="dian" tooltip={{ title: formatMessage({id: 'basic_000110', defaultMessage: '功能项'}) }} />;
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
          {formatMessage({id: 'basic_000031', defaultMessage: '代码'})}
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
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={formatMessage({id: 'basic_000111', defaultMessage: '暂时没有数据'})} />
        </div>
      );
    }
    return (
      <Tree
        className="assigned-tree"
        defaultExpandAll
        blockNode
        showIcon
        switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
        checkedKeys={checkedKeys}
      >
        {this.renderTreeNodes(assignListData)}
      </Tree>
    );
  };

  render() {
    const { userFeatureAuthView, loading } = this.props;
    const { currentRoleName } = userFeatureAuthView;
    const { allValue } = this.state;
    const loadingAssigned = loading.effects['userFeatureAuthView/getAssignFeatureItem'];
    return (
      <div className={cls(styles['assigned-feature-box'])}>
        <Card title={<BannerTitle title={currentRoleName} subTitle={formatMessage({id: 'basic_000005', defaultMessage: '功能权限'})} />} bordered={false}>
          <div className={cls('tool-box')}>
            <Button onClick={this.getAssignData} loading={loadingAssigned} icon="reload">
              <FormattedMessage id="global.refresh" defaultMessage="刷新" />
            </Button>
            <div className="tool-search-box">
              <Search
                placeholder={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}
                value={allValue}
                onChange={e => this.handlerSearchChange(e.target.value)}
                onSearch={this.handlerSearch}
                onPressEnter={this.handlerSearch}
                style={{ width: 260 }}
              />
            </div>
          </div>
          <div className="assigned-body">
            <ScrollBar>{loadingAssigned ? <ListLoader /> : this.renderTree()}</ScrollBar>
          </div>
        </Card>
      </div>
    );
  }
}

export default FeatureView;
