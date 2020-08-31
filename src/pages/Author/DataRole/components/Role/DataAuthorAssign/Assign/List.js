import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Tooltip, Input } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './List.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class List extends PureComponent {
  static listCardRef;

  static propTypes = {
    onBackAssigned: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
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

  handerAssignSelectChange = selectedKeys => {
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
            取消
          </Button>
          <Button type="primary" disabled={!hasSelected} loading={saving} onClick={this.assignSave}>
            {`确定 (${selectedKeys.length})`}
          </Button>
        </div>
        <div>
          <Tooltip title="输入名称关键字查询">
            <Search
              placeholder="输入名称关键字查询"
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerPressEnter}
              style={{ width: 180 }}
            />
          </Tooltip>
        </div>
      </>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const { currentRole, currentDataAuthorType } = this.props;
    const authTypeId = get(currentDataAuthorType, 'id', null);
    const roleId = get(currentRole, 'id', null);
    const listCardProps = {
      className: 'anyone-user-box',
      bordered: false,
      searchPlaceHolder: '输入用户代码或名称关键字查询',
      searchProperties: ['code', 'userName'],
      checkbox: true,
      selectedKeys,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      showArrow: false,
      showSearch: false,
      store: {
        url: `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getUnassignedAuthDataList`,
        params: {
          authTypeId,
          roleId,
        },
      },
      onListCardRef: ref => (this.listCardRef = ref),
      onSelectChange: this.handerAssignSelectChange,
      customTool: this.renderCustomTool,
    };
    return (
      <div className={cls(styles['assign-box'])}>
        <ListCard {...listCardProps} />
      </div>
    );
  }
}

export default List;
