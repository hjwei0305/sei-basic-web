import React, { Component, Fragment } from "react";
import cls from "classnames";
import { Dropdown, Menu } from "antd";
import { utils, ExtIcon } from 'seid';
import { constants } from '@/utils'
import styles from "./ExtAction.less";

const { getUUID } = utils;
const { ROLE_VIEW } = constants;
const { Item } = Menu;

const menuData = [
  {
    title: '查看岗位',
    key: ROLE_VIEW.SATION,
    disabled: false,
    icon: 'flag',
  },
  {
    title: '查看用户',
    key: ROLE_VIEW.USER,
    disabled: false,
    icon: 'user'
  }
];

export default class ExtAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: ""
    };
  }

  onActionOperation = (e, record) => {
    this.setState({
      selectedKeys: "",
      menuShow: false
    }, () => {
      this.props.action(e.key, record);
    });
  };

  getMenu = (menus, record) => {
    const { selectedKeys } = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles["action-menu-box"])}
        onClick={e => this.onActionOperation(e, record)}
        selectedKeys={[selectedKeys]}
      >
        {
          menus.map(m => {
            return (
              <Item
                key={m.key}
                disabled={m.disabled}
              >
                <ExtIcon type={m.icon} antd />
                {m.title}
              </Item>
            );
          })
        }
      </Menu>
    );
  };

  onVisibleChange = v => {
    this.setState({
      menuShow: v
    });
  };

  render() {
    const { roleData } = this.props;
    const { menuShow } = this.state;
    return (
      <Fragment>
        {
          menuData.length > 0
            ? <Dropdown
              trigger={["click"]}
              overlay={this.getMenu(menuData, roleData)}
              className="action-drop-down"
              placement="bottomLeft"
              visible={menuShow}
              onVisibleChange={this.onVisibleChange}
            >
              <ExtIcon className={cls('action-item')} type="more" antd />
            </Dropdown>
            : null
        }
      </Fragment>
    );
  }
}
