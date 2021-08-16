import React, { Component } from 'react';
import cls from 'classnames';
import { Popover, Tooltip } from 'antd';
import { ExtIcon } from 'suid';
import Form from './Form';
import styles from './index.less';

class GroupEdit extends Component {
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
        <Tooltip title={formatMessage({id: 'basic_000319', defaultMessage: '管理员'})}>
          <span className={cls('form-popover-box-trigger', 'action-item')}>
            <ExtIcon type="user" antd />
          </span>
        </Tooltip>
      </Popover>
    );
  }
}

export default GroupEdit;
