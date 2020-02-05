import React, { PureComponent } from "react";
import { Form, Input, Checkbox, } from "antd";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal, ComboGrid } from 'seid';
import FormPanel from '../FormPanel';


class CreateFormModal extends PureComponent {

  render() {
    const { visible, onCancel, formType,title, } = this.props;

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        maskClosable={false}
        title={title}
        onOk={() => {this.formRef.onFormSubmit()}}
        okText="新增"
        width={600}
      >
        <FormPanel onRef={inst => this.formRef = inst} formType={formType}/>
      </ExtModal>
    );
  }
}

export default CreateFormModal;
