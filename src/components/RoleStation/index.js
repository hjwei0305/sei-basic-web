import React from 'react';
import { List, Skeleton } from 'antd';
import { ScrollBar } from 'suid';

const RoleStation = ({ stationData = [], loading }) => (
  <ScrollBar>
    <List
      dataSource={stationData}
      loading={loading}
      renderItem={item => (
        <List.Item key={item.id}>
          <Skeleton loading={loading} active>
            <List.Item.Meta
              title={
                <>
                  {item.name}
                  <span style={{ color: '#999', marginLeft: 8 }}>{`(${item.code})`}</span>
                </>
              }
              description={item.organizationNamePath}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  </ScrollBar>
);

export default RoleStation;
