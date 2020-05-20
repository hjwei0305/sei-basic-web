import React, { PureComponent } from 'react';
import cls from 'classnames';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import UserView from './UserView';
import StationView from './StationView';
import styles from './ExtAction.less';

const { getUUID } = utils;
const { ROLE_VIEW } = constants;
const { Item } = Menu;

const menuData = () => [
  {
    title: '查看岗位',
    key: ROLE_VIEW.STATION,
    disabled: false,
    icon: 'flag',
  },
  {
    title: '查看用户',
    key: ROLE_VIEW.USER,
    disabled: false,
    icon: 'team',
  },
  {
    title: '配置岗位',
    key: ROLE_VIEW.CONFIG_STATION,
    disabled: false,
    icon: 'gold',
  },
  {
    title: '配置用户',
    key: ROLE_VIEW.CONFIG_USER,
    disabled: false,
    icon: 'solution',
  },
];

@connect(({ dataRole, loading }) => ({ dataRole, loading }))
class ExtAction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: '',
      assignUserData: [],
      assinStationData: [],
    };
  }

  componentDidUpdate() {
    const { dataRole } = this.props;
    const { assignUserData: stateAssignUserData } = this.state;
    if (!isEqual(stateAssignUserData, dataRole.assignUserData)) {
      this.setState({
        assignUserData: dataRole.assignUserData,
      });
    }
    if (!isEqual(stateAssignUserData, dataRole.assinStationData)) {
      this.setState({
        assinStationData: dataRole.assinStationData,
      });
    }
  }

  getUserData = () => {
    const { roleData, dispatch } = this.props;
    if (roleData) {
      dispatch({
        type: 'dataRole/getAssignedEmployeesByDataRole',
        payload: {
          childId: roleData.id,
        },
      });
    }
  };

  getStationData = () => {
    const { roleData, dispatch } = this.props;
    if (roleData) {
      dispatch({
        type: 'dataRole/getAssignedPositionsByDataRole',
        payload: {
          childId: roleData.id,
        },
      });
    }
  };

  onActionOperation = e => {
    e.domEvent.stopPropagation();
    if (e.key === ROLE_VIEW.STATION || e.key === ROLE_VIEW.USER) {
      this.setState(
        {
          selectedKeys: e.key,
          menuShow: true,
        },
        () => {
          if (e.key === ROLE_VIEW.USER) {
            this.getUserData();
          }
          if (e.key === ROLE_VIEW.STATION) {
            this.getStationData();
          }
        },
      );
    } else {
      this.setState({
        selectedKeys: '',
        menuShow: false,
      });
      const { onAction, roleData } = this.props;
      if (onAction) {
        onAction(e.key, roleData);
      }
    }
  };

  getMenu = (menus, record) => {
    const { loading } = this.props;
    const { selectedKeys, assignUserData, assinStationData } = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e, record)}
        selectedKeys={[selectedKeys]}
      >
        {menus.map(m => {
          if (m.key === ROLE_VIEW.USER) {
            return (
              <Item key={m.key}>
                <UserView
                  key={`user-${m.key}`}
                  loading={loading.effects['dataRole/getAssignedEmployeesByDataRole']}
                  assignUserData={assignUserData}
                  menuId={menuId}
                  title={m.title}
                  icon={m.icon}
                />
              </Item>
            );
          }
          if (m.key === ROLE_VIEW.STATION) {
            return (
              <Item key={m.key}>
                <StationView
                  loading={loading.effects['dataRole/getAssignedPositionsByDataRole']}
                  assinStationData={assinStationData}
                  menuId={menuId}
                  title={m.title}
                  icon={m.icon}
                />
              </Item>
            );
          }
          return (
            <Item key={m.key} disabled={m.disabled}>
              <span className="view-popover-box-trigger">
                <ExtIcon type={m.icon} antd />
                {m.title}
              </span>
            </Item>
          );
        })}
      </Menu>
    );
  };

  onVisibleChange = v => {
    const { selectedKeys } = this.state;
    this.setState({
      menuShow: v,
      selectedKeys: !v ? '' : selectedKeys,
    });
  };

  render() {
    const { roleData } = this.props;
    const { menuShow } = this.state;
    const menusData = menuData();
    return (
      <>
        {menusData.length > 0 ? (
          <Dropdown
            trigger={['click']}
            overlay={this.getMenu(menusData, roleData)}
            className="action-drop-down"
            placement="bottomLeft"
            visible={menuShow}
            onVisibleChange={this.onVisibleChange}
          >
            <ExtIcon className={cls('action-item')} type="more" antd />
          </Dropdown>
        ) : null}
      </>
    );
  }
}

export default ExtAction;
