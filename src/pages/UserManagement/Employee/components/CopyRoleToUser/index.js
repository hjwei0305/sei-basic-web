import React, { PureComponent } from 'react';
import { get } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { Steps } from 'antd';
import { ExtModal } from 'suid';
import { BannerTitle } from '@/components';
import styles from './index.less';

const { Step } = Steps;

@connect(({ employee, loading }) => ({
  employee,
  loading,
}))
class CopyAuthModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
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

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      closeModal();
    }
  };

  render() {
    const { currentEmployee, showModal } = this.props;
    const title = get(currentEmployee, 'userName', '');
    const extModalProps = {
      destroyOnClose: true,
      maskClosable: false,
      onCancel: this.handlerCloseModal,
      wrapClassName: cls(styles['copy-modal-box']),
      visible: showModal,
      centered: true,
      width: 680,
      bodyStyle: { padding: 0, height: 560, overflow: 'hidden' },
      footer: null,
      title: <BannerTitle title={title} subTitle="复制权限" />,
    };
    return (
      <ExtModal {...extModalProps}>
        <div className="step-box">
          <Steps current={1}>
            <Step title="选择角色" description="This is a description." />
            <Step
              title="In Progress"
              subTitle="Left 00:00:08"
              description="This is a description."
            />
            <Step title="Waiting" description="This is a description." />
          </Steps>
        </div>
        <div className="copy-body">实现中...</div>
      </ExtModal>
    );
  }
}

export default CopyAuthModal;
