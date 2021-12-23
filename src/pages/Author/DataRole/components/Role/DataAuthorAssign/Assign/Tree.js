import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { get, uniqBy, without } from 'lodash';
import cls from 'classnames';
import { Button, Tooltip, Input, Checkbox } from 'antd';
import { utils } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import { TreePanel } from '@/components';
import { getAllChildIdsByNode } from '@/utils';
import styles from './Tree.less';

const { Search } = Input;
const { getFlatTree } = utils;

@connect(({ dataRole, loading }) => ({ dataRole, loading }))
class ListAssign extends PureComponent {
  static treeRef = null;

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  componentDidMount() {
    this.loadUnAssignedData();
  }

  handlerSearchChange = v => {
    this.treeRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.treeRef.handlerSearch();
  };

  loadUnAssignedData = () => {
    const { dispatch, currentDataAuthorType, currentRole } = this.props;
    if (currentDataAuthorType && currentRole) {
      dispatch({
        type: 'dataRole/getUnassignedAuthTreeDataList',
        payload: {
          authTypeId: currentDataAuthorType.id,
          roleId: currentRole.id,
        },
      });
    }
  };

  handlerSelectChange = (selectedKeys, e) => {
    const { dataRole } = this.props;
    const { unAssignData } = dataRole;
    const { checked: nodeChecked } = e;
    const nodeId = get(e, 'node.props.eventKey', null) || null;
    let originCheckedKeys = [...selectedKeys];
    const cids = getAllChildIdsByNode(unAssignData, nodeId);
    if (nodeChecked) {
      // 选中：所有子节点选中
      originCheckedKeys.push(...cids);
    } else {
      // 取消：父节点状态不变，所有子节点取消选中
      originCheckedKeys = without(originCheckedKeys, ...cids);
    }
    const checkedData = uniqBy([...originCheckedKeys], id => id);
    this.setState({ selectedKeys: checkedData });
  };

  assignSave = () => {
    const { selectedKeys } = this.state;
    const { save, onBackAssigned } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success) {
          if (onBackAssigned) {
            onBackAssigned();
          }
        }
      });
    }
  };

  assignCancel = () => {
    this.setState({ selectedKeys: [] });
  };

  handlerSelectAll = e => {
    let selectedKeys = [];
    if (e.target.checked) {
      const { dataRole } = this.props;
      const { unAssignData } = dataRole;
      const allData = getFlatTree(unAssignData);
      selectedKeys = allData.map(it => it.id);
    } else {
      selectedKeys = [];
    }
    this.setState({ selectedKeys });
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving, dataRole } = this.props;
    const { unAssignData } = dataRole;
    const hasSelected = selectedKeys.length > 0;
    const allData = getFlatTree(unAssignData);
    const indeterminate = selectedKeys.length > 0 && selectedKeys.length < allData.length;
    const checked = selectedKeys.length > 0 && selectedKeys.length === allData.length;
    return (
      <>
        <div>
          <Checkbox
            disabled={allData.length === 0}
            checked={checked}
            indeterminate={indeterminate}
            onChange={this.handlerSelectAll}
          >
            全选
          </Checkbox>
          <Button type="danger" ghost disabled={!hasSelected} onClick={this.assignCancel}>
            {formatMessage({ id: 'basic_000131', defaultMessage: '取消' })}
          </Button>
          <Button type="primary" disabled={!hasSelected} loading={saving} onClick={this.assignSave}>
            {`确定 (${selectedKeys.length})`}
          </Button>
        </div>
        <div>
          <Tooltip
            title={formatMessage({ id: 'basic_000112', defaultMessage: '输入名称关键字查询' })}
          >
            <Search
              placeholder={formatMessage({
                id: 'basic_000112',
                defaultMessage: '输入名称关键字查询',
              })}
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerSearch}
              style={{ width: 180 }}
            />
          </Tooltip>
        </div>
      </>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const { dataRole, loading } = this.props;
    const { unAssignData } = dataRole;
    return (
      <div className={cls(styles['tree-assign-box'])}>
        <div className="tool-box">{this.renderCustomTool()}</div>
        <div className={cls('list-body')}>
          <TreePanel
            onTreeRef={ref => (this.treeRef = ref)}
            showSearch={false}
            selectable={false}
            selectedKeys={selectedKeys}
            dataSource={unAssignData}
            onSelectChange={this.handlerSelectChange}
            loading={loading.effects['dataRole/getUnassignedAuthTreeDataList']}
          />
        </div>
      </div>
    );
  }
}

export default ListAssign;
