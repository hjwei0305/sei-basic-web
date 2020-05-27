import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Row, Col, Tag } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import { EffectDate } from '@/components';

const { SERVER_PATH, ROLE_TYPE } = constants;

class RoleSelect extends PureComponent {
  static propTypes = {
    currentEmployee: PropTypes.object,
    featureRoleSelectedKeys: PropTypes.array,
    dataRoleSelectedKeys: PropTypes.array,
    onFeatureRoleChange: PropTypes.func,
    onDataRoleChange: PropTypes.func,
  };

  static defaultProps = {
    featureRoleSelectedKeys: [],
    dataRoleSelectedKeys: [],
  };

  handerFeatureRoleSelectChange = (keys, items) => {
    const { onFeatureRoleChange } = this.props;
    if (onFeatureRoleChange) {
      onFeatureRoleChange(keys, items);
    }
  };

  handerDataRoleSelectChange = (keys, items) => {
    const { onDataRoleChange } = this.props;
    if (onDataRoleChange) {
      onDataRoleChange(keys, items);
    }
  };

  renderRoleTypeRemark = item => {
    switch (item.roleType) {
      case ROLE_TYPE.CAN_USE:
        return <span style={{ color: '#52c41a', fontSize: 12 }}>{item.roleTypeRemark}</span>;
      case ROLE_TYPE.CAN_ASSIGN:
        return <span style={{ color: '#fa8c16', fontSize: 12 }}>{item.roleTypeRemark}</span>;
      default:
    }
  };

  renderName = row => {
    let tag;
    if (row.publicUserType && row.publicOrgId) {
      tag = (
        <Tag color="green" style={{ marginLeft: 8 }}>
          公共角色
        </Tag>
      );
    }
    return (
      <>
        {row.name}
        {tag}
      </>
    );
  };

  renderDescription = row => {
    let pubUserType;
    let publicOrg;
    if (row.publicUserType) {
      pubUserType = (
        <div className="field-item info">
          <span className="label">用户类型</span>
          <span className="value">{row.userTypeRemark}</span>
        </div>
      );
    }
    if (row.publicOrgId) {
      publicOrg = (
        <div className="field-item info">
          <span className="label">组织机构</span>
          <span className="value">{row.publicOrgName}</span>
        </div>
      );
    }
    return (
      <div className="desc-box">
        <div className="field-item">{row.code}</div>
        {publicOrg || pubUserType ? (
          <div className="public-box">
            {pubUserType}
            {publicOrg}
          </div>
        ) : null}
        <EffectDate effectiveFrom={row.effectiveFrom} effectiveTo={row.effectiveTo} isView />
      </div>
    );
  };

  render() {
    const { featureRoleSelectedKeys, dataRoleSelectedKeys, currentEmployee } = this.props;
    const currentEmployeeId = get(currentEmployee, 'id', null);
    const featureRoleProps = {
      title: '功能角色',
      bordered: false,
      checkbox: true,
      pagination: false,
      selectedKeys: featureRoleSelectedKeys,
      searchPlaceHolder: '输入代码或名称关键字',
      searchWidth: 190,
      itemField: {
        title: item => this.renderName(item),
        description: item => this.renderDescription(item),
        extra: item => this.renderRoleTypeRemark(item),
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/userFeatureRole/getChildrenFromParentId`,
        params: {
          parentId: currentEmployeeId,
        },
      },
      showArrow: false,
      onSelectChange: this.handerFeatureRoleSelectChange,
    };
    const dataRoleProps = {
      title: '数据角色',
      bordered: false,
      checkbox: true,
      pagination: false,
      selectedKeys: dataRoleSelectedKeys,
      searchPlaceHolder: '输入代码或名称关键字',
      searchWidth: 190,
      itemField: {
        title: item => this.renderName(item),
        description: item => this.renderDescription(item),
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/userDataRole/getChildrenFromParentId`,
        params: {
          parentId: currentEmployeeId,
        },
      },
      showArrow: false,
      onSelectChange: this.handerDataRoleSelectChange,
    };
    return (
      <Row gutter={4}>
        <Col span={12}>
          <ListCard {...featureRoleProps} />
        </Col>
        <Col span={12}>
          <ListCard {...dataRoleProps} />
        </Col>
      </Row>
    );
  }
}

export default RoleSelect;
