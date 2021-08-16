import React, { PureComponent } from 'react';
import cls from 'classnames';
import { get } from 'lodash';
import { Input } from 'antd';
import { ListCard } from 'suid';
import { BannerTitle } from '@/components';
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

  handlerPressEnter = () => {
    this.listCardRef.handlerPressEnter();
  };

  handlerSearch = v => {
    this.listCardRef.handlerSearch(v);
  };

  renderCustomTool = ({ total }) => {
    return (
      <>
        <span style={{ marginRight: 8 }}>{`共 ${total} 项`}</span>
        <Search
          allowClear
          placeholder={formatMessage({id: 'basic_000030', defaultMessage: '输入代码或名称关键字查询'})}
          onChange={e => this.handlerSearchChange(e.target.value)}
          onSearch={this.handlerSearch}
          onPressEnter={this.handlerPressEnter}
          style={{ width: 220 }}
        />
      </>
    );
  };

  render() {
    const { currentDataAuthorType, currentRoleId } = this.props;
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
          roleId: currentRoleId,
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
          <span>
            <BannerTitle
              title={get(currentDataAuthorType, 'name', '')}
              subTitle={formatMessage({id: 'basic_000114', defaultMessage: '已配置的数据权限'})}
            />
          </span>
        </div>
        <div className={cls('list-body')}>
          <ListCard {...listCardProps} />
        </div>
      </div>
    );
  }
}

export default ListAssign;
