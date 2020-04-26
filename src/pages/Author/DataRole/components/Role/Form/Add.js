import React, { Component } from 'react';
import { Button, Popover } from 'antd';
import cls from 'classnames';
import Form from './Form';
import styles from './index.less';


class RoleAdd extends Component {
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

  handlerShowChange = (visible) => {
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
        onVisibleChange={(visible) => this.handlerShowChange(visible)}
        overlayClassName={cls(styles['form-popover-box'])}
        content={<Form {...popoverProps} />}
      >
        <span className={cls('form-popover-box-trigger')}>
          <Button icon="plus" type="link">
            新建角色
          </Button>
        </span>
      </Popover>
    );
  }
}

export default RoleAdd;
