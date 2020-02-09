import React, { Component } from "react";
import cls from "classnames";
import { Popover } from "antd";
import { ExtIcon } from 'seid';
import Form from "./Form";
import styles from "./index.less";


 class GroupEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handlerPopoverHide = () => {
    this.setState({
      visible: false
    });
  };

  handlerShowChange = visible => {
    this.setState({ visible });
  };

  render() {
    const { visible } = this.state;
    const popoverProps = {
      handlerPopoverHide: this.handlerPopoverHide,
      ...this.props
    };
    return (
      <Popover
        trigger="click"
        placement="leftTop"
        visible={visible}
        key="form-popover-box"
        destroyTooltipOnHide
        onVisibleChange={visible => this.handlerShowChange(visible)}
        overlayClassName={cls(styles["form-popover-box"])}
        content={<Form {...popoverProps} />}
      >
        <span className={cls("form-popover-box-trigger", 'action-item')}>
          <ExtIcon type="edit" antd />
        </span>
      </Popover>
    );
  }
}

export default GroupEdit;