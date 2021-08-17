import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Drawer, Popconfirm, Input } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import { constants } from '@/utils';
import styles from './List.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class List extends PureComponent {
  static listCardRef;

  static propTypes = {
    currentRole: PropTypes.object,
    currentDataAuthorType: PropTypes.object,
    onShowAssign: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      removeId: '',
    };
  }

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  handerAssignedStationSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
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
          this.listCardRef.remoteDataRefresh();
          this.setState({ selectedKeys: [] });
        }
      });
    }
  };

  removeAssigned = (item, e) => {
    e && e.stopPropagation();
    const { save } = this.props;
    if (save) {
      const selectedKeys = [item.id];
      this.setState({
        removeId: item.id,
      });
      save(selectedKeys, re => {
        if (re.success) {
          this.listCardRef.remoteDataRefresh();
          this.setState({ removeId: '', selectedKeys: [] });
        }
      });
    }
  };

  onCancelBatchRemoveAssigned = () => {
    this.setState({
      selectedKeys: [],
    });
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving } = this.props;
    const hasSelected = selectedKeys.length > 0;
    return (
      <>
        <Button type="primary" icon="plus" onClick={this.handlerShowAssign}>
          {formatMessage({id: 'basic_000402', defaultMessage: '添加数据权限'})}
        </Button>
        <span>
          <Search
            allowClear
            placeholder={formatMessage({id: 'basic_000030', defaultMessage: '输入代码或名称关键字查询'})}
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerPressEnter}
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
              {formatMessage({id: 'basic_000131', defaultMessage: '取消'})}
            </Button>
            <Popconfirm title={formatMessage({id: 'basic_000307', defaultMessage: '确定要移除吗？'})} onConfirm={this.batchRemoveAssigned}>
              <Button type="danger" loading={saving}>
                {formatMessage({id: 'basic_000133', defaultMessage: '批量移除'})}
              </Button>
            </Popconfirm>
            <span className={cls('select')}>{`${formatMessage({id: 'basic_000134', defaultMessage: '已选择'})} ${selectedKeys.length} ${formatMessage({id: 'basic_000405', defaultMessage: '项'})}`}</span>
          </Drawer>
        </span>
      </>
    );
  };

  renderItemAction = item => {
    const { saving } = this.props;
    const { removeId } = this.state;
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <Popconfirm title="确定要移除吗?" onConfirm={e => this.removeAssigned(item, e)}>
            {saving && removeId === item.id ? (
              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="minus-circle" antd />
            )}
          </Popconfirm>
        </div>
      </>
    );
  };

  render() {
    const { currentRole, currentDataAuthorType } = this.props;
    const roleId = get(currentRole, 'id', null);
    const authTypeId = get(currentDataAuthorType, 'id', null);
    const { selectedKeys } = this.state;
    const listCardProps = {
      className: 'list-assign-box',
      bordered: false,
      checkbox: true,
      selectedKeys,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getAssignedAuthDatas`,
        params: {
          authTypeId,
          roleId,
        },
      },
      showArrow: false,
      showSearch: false,
      onListCardRef: ref => (this.listCardRef = ref),
      itemTool: this.renderItemAction,
      customTool: this.renderCustomTool,
      onSelectChange: this.handerAssignedStationSelectChange,
    };
    return (
      <div className={cls(styles['assigned-box'])}>
        <ListCard {...listCardProps} />
      </div>
    );
  }
}

export default List;
