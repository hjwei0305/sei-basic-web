import React from 'react';
import { Row, Col, Tag } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import { EffectDate } from '@/components';

const { ROLE_TYPE } = constants;

const renderRoleTypeRemark = item => {
  switch (item.roleType) {
    case ROLE_TYPE.CAN_USE:
      return <span style={{ color: '#52c41a', fontSize: 12 }}>{item.roleTypeRemark}</span>;
    case ROLE_TYPE.CAN_ASSIGN:
      return <span style={{ color: '#fa8c16', fontSize: 12 }}>{item.roleTypeRemark}</span>;
    default:
  }
};

const renderName = row => {
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

const renderUserTitle = item => {
  return (
    <>
      {item.userName}
      <span style={{ color: '#999', marginLeft: 8 }}>{`(${item.code})`}</span>
    </>
  );
};

const renderDescription = row => {
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

const getDataSource = selected => {
  const { keys, items } = selected;
  return keys.map(key => items[key]);
};

const ResultSelect = ({ featureRoleSelected, dataRoleSelected, userSelected }) => {
  const featureRoleProps = {
    title: '选择的功能角色',
    bordered: false,
    pagination: false,
    showArrow: false,
    showSearch: false,
    itemField: {
      title: item => renderName(item),
      description: item => renderDescription(item),
      extra: item => renderRoleTypeRemark(item),
    },
    customTool: () => null,
    dataSource: getDataSource(featureRoleSelected),
  };
  const dataRoleProps = {
    title: '选择的功能角色',
    bordered: false,
    pagination: false,
    showArrow: false,
    showSearch: false,
    itemField: {
      title: item => renderName(item),
      description: item => renderDescription(item),
    },
    customTool: () => null,
    dataSource: getDataSource(dataRoleSelected),
  };
  const userProps = {
    title: '选择的用户',
    bordered: false,
    pagination: false,
    showArrow: false,
    showSearch: false,
    itemField: {
      title: item => renderUserTitle(item),
      description: item => item.organizationNamePath,
    },
    customTool: () => null,
    dataSource: getDataSource(userSelected),
  };

  return (
    <Row gutter={4}>
      <Col span={8}>
        <ListCard {...featureRoleProps} />
      </Col>
      <Col span={8}>
        <ListCard {...dataRoleProps} />
      </Col>
      <Col span={8}>
        <ListCard {...userProps} />
      </Col>
    </Row>
  );
};

export default ResultSelect;