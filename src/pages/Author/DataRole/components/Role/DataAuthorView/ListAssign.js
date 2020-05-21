import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { Input } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import styles from './ListAssign.less';

const { SERVER_PATH } = constants;
const { Search } = Input;

class ListAssign extends PureComponent {
  static listCardRef;

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  renderTitle = currentDataAuthorType => {
    const title = get(currentDataAuthorType, 'name', '');
    return (
      <>
        {title}
        <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>已配置的数据权限</span>
      </>
    );
  };

  renderCustomTool = ({ total }) => {
    return (
      <>
        <span style={{ marginRight: 8 }}>{`共 ${total} 项`}</span>
        <Search
          placeholder="输入代码或名称关键字查询"
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerSearch}
          style={{ width: 220 }}
        />
      </>
    );
  };

  render() {
    const { currentDataAuthorType, currentRole } = this.props;
    const listCardProps = {
      className: 'assign-box',
      bordered: false,
      itemField: {
        title: item => item.name,
        description: item => item.code,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getAssignedAuthDatas`,
        params: {
          authTypeId: currentDataAuthorType.id,
          roleId: currentRole.id,
        },
      },
      showArrow: false,
      showSearch: false,
      customTool: this.renderCustomTool,
      onListCardRef: ref => (this.listCardRef = ref),
    };
    return (
      <div className={cls(styles['list-assign-box'])}>
        <div className="header-box">
          <span>{this.renderTitle(currentDataAuthorType)}</span>
        </div>
        <div className={cls('list-body')}>
          <ListCard {...listCardProps} />
        </div>
      </div>
    );
  }
}

export default ListAssign;
