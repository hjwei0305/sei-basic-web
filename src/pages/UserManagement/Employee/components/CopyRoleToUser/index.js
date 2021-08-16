import React, { PureComponent } from 'react';
import { get, isObject } from 'lodash';
import cls from 'classnames';
import { connect } from 'dva';
import { Steps, Button } from 'antd';
import { ExtModal, message } from 'suid';
import { BannerTitle } from '@/components';
import RoleSelect from './RoleSelect';
import UserSelect from './UserSelect';
import ResultSelect from './ResultSelect';
import styles from './index.less';

const { Step } = Steps;

@connect(({ employee, loading }) => ({
  employee,
  loading,
}))
class CopyAuthModal extends PureComponent {
  static featureRoleSelected;

  static dataRoleSelected;

  static userSelected;

  constructor(props) {
    super(props);
    this.featureRoleSelected = { keys: [], items: {} };
    this.dataRoleSelected = { keys: [], items: {} };
    this.userSelected = { keys: [], items: {} };
    this.state = {
      step: 0,
    };
  }

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      this.setState({ step: 0 });
      this.featureRoleSelected = { keys: [], items: {} };
      this.dataRoleSelected = { keys: [], items: {} };
      this.userSelected = { keys: [], items: {} };
      closeModal();
    }
  };

  handlerPrev = () => {
    this.setState(state => ({ step: state.step - 1 }));
  };

  handlerNext = () => {
    const { step } = this.state;
    message.destroy();
    if (
      step === 0 &&
      this.featureRoleSelected.keys.length === 0 &&
      this.dataRoleSelected.keys.length === 0
    ) {
      message.error(formatMessage({id: 'basic_000153', defaultMessage: '请选择角色后再试'}));
      return;
    }
    if (step === 1 && this.userSelected.keys.length === 0) {
      message.error(formatMessage({id: 'basic_000154', defaultMessage: '请选择目标用户后再试'}));
      return;
    }
    this.setState(state => ({ step: state.step + 1 }));
  };

  handlerSave = () => {
    const { currentEmployee, dispatch } = this.props;
    dispatch({
      type: 'employee/copyToEmployees',
      payload: {
        dataRoleIds: this.dataRoleSelected.keys,
        featureRoleIds: this.featureRoleSelected.keys,
        targetEmployeeIds: this.userSelected.keys,
        employeeId: currentEmployee.id,
      },
      callback: res => {
        if (res.success) {
          this.handlerCloseModal();
        }
      },
    });
  };

  handlerFeatureRoleChange = (keys, items) => {
    this.featureRoleSelected.keys = keys;
    keys.forEach((key, index) => {
      if (isObject(items[index])) {
        this.featureRoleSelected.items[key] = items[index];
      }
    });
  };

  handlerDataRoleChange = (keys, items) => {
    this.dataRoleSelected.keys = keys;
    keys.forEach((key, index) => {
      if (isObject(items[index])) {
        this.dataRoleSelected.items[key] = items[index];
      }
    });
  };

  handlerUserSelectChange = (keys, items) => {
    this.userSelected.keys = keys;
    keys.forEach((key, index) => {
      if (isObject(items[index])) {
        this.userSelected.items[key] = items[index];
      }
    });
  };

  renderFootBtn = () => {
    const { step } = this.state;
    const { loading } = this.props;
    const saving = loading.effects['employee/copyToEmployees'];
    const btns = [
      <Button key="back" disabled={step === 0 || saving} onClick={this.handlerPrev}>
        {formatMessage({id: 'basic_000155', defaultMessage: '上一步'})}
      </Button>,
    ];
    if (step === 2) {
      btns.push(
        <Button
          key="submit"
          icon="check"
          loading={saving}
          type="primary"
          onClick={this.handlerSave}
        >
          {formatMessage({id: 'basic_000156', defaultMessage: '完成'})}
        </Button>,
      );
    } else {
      btns.push(
        <Button key="submit" type="primary" onClick={this.handlerNext}>
          {formatMessage({id: 'basic_000157', defaultMessage: '下一步'})}
        </Button>,
      );
    }
    return btns;
  };

  renderStepContent = () => {
    const { step } = this.state;
    const { currentEmployee } = this.props;
    const roleSelectProps = {
      currentEmployee,
      featureRoleSelectedKeys: this.featureRoleSelected.keys,
      dataRoleSelectedKeys: this.dataRoleSelected.keys,
      onFeatureRoleChange: this.handlerFeatureRoleChange,
      onDataRoleChange: this.handlerDataRoleChange,
    };
    const userSelectProps = {
      currentEmployee,
      userSelectedKeys: this.userSelected.keys,
      onUserSelectChange: this.handlerUserSelectChange,
    };
    const resultSelectProps = {
      featureRoleSelected: this.featureRoleSelected,
      dataRoleSelected: this.dataRoleSelected,
      userSelected: this.userSelected,
    };
    switch (step) {
      case 0:
        return <RoleSelect {...roleSelectProps} />;
      case 1:
        return <UserSelect {...userSelectProps} />;
      case 2:
        return <ResultSelect {...resultSelectProps} />;
      default:
    }
  };

  render() {
    const { currentEmployee, showModal } = this.props;
    const { step } = this.state;
    const title = get(currentEmployee, 'userName', '');
    const extModalProps = {
      destroyOnClose: true,
      maskClosable: false,
      onCancel: this.handlerCloseModal,
      wrapClassName: cls(styles['copy-modal-box']),
      visible: showModal,
      centered: true,
      width: 680,
      bodyStyle: { padding: 0, height: 520, overflow: 'hidden' },
      footer: this.renderFootBtn(),
      title: <BannerTitle title={title} subTitle={formatMessage({id: 'basic_000158', defaultMessage: '复制权限'})} />,
    };
    return (
      <ExtModal {...extModalProps}>
        <div className="step-box">
          <Steps current={step}>
            <Step title={formatMessage({id: 'basic_000159', defaultMessage: '选择角色'})} description="{formatMessage({id: 'basic_000160', defaultMessage: '选择想复制的功能角色、数据角色'})}。" />
            <Step title={formatMessage({id: 'basic_000161', defaultMessage: '选择用户'})} description={formatMessage({id: 'basic_000162', defaultMessage: '选择想将角色复制给指定的用户'})} />
            <Step title={formatMessage({id: 'basic_000156', defaultMessage: '完成'})} description={formatMessage({id: 'basic_000163', defaultMessage: '保存选择的结果'})} />
          </Steps>
        </div>
        <div className="copy-body">{this.renderStepContent()}</div>
      </ExtModal>
    );
  }
}

export default CopyAuthModal;
