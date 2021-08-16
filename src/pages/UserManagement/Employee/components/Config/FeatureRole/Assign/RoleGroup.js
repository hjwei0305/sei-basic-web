import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';

const { Search } = Input;
const { SERVER_PATH } = constants;

class RoleGroup extends PureComponent {
  static listCardRef = null;

  constructor(props) {
    super(props);
    this.state = {};
  }

  handlerSearchChange = v => {
    this.allValue = v || '';
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  handlerGroupSelect = keys => {
    const { onSelectChange } = this.props;
    if (onSelectChange) {
      const groupId = keys.length > 0 ? keys[0] : null;
      onSelectChange(groupId);
    }
  };

  renderCustomTool = () => (
    <>
      <Search
        allowClear
        placeholder={formatMessage({id: 'basic_000030', defaultMessage: '输入代码或名称关键字查询'})}
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerPressEnter}
        style={{ width: '100%' }}
      />
    </>
  );

  render() {
    const listCardProps = {
      className: 'left-content',
      title: formatMessage({id: 'basic_000104', defaultMessage: '角色组'}),
      showSearch: false,
      onSelectChange: this.handlerGroupSelect,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/featureRoleGroup/findAllUnfrozen`,
      },
    };
    return (
      <div className="role-group-box">
        <ListCard {...listCardProps} />
      </div>
    );
  }
}
export default RoleGroup;
