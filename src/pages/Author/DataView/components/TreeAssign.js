import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { TreePanel } from '@/components';
import styles from './TreeAssign.less';

@connect(({ dataView, loading }) => ({ dataView, loading }))
class TreeAssign extends PureComponent {
  componentDidMount() {
    this.loadAssignedData();
  }

  loadAssignedData = () => {
    const { dispatch, currentDataAuthorType, currentRoleId } = this.props;
    if (currentDataAuthorType && currentRoleId) {
      dispatch({
        type: 'dataView/getAssignedAuthTreeDataList',
        payload: {
          authTypeId: currentDataAuthorType.id,
          roleId: currentRoleId,
        },
      });
    }
  };

  render() {
    const { currentDataAuthorType, dataView, loading } = this.props;
    const { assignData } = dataView;
    return (
      <div className={cls(styles['tree-assign-box'])}>
        <div className="header-box">
          <span>{currentDataAuthorType.name}</span>
        </div>
        <TreePanel
          className="assign-box"
          checkable={false}
          dataSource={assignData}
          loading={loading.effects['dataView/getAssignedAuthTreeDataList']}
        />
      </div>
    );
  }
}

export default TreeAssign;
