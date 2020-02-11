import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, } from "antd";
import TablePanel from './components/TablePanel';
import { PageWrapper, } from '@/components';
import ExpertUserConfig from './components/ExpertUserConfig';
import styles from "./index.less";

@withRouter
@connect(({ expertUser, loading, }) => ({ expertUser, loading, }))
class ExpertUser extends Component {

  render() {
    const { expertUser, loading,  } = this.props;
    const { showConfig, rowData, } = expertUser;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <div style={{ height: '100%', display: !showConfig ? '' : 'none', }}>
            <TablePanel />
          </div>
          { rowData && showConfig ? (<ExpertUserConfig style={{ display: showConfig ? '' : 'none', }} />) : (null)}
        </Spin>
      </PageWrapper>
    );
  }
}

export default ExpertUser;
