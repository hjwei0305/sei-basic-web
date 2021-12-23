import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get, uniqBy, without } from 'lodash';
import { Button, Drawer, Popconfirm, Input, Checkbox } from 'antd';
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
    this.loadAssignedData();
  }

  handlerSearchChange = v => {
    this.treeRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.treeRef.handlerSearch();
  };

  loadAssignedData = () => {
    const { dispatch, currentDataAuthorType, currentRole } = this.props;
    if (currentDataAuthorType && currentRole) {
      dispatch({
        type: 'dataRole/getAssignedAuthTreeDataList',
        payload: {
          authTypeId: currentDataAuthorType.id,
          roleId: currentRole.id,
        },
      });
    }
  };

  handlerSelectChange = (selectedKeys, e) => {
    const { dataRole } = this.props;
    const { assignData } = dataRole;
    const { checked: nodeChecked } = e;
    const nodeId = get(e, 'node.props.eventKey', null) || null;
    let originCheckedKeys = [...selectedKeys];
    const cids = getAllChildIdsByNode(assignData, nodeId);
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

  handlerShowAssign = () => {
    const { onShowAssign } = this.props;
    if (onShowAssign) {
      onShowAssign();
    }
  };

  batchRemoveAssigned = () => {
    const { selectedKeys } = this.state;
    const { save } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success) {
          this.loadAssignedData();
          this.setState({ selectedKeys: [] });
        }
      });
    }
  };

  onCancelBatchRemoveAssigned = () => {
    this.setState({
      selectedKeys: [],
    });
  };

  handlerSelectAll = e => {
    let selectedKeys = [];
    if (e.target.checked) {
      const { dataRole } = this.props;
      const { assignData } = dataRole;
      const allData = getFlatTree(assignData);
      selectedKeys = allData.map(it => it.id);
    } else {
      selectedKeys = [];
    }
    this.setState({ selectedKeys });
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving, dataRole } = this.props;
    const { assignData } = dataRole;
    const hasSelected = selectedKeys.length > 0;
    const allData = getFlatTree(assignData);
    const indeterminate = selectedKeys.length > 0 && selectedKeys.length < allData.length;
    const checked = selectedKeys.length > 0 && selectedKeys.length === allData.length;
    return (
      <>
        <Checkbox
          disabled={allData.length === 0}
          checked={checked}
          indeterminate={indeterminate}
          onChange={this.handlerSelectAll}
        >
          全选
        </Checkbox>
        <Button type="primary" icon="plus" onClick={this.handlerShowAssign}>
          {formatMessage({ id: 'basic_000402', defaultMessage: '添加数据权限' })}
        </Button>
        <span>
          <Search
            placeholder={formatMessage({
              id: 'basic_000030',
              defaultMessage: '输入代码或名称关键字查询',
            })}
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: 220 }}
          />
          <Drawer
            placement="top"
            closable={false}
            mask={false}
            height={44}
            getContainer={false}
            style={{ position: 'absolute' }}
            visible={hasSelected}
          >
            <Button onClick={this.onCancelBatchRemoveAssigned} disabled={saving}>
              {formatMessage({ id: 'basic_000131', defaultMessage: '取消' })}
            </Button>
            <Popconfirm
              title={formatMessage({ id: 'basic_000307', defaultMessage: '确定要移除吗？' })}
              onConfirm={this.batchRemoveAssigned}
            >
              <Button type="danger" loading={saving}>
                {formatMessage({ id: 'basic_000133', defaultMessage: '批量移除' })}
              </Button>
            </Popconfirm>
            <span className={cls('select')}>{`${formatMessage({
              id: 'basic_000134',
              defaultMessage: '已选择',
            })} ${selectedKeys.length} ${formatMessage({
              id: 'basic_000405',
              defaultMessage: '项',
            })}`}</span>
          </Drawer>
        </span>
      </>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const { dataRole, loading } = this.props;
    const { assignData } = dataRole;
    return (
      <div className={cls(styles['tree-assigned-box'])}>
        <div className="tool-box">{this.renderCustomTool()}</div>
        <div className={cls('list-body')}>
          <TreePanel
            onTreeRef={ref => (this.treeRef = ref)}
            dataSource={assignData}
            showSearch={false}
            selectable={false}
            selectedKeys={selectedKeys}
            loading={loading.effects['dataRole/getAssignedAuthTreeDataList']}
            onSelectChange={this.handlerSelectChange}
          />
        </div>
      </div>
    );
  }
}

export default ListAssign;
