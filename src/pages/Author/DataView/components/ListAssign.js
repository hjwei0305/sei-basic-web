import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Input } from 'antd';
import { ListCard } from 'suid';
import styles from './ListAssign.less';

const { Search } = Input;

@connect(({ dataView, loading }) => ({ dataView, loading }))
class ListAssign extends PureComponent {
  componentDidMount() {
    this.loadAssignedData();
  }

  loadAssignedData = () => {
    const { dispatch, currentDataAuthorType, currentRoleId } = this.props;
    if (currentDataAuthorType && currentRoleId) {
      dispatch({
        type: 'dataView/getAssignedAuthDataList',
        payload: {
          authTypeId: currentDataAuthorType.id,
          roleId: currentRoleId,
        },
      });
    }
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  renderCustomTool = () => (
    <>
      <span />
      <Search
        placeholder="可输入名称关键字查询"
        onChange={e => this.handlerSearchChange(e.target.value)}
        onSearch={this.handlerSearch}
        onPressEnter={this.handlerSearch}
        style={{ width: 172 }}
      />
    </>
  );

  render() {
    const { currentDataAuthorType, dataView, loading } = this.props;
    const { assignData } = dataView;
    return (
      <div className={cls(styles['list-assign-box'])}>
        <div className="header-box">
          <span>{currentDataAuthorType.name}</span>
        </div>
        <ListCard
          className="assign-box"
          showArrow={false}
          showSearch={false}
          dataSource={assignData}
          loading={loading.effects['dataView/getAssignedAuthDataList']}
          onListCardRef={ref => (this.listCardRef = ref)}
          customTool={this.renderCustomTool}
        />
      </div>
    );
  }
}

export default ListAssign;
