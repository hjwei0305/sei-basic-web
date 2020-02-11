import React, { PureComponent } from "react";
import { connect } from "dva";
import cls from "classnames";
import { Row, Col, Button } from 'antd';
import { TreePanel } from '@/components';
import styles from './TreeAssign.less';


@connect(({ role, loading }) => ({ role, loading }))
class ListAssign extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            assignCheckedKeys: [],
            unAssignCheckedKeys: [],
            assignBtnDisabled: true,
            unAssignBtnDisabled: true,
        };
    }

    componentDidMount() {
        this.loadAssignedData();
        this.loadUnAssignedData();
    }

    loadAssignedData = () => {
        const { dispatch, currentDataAuthorType, currentRole } = this.props;
        if (currentDataAuthorType && currentRole) {
            dispatch({
                type: 'role/getAssignedAuthTreeDataList',
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
                type: 'role/getUnassignedAuthTreeDataList',
                payload: {
                    authTypeId: currentDataAuthorType.id,
                    roleId: currentRole.id,
                },
            });
        }
    };

    handlerAssign = () => {
        const { assignCheckedKeys } = this.state;
        const { dispatch, currentDataAuthorType, currentRole } = this.props;
        if (currentDataAuthorType && currentRole) {
            dispatch({
                type: 'role/saveAssignRelations',
                payload: {
                    dataAuthorizeTypeId: currentDataAuthorType.id,
                    dataRoleId: currentRole.id,
                    entityIds: assignCheckedKeys,
                },
                callback: re => {
                    if (re.success) {
                        this.loadAssignedData();
                        this.loadUnAssignedData();
                    }
                }
            });
        }
    };

    handlerRemove = () => {
        const { unAssignCheckedKeys } = this.state;
        const { dispatch, currentDataAuthorType, currentRole } = this.props;
        if (currentDataAuthorType && currentRole) {
            dispatch({
                type: 'role/removeAssignRelations',
                payload: {
                    dataAuthorizeTypeId: currentDataAuthorType.id,
                    dataRoleId: currentRole.id,
                    entityIds: unAssignCheckedKeys,
                },
                callback: re => {
                    if (re.success) {
                        this.loadAssignedData();
                        this.loadUnAssignedData();
                    }
                }
            });
        }
    };

    assignHandlerSelectChange = (checkedList) => {
        const unAssignCheckedKeys = Object.keys(checkedList);
        let unAssignBtnDisabled = true;
        if (unAssignCheckedKeys.length > 0) {
            unAssignBtnDisabled = false;
        }
        this.setState({
            unAssignBtnDisabled,
            unAssignCheckedKeys,
        });
    };

    unAssignHandlerSelectChange = (checkedList) => {
        const assignCheckedKeys = Object.keys(checkedList);
        let assignBtnDisabled = true;
        if (assignCheckedKeys.length > 0) {
            assignBtnDisabled = false;
        }
        this.setState({
            assignBtnDisabled,
            assignCheckedKeys,
        });
    };

    render() {
        const { currentDataAuthorType, role, loading } = this.props;
        const { assignData, unAssignData } = role;
        const { assignBtnDisabled, unAssignBtnDisabled } = this.state;
        return (
            <div className={cls(styles['tree-assign-box'])} >
                <div className='header-box'>
                    <span>{`数据配置 (${currentDataAuthorType.name})`}</span>
                </div>
                <Row className={cls('list-body')} type="flex" justify="space-between" align="middle">
                    <Col key='left' span={11} className={cls('list-left')}>
                        <TreePanel
                            title='已分配'
                            className='assign-box'
                            dataSource={assignData}
                            loading={loading.effects['role/getAssignedAuthTreeDataList']}
                            onSelectChange={this.assignHandlerSelectChange}
                        />
                    </Col>
                    <Col key='middle' className={cls('list-middle')} span={2} style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                        <Button
                            key="rightButton"
                            shape="circle"
                            icon="left"
                            loading={loading.effects['role/saveAssignRelations']}
                            disabled={assignBtnDisabled}
                            style={{ marginBottom: 36 }}
                            onClick={this.handlerAssign}
                        />
                        <Button
                            key="leftButton"
                            shape="circle"
                            icon="right"
                            loading={loading.effects['role/removeAssignRelations']}
                            disabled={unAssignBtnDisabled}
                            onClick={this.handlerRemove} />
                    </Col>
                    <Col key='right' span={11} className={cls('list-right')}>
                        <TreePanel
                            title='未分配'
                            dataSource={unAssignData}
                            onSelectChange={this.unAssignHandlerSelectChange}
                            loading={loading.effects['role/getUnassignedAuthTreeDataList']}
                        />
                    </Col>
                </Row>
            </div >
        )
    }
}

export default ListAssign;