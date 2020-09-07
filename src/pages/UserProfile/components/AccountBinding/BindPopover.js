import React, { Component } from 'react';
import { Popover } from 'antd';
import BindFormItem from './BindFormItem';

class BindPopover extends Component {
  state = {
    visible: false,
  };

  handleVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  handleSave = item => {
    const { onSave } = this.props;
    this.handleVisibleChange(false);
    if (onSave) {
      onSave(item);
    }
  };

  render() {
    const { visible } = this.state;
    const { children, editData = {} } = this.props;
    return (
      <Popover
        content={<BindFormItem editData={editData} onSave={this.handleSave} />}
        title="绑定手机号"
        trigger="click"
        visible={visible}
        placement="right"
        onVisibleChange={this.handleVisibleChange}
        overlayStyle={{ width: 500 }}
      >
        {children}
      </Popover>
    );
  }
}

export default BindPopover;
