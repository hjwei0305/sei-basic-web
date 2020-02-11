import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, Empty } from "antd";
import TreePanel from './components/TreePanel';
import FormPanel from './components/FormPanel';
import { CascadeLayout, PageWrapper, } from '@/components';

import styles from "./index.less";

@withRouter
@connect(({ region, loading, }) => ({ region, loading, }))
class Region extends Component {

  render() {
    const { region, loading } = this.props;
    const { selectedTreeNode } = region;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <CascadeLayout title={['行政区域', selectedTreeNode && selectedTreeNode.name]}>
            <TreePanel slot="left" />
            { selectedTreeNode ? (<FormPanel slot="right" />) : (<Empty slot="right" className={cls("empty-wrapper")} description="请选择左边的树节点进行操作" />) }
          </CascadeLayout>
        </Spin>
      </PageWrapper>
    );
  }
}

export default Region;
