import React, { Component } from 'react';
import { Popover, Tooltip } from 'antd';
import { ExtIcon } from 'suid';
import cls from 'classnames';
import Form from './Form';
import styles from './index.less';

class TenantAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handlerPopoverHide = () => {
    this.setState({
      visible: false,
    });
  };

  handlerShowChange = visible => {
    this.setState({ visible });
  };

  render() {
    const { visible } = this.state;
    const popoverProps = {
      handlerPopoverHide: this.handlerPopoverHide,
      ...this.props,
    };
    return (
      <Popover
        trigger="click"
        placement="leftTop"
        visible={visible}
        key="form-popover-box"
        destroyTooltipOnHide
        onVisibleChange={v => this.handlerShowChange(v)}
        overlayClassName={cls(styles['form-popover-box'])}
        content={<Form {...popoverProps} />}
      >
        <Tooltip title="设置管理员">
          <span className={cls('form-popover-box-trigger', 'action-item', 'admin-add')}>
            <ExtIcon type="user-add" antd />
          </span>
        </Tooltip>
      </Popover>
    );
  }
}

export default TenantAdd;
