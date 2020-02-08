import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Row, Col, Spin, Empty, } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import TablePanel from './components/TablePanel';
import TreeView from '@/components/TreeView';
import { CascadeLayout, PageWrapper, } from '@/components';
import EmployeeConfig from './components/EmployeeConfig';
import styles from "./index.less";

@withRouter
@connect(({ employee, loading, }) => ({ employee, loading, }))
class Employee extends Component {

  handleSelect = (selectNodes) => {
    if (selectNodes && selectNodes.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'employee/updateCurrNode',
        payload: {
          currNode: selectNodes[0],
        }
      }).then(({ currNode, }) => {
        dispatch({
          type: "employee/queryListByOrgId",
          payload: {
            organizationId: currNode.id,
          },
        });
      });
    }
  }


  render() {
    const { employee, loading,  } = this.props;
    const { treeData, currNode, showEmployeeConfig, rowData, } = employee;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <div style={{ height: '100%', display: !showEmployeeConfig ? '' : 'none', }}>
            <CascadeLayout title={['组织机构', currNode && currNode.name]} layout={[8, 16]}>
              <TreeView slot="left" treeData={treeData} onSelect={this.handleSelect} />
              { currNode ? (<TablePanel slot="right" />) : (<Empty slot="right" className={cls("empty-wrapper")} description="请选择左边的树节点进行操作" />) }
            </CascadeLayout>
          </div>
          { rowData && showEmployeeConfig ? (<EmployeeConfig style={{ display: showEmployeeConfig ? '' : 'none', }} />) : (null)}
        </Spin>
      </PageWrapper>
    );
  }
}

export default Employee;
