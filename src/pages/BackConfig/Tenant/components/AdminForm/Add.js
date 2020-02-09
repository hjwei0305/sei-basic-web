import React, { Component } from "react";
import { Popover } from "antd";
import cls from "classnames";
import Form from "./Form";
import styles from "./index.less";


class TenantAdd extends Component {

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
        <span className='admin-box'>
          设置管理员
        </span>
      </Popover>
    );
  }
}

export default TenantAdd;