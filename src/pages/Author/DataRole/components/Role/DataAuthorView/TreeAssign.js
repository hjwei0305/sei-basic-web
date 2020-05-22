import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { TreePanel, BannerTitle } from '@/components';
import styles from './TreeAssign.less';

@connect(({ dataRole, loading }) => ({ dataRole, loading }))
class ListAssign extends PureComponent {
  componentDidMount() {
    this.loadAssignedData();
  }

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

  render() {
    const { currentDataAuthorType, dataRole, loading } = this.props;
    const { assignData } = dataRole;
    return (
      <div className={cls(styles['tree-assign-box'])}>
        <div className="header-box">
          <span>
            <BannerTitle
              title={get(currentDataAuthorType, 'name', '')}
              subTitle="已配置的数据权限"
            />
          </span>
        </div>
        <div className={cls('list-body')}>
          <TreePanel
            className="assign-box"
            checkable={false}
            dataSource={assignData}
            loading={loading.effects['dataRole/getAssignedAuthTreeDataList']}
          />
        </div>
      </div>
    );
  }
}

export default ListAssign;
