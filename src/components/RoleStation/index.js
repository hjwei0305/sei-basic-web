import React from 'react';
import { List, Skeleton } from "antd";
import { ScrollBar } from 'seid'

const RoleStation = ({ stationData = [], loading }) => {
    return (
        <ScrollBar>
            <List
                dataSource={stationData}
                loading={loading}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <Skeleton loading={loading} active>
                            <List.Item.Meta
                                title={item.name}
                                description={item.positionCategoryName}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </ScrollBar>
    )
};

export default RoleStation;