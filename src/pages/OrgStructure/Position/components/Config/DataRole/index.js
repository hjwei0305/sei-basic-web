import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { ExtModal, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import Assign from './Assign';
import Assinged from './Assigned';
import styles from './index.less';

@connect(({ position, loading }) => ({
  position,
  loading,
}))
class DataRoleModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAssign: false,
    };
  }

  assignDataRole = (keys, callback) => {
    const { currentPosition, dispatch } = this.props;
    const data = { parentId: get(currentPosition, 'id', null), childIds: keys };
    dispatch({
      type: 'position/assignDataRole',
      payload: {
        ...data,
      },
      callback,
    });
  };

  unAssignDataRole = (keys, callback) => {
    const { currentPosition, dispatch } = this.props;
    const data = { parentId: get(currentPosition, 'id', null), childIds: keys };
    dispatch({
      type: 'position/unAssignDataRole',
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
    const title = get(role, 'name', '');
    if (showAssign) {
      return (
        <>
          <ExtIcon onClick={this.handlerBackAssigned} type="left" className="trigger-back" antd />
          <BannerTitle title={title} subTitle={formatMessage({id: 'basic_000137', defaultMessage: '请选择要添加的数据角色'})} />
        </>
      );
    }
    return <BannerTitle title={title} subTitle={formatMessage({id: 'basic_000138', defaultMessage: '已配置的数据角色'})} />;
  };

  render() {
    const { currentPosition, showModal, loading } = this.props;
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
      title: this.renderTitle(currentPosition),
    };
    const assignProps = {
      currentPosition,
      onBackAssigned: this.handlerBackAssigned,
      save: this.assignDataRole,
      saving: loading.effects['position/assignDataRole'],
    };
    const assignedProps = {
      currentPosition,
      onShowAssign: this.handlerShowAssign,
      save: this.unAssignDataRole,
      saving: loading.effects['position/unAssignDataRole'],
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default DataRoleModal;
