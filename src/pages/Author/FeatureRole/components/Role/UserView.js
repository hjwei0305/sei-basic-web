import React, { Component } from "react";
import { Popover } from "antd";
import cls from "classnames";
import { ExtIcon } from 'seid';
import { RoleUser } from '@/components';
import styles from "./View.less";

class UserView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handlerShowChange = visible => {
    this.setState({ visible });
  };

  render() {
    const { visible } = this.state;
    const { title, icon, menuId, loading, assignUserData } = this.props;
    const roleUserProps = {
      userData: assignUserData,
      loading,
    };
    return (
      <Popover
        trigger="click"
        placement="rightTop"
        visible={visible}
        key="role-user-view-popover-box"
        destroyTooltipOnHide
        getPopupContainer={() => document.getElementById(menuId)}
        onVisibleChange={visible => this.handlerShowChange(visible)}
        overlayClassName={cls(styles["view-popover-box"])}
        content={<RoleUser {...roleUserProps} />}
      >
        <span className={cls("view-popover-box-trigger")}>
          <ExtIcon type={icon} antd />
          {title}
        </span>
      </Popover>
    );
  }
}

export default UserView;