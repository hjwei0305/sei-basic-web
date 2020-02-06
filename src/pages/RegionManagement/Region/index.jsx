import React, { Component, Fragment, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Row, Col, Spin, Empty } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import TreePanel from './components/TreePanel';
import FormPanel from './components/FormPanel';
import styles from "./index.less";

@withRouter
@connect(({ region, loading, }) => ({ region, loading, }))
class Region extends Component {

  render() {
    const { region, loading } = this.props;
    const { selectedTreeNode } = region;

    return (
      <Row className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <Col className={cls('content-panel')} span={10}>
            <header className={cls('content-panel-title')}>
              <span>行政区域</span>
            </header>
            <div className={cls('content-panel-section')}>
              <TreePanel />
            </div>
          </Col>
          <Col className={cls('content-panel','right-panel')} span={14}>
            <header className={cls('content-panel-title')}>
              <span>{selectedTreeNode && selectedTreeNode.name}</span>
            </header>
            <div className={cls('content-panel-section')}>
              { selectedTreeNode ? (<FormPanel />) : (<Empty className={cls("empty-wrapper")} description="请选择左边的树节点进行操作" />) }
            </div>
          </Col>
        </Spin>
      </Row>
    );
  }
}

export default Region;