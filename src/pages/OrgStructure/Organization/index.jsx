import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, Empty } from "antd";
import { CascadeLayout, PageWrapper, } from '@/components';
import TreePanel from './components/TreePanel';
import FormPanel from './components/FormPanel';
import styles from "./index.less";

@withRouter
@connect(({ organization, loading, }) => ({ organization, loading, }))
class Organization extends Component {

  render() {
    const { organization, loading } = this.props;
    const { selectedTreeNode } = organization;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <CascadeLayout title={['组织机构ceshi', selectedTreeNode && selectedTreeNode.name]} layout={[10, 14]}>
            <TreePanel slot="left" />
            { selectedTreeNode ? (<FormPanel key={selectedTreeNode.id} slot="right" />) : (<Empty slot="right" className={cls("empty-wrapper")} description="请选择左边的树节点进行操作" />) }
          </CascadeLayout>
        </Spin>
      </PageWrapper>
    );
  }
}

export default Organization;
