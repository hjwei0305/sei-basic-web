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
class UserModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAssign: false,
    };
  }

  assignStation = (keys, callback) => {
    const { currentEmployee, dispatch } = this.props;
    const data = { parentId: get(currentEmployee, 'id', null), childIds: keys };
    dispatch({
      type: 'employee/assignStation',
      payload: {
        ...data,
      },
      callback,
    });
  };

  unAssignStation = (keys, callback) => {
    const { currentEmployee, dispatch } = this.props;
    const data = { parentId: get(currentEmployee, 'id', null), childIds: keys };
    dispatch({
      type: 'employee/unAssignStation',
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

  renderTitle = item => {
    const { showAssign } = this.state;
    const title = get(item, 'userName', '');
    if (showAssign) {
      return (
        <>
          <ExtIcon onClick={this.handlerBackAssigned} type="left" className="trigger-back" antd />
          <BannerTitle title={title} subTitle={formatMessage({id: 'basic_000171', defaultMessage: '请选择要添加的岗位'})} />
        </>
      );
    }
    return <BannerTitle title={title} subTitle={formatMessage({id: 'basic_000172', defaultMessage: '已配置的岗位'})} />;
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
      save: this.assignStation,
      saving: loading.effects['employee/assignStation'],
    };
    const assignedProps = {
      currentEmployee,
      onShowAssign: this.handlerShowAssign,
      save: this.unAssignStation,
      saving: loading.effects['employee/unAssignStation'],
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default UserModal;
