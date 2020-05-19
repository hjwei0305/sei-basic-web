/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-05-19 17:35:34
 */
import React, { Component } from 'react';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { Button, Row, Col } from 'antd';
import { ListLoader, ListCard, utils } from 'suid';
import { constants } from '@/utils';
import Organization from './Organization';
import styles from './index.less';

const { formatMsg, request } = utils;
const { SERVER_PATH } = constants;

class StationSelected extends Component {
  static listCardRef;

  constructor(props) {
    super(props);
    this.state = {
      orgId: null,
      assignedLoading: false,
      assignedStation: [],
      assignedSelectedStationKeys: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { roleId } = this.props;
    if (roleId && !isEqual(prevProps.roleId, roleId)) {
      this.getAssignedStationData();
    }
  }

  getAssignedStationData = () => {
    const { roleId } = this.props;
    const params = {
      url: `${SERVER_PATH}/sei-basic/positionFeatureRole/getParentsFromChildId`,
      params: {
        childId: roleId,
      },
    };
    this.setState({ assignedLoading: true });
    request(params)
      .then(res => {
        if (res.success) {
          const assignedStation = [...res.data];
          const assignedSelectedStationKeys = assignedStation.map(a => a.id);
          this.setState({
            assignedStation,
            assignedSelectedStationKeys,
          });
        }
      })
      .finally(() => {
        this.setState({ assignedLoading: false });
      });
  };

  handlerOrganizationChange = orgId => {
    this.setState({ orgId });
  };

  renderCustomTool = data => {
    const { checkedList = {}, total = 0 } = data;
    const keys = Object.keys(checkedList);
    return (
      <>
        <Button
          size="small"
          onClick={e => this.removeAssignedStation(e)}
          disabled={keys.length === 0}
          type="danger"
        >
          {formatMsg('移除 ({count})', { count: keys.length })}
        </Button>
        <span style={{ marginLeft: 8 }}>{formatMsg('共 {count} 项', { count: total })}</span>
      </>
    );
  };

  removeAssignedStation = e => {
    e && e.stopPropagation();
    const users = [];
    const removedUsers = [];
    const { assignedSelectedStationKeys = [], assignedStation = [] } = this.state;
    assignedStation.forEach(u => {
      if (assignedSelectedStationKeys.indexOf(u.id) === -1) {
        users.push(u);
      } else {
        removedUsers.push(u);
      }
    });
    this.setState(
      {
        assignedStation: users,
      },
      () => {
        this.listCardRef.manualUpdateItemChecked(removedUsers);
        this.handlerSelectChange();
      },
    );
  };

  handerAssignStationSelectChange = (_keys, items) => {
    this.setState(
      {
        assignedStation: items,
      },
      this.handlerSelectChange,
    );
  };

  handerAssignedUserSelectChange = assignedSelectedStationKeys => {
    this.setState({ assignedSelectedStationKeys });
  };

  handlerOrganizationAfterLoaded = orgId => {
    this.setState({ orgId });
  };

  handlerSelectChange = () => {
    const { onSelectChange } = this.props;
    const { assignedStation = [] } = this.state;
    const keys = assignedStation.map(u => u.id);
    if (onSelectChange) {
      onSelectChange(keys);
    }
  };

  render() {
    const { orgId, assignedStation, assignedLoading } = this.state;
    const { roleId } = this.props;
    const listCardProps = {
      className: 'anyone-user-box',
      title: '可选择的岗位',
      bordered: false,
      cascadeParams: {
        organizationId: orgId,
      },
      searchPlaceHolder: '输入岗位名称关键字查询',
      checkbox: true,
      itemField: {
        title: item => item.name,
        description: item =>
          item.organizationName ? (
            <span style={{ fontSize: 12 }}>{item.organizationName}</span>
          ) : (
            ''
          ),
      },
      searchProperties: ['name'],
      remotePaging: true,
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/position/queryPositions`,
        params: { excludeFeatureRoleId: roleId, includeSubNode: true },
      },
      onSelectChange: this.handerAssignStationSelectChange,
      onListCardRef: ref => (this.listCardRef = ref),
    };
    const assignedListCardProps = {
      className: 'anyone-user-box',
      title: formatMsg('已选岗位 ({count})', { count: assignedStation.length }),
      bordered: false,
      checkbox: true,
      pagination: false,
      dataSource: assignedStation,
      loading: assignedLoading,
      itemField: {
        title: item => item.name,
        description: item =>
          item.organizationName ? (
            <span style={{ fontSize: 12 }}>{item.organizationName}</span>
          ) : (
            ''
          ),
      },
      showArrow: false,
      showSearch: false,
      customTool: this.renderCustomTool,
      onSelectChange: this.handerAssignedUserSelectChange,
    };
    return (
      <Row gutter={4} className={cls(styles['station-panel-box'])} style={{ margin: 0 }}>
        <Col span={6} className={cls('auto-height')}>
          <Organization
            onSelectChange={this.handlerOrganizationChange}
            onAfterLoaded={this.handlerOrganizationAfterLoaded}
          />
        </Col>
        <Col span={9} className={cls('auto-height')}>
          {orgId ? <ListCard {...listCardProps} /> : <ListLoader />}
        </Col>
        <Col span={9} className={cls('auto-height')}>
          <ListCard {...assignedListCardProps} />
        </Col>
      </Row>
    );
  }
}

export default StationSelected;
