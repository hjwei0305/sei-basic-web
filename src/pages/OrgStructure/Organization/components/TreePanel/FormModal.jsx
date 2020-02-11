import React, { PureComponent } from "react";
import { formatMessage, } from "umi-plugin-react/locale";
import { ExtModal } from 'seid';
import FormPanel from '../FormPanel';


class FormModal extends PureComponent {

  render() {
    const { visible, onCancel } = this.props;
    const title = formatMessage({ id: "global.add", defaultMessage: "新建" });

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        maskClosable={false}
        title={title}
        onOk={() => {this.formRef.onFormSubmit()}}
        width={600}
      >
        <FormPanel onRef={inst => this.formRef = inst} isCreate={true}/>
      </ExtModal>
    );
  }
}

export default FormModal;
