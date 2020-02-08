import React, { PureComponent } from "react";
import { connect } from "dva";
import cls from "classnames";
import { Row, Col, Button } from 'antd';
import { ListPanel } from '@/components';
import styles from './ListAssign.less';


@connect(({ role, loading }) => ({ role, loading }))
class ListAssign extends PureComponent {

    componentDidMount() {
        this.loadAssignedData();
        this.loadUnAssignedData();
    }

    loadAssignedData = () => {
        const { dispatch, currentDataAuthorType, currentRole } = this.props;
        if (currentDataAuthorType && currentRole) {
            dispatch({
                type: 'role/getAssignedAuthDataList',
                payload: {
                    authTypeId: currentDataAuthorType.id,
                    roleId: currentRole.id,
                },
            });
        }
    };

    loadUnAssignedData = () => {
        const { dispatch, currentDataAuthorType, currentRole } = this.props;
        if (currentDataAuthorType && currentRole) {
            dispatch({
                type: 'role/getUnassignedAuthDataList',
                payload: {
                    authTypeId: currentDataAuthorType.id,
                    roleId: currentRole.id,
                },
            });
        }
    };

    handlerAssign = () => {

    };

    handlerRemove = () => {

    };

    render() {
        const { currentDataAuthorType, role, loading } = this.props;
        const { assignData, unAssignData } = role;
        return (
            <div className={cls(styles['list-assign-box'])} >
                <div className='header-box'>
                    <span>{`数据配置 (${currentDataAuthorType.name})`}</span>
                </div>
                <Row className={cls('list-body')} type="flex" justify="space-between" align="middle">
                    <Col key='left' span={11} className={cls('list-left')}>
                        <ListPanel
                            title='已分配'
                            dataSource={assignData}
                            loading={loading.effects['role/getAssignedAuthDataList']}
                        />
                    </Col>
                    <Col key='middle' className={cls('list-middle')} span={2} style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                        <Button
                            key="rightButton"
                            shape="circle"
                            icon="left"
                            style={{ marginBottom: 36 }}
                            onClick={this.handlerAssign}
                        />
                        <Button
                            key="leftButton"
                            shape="circle"
                            icon="right"
                            onClick={this.handlerRemove} />
                    </Col>
                    <Col key='right' span={11} className={cls('list-right')}>
                        <ListPanel
                            title='未分配'
                            dataSource={unAssignData}
                            loading={loading.effects['role/getUnassignedAuthDataList']}
                        />
                    </Col>
                </Row>
            </div >
        )
    }
}

export default ListAssign;