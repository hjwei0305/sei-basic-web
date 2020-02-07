import React, { Component, Fragment, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Row, Col, Spin, } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import TablePanel from './components/TablePanel';
import TreeView from '@/components/TreeView';
import PostionConfig from './components/PostionConfig';
import styles from "./index.less";

@withRouter
@connect(({ position, loading, }) => ({ position, loading, }))
class Position extends Component {

  handleSelect = (selectNodes) => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'position/updateCurrNode',
        payload: {
          currNode: selectNodes[0],
        }
      }).then(({ currNode, }) => {
        dispatch({
          type: "position/queryListByOrgId",
          payload: {
            organizationId: currNode.id,
          },
        });
      });
    }
  }


  render() {
    const { position, loading,  } = this.props;
    const { treeData, currNode, showPosionConfig, rowData, } = position;

    return (
      <Fragment>
        <Row className={cls(styles['container-box'])}>
          <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
            <div style={{ height: '100%', display: !showPosionConfig ? '' : 'none', }}>
              <Col className={cls('content-panel')} span={8}>
                <header className={cls('content-panel-title')}>
                  <span>组织机构</span>
                </header>
                <div className={cls('content-panel-section')}>
                  <TreeView treeData={treeData} onSelect={this.handleSelect}/>
                </div>
              </Col>
              <Col className={cls('content-panel','right-panel')} span={16}>
                <header className={cls('content-panel-title')}>
                  <span>{currNode && currNode.name}</span>
                </header>
                <div className={cls('content-panel-section')}>
                  <TablePanel />
                </div>
              </Col>
            </div>
            { rowData && showPosionConfig ? (<PostionConfig style={{ display: showPosionConfig ? '' : 'none', }} />) : (null)}
          </Spin>
        </Row>
      </Fragment>
    );
  }
}

export default Position;
