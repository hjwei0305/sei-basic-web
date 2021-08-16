import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Button, Tooltip, Input } from 'antd';
import { TreePanel } from '@/components';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './Tree.less';

const { Search } = Input;

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

  handlerSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  assignSave = () => {
    const { selectedKeys } = this.state;
    const { save, onBackAssigned } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success) {
          onBackAssigned && onBackAssigned();
        }
      });
    }
  };

  assignCancel = () => {
    this.setState({ selectedKeys: [] });
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving } = this.props;
    const hasSelected = selectedKeys.length > 0;
    return (
      <>
        <div>
          <Button type="danger" ghost disabled={!hasSelected} onClick={this.assignCancel}>
            {formatMessage({id: 'basic_000131', defaultMessage: '取消'})}
          </Button>
          <Button type="primary" disabled={!hasSelected} loading={saving} onClick={this.assignSave}>
            {`确定 (${selectedKeys.length})`}
          </Button>
        </div>
        <div>
          <Tooltip title={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}>
            <Search
              placeholder={formatMessage({id: 'basic_000112', defaultMessage: '输入名称关键字查询'})}
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
