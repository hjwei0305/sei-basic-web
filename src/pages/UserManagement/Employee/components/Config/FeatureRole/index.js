import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { ExtModal, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import Assign from './Assign';
import Assinged from './Assigned';
import styles from './index.less';

@connect(({ employee, loading }) => ({
  employee,
  loading,
}))
class FeatureRoleModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAssign: false,
    };
  }

  assignFeatureRole = (keys, callback) => {
    const { currentEmployee, dispatch } = this.props;
    const data = { parentId: get(currentEmployee, 'id', null), childIds: keys };
    dispatch({
      type: 'employee/assignFeatureRole',
      payload: {
        ...data,
      },
      callback,
    });
  };

  unAssignFeatureRole = (keys, callback) => {
    const { currentEmployee, dispatch } = this.props;
    const data = { parentId: get(currentEmployee, 'id', null), childIds: keys };
    dispatch({
      type: 'employee/unAssignFeatureRole',
      payload: {
        ...data,
      },
      callback,
    });
  };

  handlerShowAssign = () => {
    this.setState({ showAssign: true });
  };

  handlerBackAssigned = () => {
    this.setState({ showAssign: false });
  };

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      closeModal();
    }
  };

  renderTitle = role => {
    const { showAssign } = this.state;
    const title = get(role, 'userName', '');
    if (showAssign) {
      return (
        <>
          <ExtIcon onClick={this.handlerBackAssigned} type="left" className="trigger-back" antd />
          <BannerTitle title={title} subTitle="请选择要添加的功能角色" />
        </>
      );
    }
    return <BannerTitle title={title} subTitle="已配置的功能角色" />;
  };

  render() {
    const { currentEmployee, showModal, loading } = this.props;
    const { showAssign } = this.state;
    const extModalProps = {
      destroyOnClose: true,
      maskClosable: false,
      onCancel: this.handlerCloseModal,
      wrapClassName: cls(styles['assign-modal-box'], showAssign ? styles['assign-to-box'] : null),
      closable: !showAssign,
      keyboard: !showAssign,
      visible: showModal,
      centered: true,
      width: 680,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      footer: null,
      title: this.renderTitle(currentEmployee),
    };
    const assignProps = {
      currentEmployee,
      onBackAssigned: this.handlerBackAssigned,
      save: this.assignFeatureRole,
      saving: loading.effects['employee/assignFeatureRole'],
    };
    const assignedProps = {
      currentEmployee,
      onShowAssign: this.handlerShowAssign,
      save: this.unAssignFeatureRole,
      saving: loading.effects['employee/unAssignFeatureRole'],
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default FeatureRoleModal;
