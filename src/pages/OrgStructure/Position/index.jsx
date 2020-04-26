import React, { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, Empty } from 'antd';
import TablePanel from './components/TablePanel';
import TreeView from '@/components/TreeView';
import { CascadeLayout, PageWrapper } from '@/components';
import PostionConfig from './components/PostionConfig';
import styles from './index.less';

@withRouter
@connect(({ position, loading }) => ({ position, loading }))
class Position extends Component {
  handleSelect = (selectNodes) => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'position/updateCurrNode',
        payload: {
          currNode: selectNodes[0],
        },
      }).then(({ currNode }) => {
        dispatch({
          type: 'position/queryListByOrgId',
          payload: {
            organizationId: currNode.id,
          },
        });
      });
    }
  }


  render() {
    const { position, loading } = this.props;
    const { treeData, currNode, showPosionConfig, rowData } = position;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls('spin-wrapper')}>
          <div style={{ height: '100%', display: !showPosionConfig ? '' : 'none' }}>
            <CascadeLayout title={['组织机构', currNode && currNode.name]} layout={[8, 16]}>
              <TreeView slot="left" treeData={treeData} onSelect={this.handleSelect} />
              { currNode ? (<TablePanel slot="right" slotClassName={cls('table-slot-container')} />) : (<Empty slot="right" className={cls('empty-wrapper')} description="请选择左边的树节点进行操作" />) }
            </CascadeLayout>
          </div>
          { rowData && showPosionConfig ? (<PostionConfig style={{ display: showPosionConfig ? '' : 'none' }} />) : (null)}
        </Spin>
      </PageWrapper>
    );
  }
}

export default Position;
