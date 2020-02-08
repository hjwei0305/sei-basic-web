import React, { Component, Fragment, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, Empty } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { CascadeLayout, PageWrapper, } from '@/components';
import DataDictTypeTable from './components/DataDictTypeTable';
import DataDictTable from './components/DataDictTable';
import styles from "./index.less";

@withRouter
@connect(({ dataDict, loading, }) => ({ dataDict, loading, }))
class DataDict extends Component {

  render() {
    const { dataDict, loading } = this.props;
    const { rowData } = dataDict;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <CascadeLayout title={['数据字典类型', '数据字典']}>
            <DataDictTypeTable slot="left" />
            <DataDictTable slot="right" />
          </CascadeLayout>
        </Spin>
      </PageWrapper>
    );
  }
}

export default DataDict;
