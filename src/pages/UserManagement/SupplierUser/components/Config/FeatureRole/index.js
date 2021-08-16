import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { ExtModal, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { formatMessage } from 'umi-plugin-react/locale';
import Assign from './Assign';
import Assinged from './Assigned';
import styles from './index.less';

@connect(({ supplierUser, loading }) => ({
  supplierUser,
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
    const { currentSupplier, dispatch } = this.props;
    const data = { parentId: get(currentSupplier, 'id', null), childIds: keys };
    dispatch({
      type: 'supplierUser/assignFeatureRole',
      payload: {
        ...data,
      },
      callback,
    });
  };

  unAssignFeatureRole = (keys, callback) => {
    const { currentSupplier, dispatch } = this.props;
    const data = { parentId: get(currentSupplier, 'id', null), childIds: keys };
    dispatch({
      type: 'supplierUser/unAssignFeatureRole',
      payload: {
        ...data,
      },
      callback,
    });
  };

  handlerSaveEffectDate = (data, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierUser/saveAssignFeatureRoleEffective',
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
          <BannerTitle title={title} subTitle={formatMessage({id: 'basic_000128', defaultMessage: '请选择要添加的功能角色'})} />
        </>
      );
    }
    return <BannerTitle title={title} subTitle={formatMessage({id: 'basic_000129', defaultMessage: '已配置的功能角色'})} />;
  };

  render() {
    const { currentSupplier, showModal, loading } = this.props;
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
      title: this.renderTitle(currentSupplier),
    };
    const assignProps = {
      currentSupplier,
      onBackAssigned: this.handlerBackAssigned,
      save: this.assignFeatureRole,
      saving: loading.effects['supplierUser/assignFeatureRole'],
    };
    const assignedProps = {
      currentSupplier,
      onShowAssign: this.handlerShowAssign,
      save: this.unAssignFeatureRole,
      saving: loading.effects['supplierUser/unAssignFeatureRole'],
      onSaveEffectDate: this.handlerSaveEffectDate,
      effectDateSaving: loading.effects['supplierUser/saveAssignFeatureRoleEffective'],
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default FeatureRoleModal;
