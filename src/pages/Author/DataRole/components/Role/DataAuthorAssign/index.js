import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { ExtModal, ExtIcon } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import { BannerTitle } from '@/components';
import Assinged from './Assigned';
import Assign from './Assign';
import styles from './index.less';

@connect(({ dataRole, loading }) => ({
  dataRole,
  loading,
}))
class DataAuthorAssignModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAssign: false,
    };
  }

  handlerShowAssign = () => {
    this.setState({ showAssign: true });
  };

  handlerBackAssigned = () => {
    this.setState({ showAssign: false });
  };

  handlerAssign = (keys, callback) => {
    const { dataRole, dispatch } = this.props;
    const { currentDataAuthorType, currentRole } = dataRole;
    dispatch({
      type: 'dataRole/saveAssignRelations',
      payload: {
        dataAuthorizeTypeId: currentDataAuthorType.id,
        dataRoleId: currentRole.id,
        entityIds: keys,
      },
      callback,
    });
  };

  handlerRemove = (keys, callback) => {
    const { dataRole, dispatch } = this.props;
    const { currentDataAuthorType, currentRole } = dataRole;
    dispatch({
      type: 'dataRole/removeAssignRelations',
      payload: {
        dataAuthorizeTypeId: currentDataAuthorType.id,
        dataRoleId: currentRole.id,
        entityIds: keys,
      },
      callback,
    });
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataRole/updateState',
      payload: {
        showDataAuthorAssign: false,
        currentDataAuthorType: null,
      },
    });
  };

  renderTitle = role => {
    const { showAssign } = this.state;
    const title = get(role, 'name', '');
    if (showAssign) {
      return (
        <>
          <ExtIcon onClick={this.handlerBackAssigned} type="left" className="trigger-back" antd />
          <BannerTitle
            title={title}
            subTitle={formatMessage({
              id: 'basic_000401',
              defaultMessage: '请选择要添加的数据权限',
            })}
          />
        </>
      );
    }
    return (
      <BannerTitle
        title={title}
        subTitle={formatMessage({ id: 'basic_000114', defaultMessage: '已配置的数据权限' })}
      />
    );
  };

  render() {
    const { dataRole, loading } = this.props;
    const { showDataAuthorAssign, currentDataAuthorType, currentRole } = dataRole;
    const { showAssign } = this.state;
    const extModalProps = {
      destroyOnClose: true,
      maskClosable: false,
      onCancel: this.closeFormModal,
      wrapClassName: cls(styles['assign-modal-box'], showAssign ? styles['assign-to-box'] : null),
      closable: !showAssign,
      keyboard: !showAssign,
      visible: showDataAuthorAssign,
      centered: true,
      width: 520,
      bodyStyle: { padding: 0, height: 560, width: 520, overflow: 'hidden' },
      footer: null,
      title: this.renderTitle(currentRole),
    };
    const assignProps = {
      currentRole,
      currentDataAuthorType,
      onBackAssigned: this.handlerBackAssigned,
      save: this.handlerAssign,
      saving: loading.effects['dataRole/saveAssignRelations'],
      extParams: { excludeDataRoleId: get(currentRole, 'id', null) },
    };
    const assignedProps = {
      currentRole,
      currentDataAuthorType,
      onShowAssign: this.handlerShowAssign,
      save: this.handlerRemove,
      saving: loading.effects['dataRole/removeAssignRelations'],
    };
    return (
      <ExtModal {...extModalProps}>
        {showAssign ? <Assign {...assignProps} /> : <Assinged {...assignedProps} />}
      </ExtModal>
    );
  }
}

export default DataAuthorAssignModal;
