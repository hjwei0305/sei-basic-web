import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, } from "antd";
import TablePanel from './components/TablePanel';
import { PageWrapper, } from '@/components';
import CustomerUserConfig from './components/CustomerUserConfig';
import styles from "./index.less";

@withRouter
@connect(({ customerUser, loading, }) => ({ customerUser, loading, }))
class CustomerUser extends Component {

  render() {
    const { customerUser, loading,  } = this.props;
    const { showConfig, rowData, } = customerUser;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <div style={{ height: '100%', display: !showConfig ? '' : 'none', }}>
            <TablePanel />
          </div>
          { rowData && showConfig ? (<CustomerUserConfig style={{ display: showConfig ? '' : 'none', }} />) : (null)}
        </Spin>
      </PageWrapper>
    );
  }
}

export default CustomerUser;
