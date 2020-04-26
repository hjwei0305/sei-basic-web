import React, { Component } from 'react';
import cls from 'classnames';
import { isEqual, cloneDeep } from 'lodash';

import { Button, Input, Pagination, List, Skeleton, Checkbox, Drawer } from 'antd';
import { ScrollBar } from 'suid';
import styles from './UnAssignAppModuleItem.less';

const { Search } = Input;

class UnAssignAppModuleItem extends Component {
  static allValue = '';

  static data = [];

  constructor(props) {
    super(props);
    this.state = {
      selectAll: false,
      selectIndeterminate: false,
      checkedList: {},
      unAssignListData: [],
      pagination: {
        current: 1,
        pageSize: 30,
        total: 0,
      },
    };
  }

  componentDidUpdate(prevProps) {
    const { unAssignListData } = this.props;
    if (!isEqual(prevProps.unAssignListData, unAssignListData)) {
      const { pagination } = this.state;
      this.data = [...unAssignListData];
      this.setState({
        unAssignListData,
        checkedList: {},
        selectAll: false,
        selectIndeterminate: false,
        pagination: {
          ...pagination,
          total: unAssignListData.length,
        },
      });
    }
  }

  handlerSearchChange = v => {
    this.allValue = v;
  };

  handlerSearch = () => {
    const { pagination } = this.state;
    const unAssignListData = this.getLocalFilterData();
    this.setState({
      selectAll: false,
      selectIndeterminate: false,
      checkedList: {},
      unAssignListData,
      pagination: {
        ...pagination,
        total: unAssignListData.length,
      },
    });
  };

  getLocalFilterData = () => {
    let listData = [];
    if (this.allValue) {
      const valueKey = this.allValue.toLowerCase();
      listData = this.data.filter(
        ds =>
          ds.name.toLowerCase().indexOf(valueKey) > -1 ||
          ds.code.toLowerCase().indexOf(valueKey) > -1,
      );
    } else {
      listData = [...this.data];
    }
    return listData;
  };

  handlerPageChange = (current, pageSize) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          current,
          pageSize,
        },
      },
      () => {
        const newData = this.getLocalFilterData();
        const unAssignListData = newData.slice((current - 1) * pageSize, current * pageSize);
        this.setState({
          unAssignListData,
        });
      },
    );
  };

  assignAppModuleItem = e => {
    e && e.stopPropagation();
    const { assignAppModuleItem } = this.props;
    const { checkedList } = this.state;
    const childIds = [];
    if (Object.keys(checkedList).length > 0) {
      Object.keys(checkedList).forEach(key => childIds.push(key));
    }
    if (assignAppModuleItem) {
      assignAppModuleItem(childIds);
    }
  };

  handlerClose = () => {
    const { closeAssignFeatureItem } = this.props;
    if (closeAssignFeatureItem) {
      closeAssignFeatureItem();
    }
  };

  handlerItemCheck = item => {
    const { checkedList, unAssignListData } = this.state;
    const checkedKeys = cloneDeep(checkedList);
    let selectAll = false;
    let selectIndeterminate = false;
    if (checkedList[item.id]) {
      delete checkedKeys[item.id];
    } else {
      checkedKeys[item.id] = item.id;
    }
    const keys = Object.keys(checkedKeys);
    if (keys.length > 0) {
      selectIndeterminate = true;
      if (keys.length === unAssignListData.length) {
        selectAll = true;
        selectIndeterminate = false;
      }
    }
    this.setState({
      selectIndeterminate,
      selectAll,
      checkedList: checkedKeys,
    });
  };

  onSelectAllChange = e => {
    const { checkedList, unAssignListData } = this.state;
    let checkedKeys = cloneDeep(checkedList);
    let selectAll = false;
    if (e.target.checked) {
      unAssignListData.forEach(row => {
        checkedKeys[row.id] = row.id;
      });
      selectAll = true;
    } else {
      checkedKeys = {};
    }
    this.setState({
      selectAll,
      selectIndeterminate: false,
      checkedList: checkedKeys,
    });
  };

  render() {
    const { showAssignAppModule, assigning, loading } = this.props;
    const {
      allValue,
      unAssignListData,
      pagination,
      checkedList,
      selectAll,
      selectIndeterminate,
    } = this.state;
    const checkCount = Object.keys(checkedList).length;
    return (
      <Drawer
        width={420}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showAssignAppModule}
        title="未分配的应用模块"
        className={cls(styles['feature-item-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <div className="header-tool-box">
          <Button
            loading={assigning}
            type="primary"
            disabled={checkCount === 0}
            onClick={e => this.assignAppModuleItem(e)}
          >
            {`确定 (${checkCount})`}
          </Button>
          <Search
            placeholder="输入名称关键字查询"
            defaultValue={allValue}
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: 172 }}
          />
        </div>
        <div className="list-tool-box">
          <Checkbox
            checked={selectAll}
            indeterminate={selectIndeterminate}
            onChange={this.onSelectAllChange}
          >
            全选
          </Checkbox>
          <span className="tool-desc">{`共 ${unAssignListData.length} 项`}</span>
        </div>
        <div className="list-body">
          <ScrollBar>
            <List
              dataSource={unAssignListData}
              loading={loading}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  onClick={() => this.handlerItemCheck(item)}
                  className={cls({ checked: !!checkedList[item.id] })}
                  actions={[]}
                >
                  <Skeleton avatar loading={loading} active>
                    <List.Item.Meta
                      avatar={<Checkbox checked={!!checkedList[item.id]} />}
                      title={item.name}
                      description={item.code}
                    />
                  </Skeleton>
                </List.Item>
              )}
            />
          </ScrollBar>
        </div>
        <div className="list-page-bar">
          <Pagination simple onChange={this.handlerPageChange} {...pagination} />
        </div>
      </Drawer>
    );
  }
}

export default UnAssignAppModuleItem;
