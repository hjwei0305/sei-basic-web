import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, Empty } from 'antd';
import { CascadeLayout } from '@/components';
import { formatMessage } from 'umi-plugin-react/locale';
import TreePanel from './components/TreePanel';
import FormPanel from './components/FormPanel';
import styles from './index.less';

@connect(({ professionalDomain, loading }) => ({ professionalDomain, loading }))
class ProfessionalDomain extends Component {
  render() {
    const { professionalDomain, loading } = this.props;
    const { selectedTreeNode } = professionalDomain;

    return (
      <div className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls('spin-wrapper')}>
          <CascadeLayout title={[formatMessage({id: 'basic_000176', defaultMessage: '专业领域'}), selectedTreeNode && selectedTreeNode.name]}>
            <TreePanel slot="left" />
            {selectedTreeNode ? (
              <FormPanel slot="right" />
            ) : (
              <Empty
                slot="right"
                className={cls('empty-wrapper')}
                description={formatMessage({id: 'basic_000177', defaultMessage: '请选择左边的树节点进行操作'})}
              />
            )}
          </CascadeLayout>
        </Spin>
      </div>
    );
  }
}

export default ProfessionalDomain;
