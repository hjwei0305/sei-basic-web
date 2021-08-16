import React, { PureComponent } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { get } from 'lodash';
import { TreePanel, BannerTitle } from '@/components';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './TreeAssign.less';

@connect(({ userDataAuthView, loading }) => ({ userDataAuthView, loading }))
class ListAssign extends PureComponent {
  componentDidMount() {
    this.loadAssignedData();
  }

  loadAssignedData = () => {
    const { dispatch, currentDataAuthorType, currentRoleId } = this.props;
    if (currentDataAuthorType && currentRoleId) {
      dispatch({
        type: 'userDataAuthView/getAssignedAuthTreeDataList',
        payload: {
          authTypeId: currentDataAuthorType.id,
          roleId: currentRoleId,
        },
      });
    }
  };

  render() {
    const { currentDataAuthorType, userDataAuthView, loading } = this.props;
    const { assignData } = userDataAuthView;
    return (
      <div className={cls(styles['tree-assign-box'])}>
        <div className="header-box">
          <span>
            <BannerTitle
              title={get(currentDataAuthorType, 'name', '')}
              subTitle={formatMessage({id: 'basic_000114', defaultMessage: '已配置的数据权限'})}
            />
          </span>
        </div>
        <div className={cls('list-body')}>
          <TreePanel
            className="assign-box"
            checkable={false}
            dataSource={assignData}
            loading={loading.effects['userDataAuthView/getAssignedAuthTreeDataList']}
          />
        </div>
      </div>
    );
  }
}

export default ListAssign;
