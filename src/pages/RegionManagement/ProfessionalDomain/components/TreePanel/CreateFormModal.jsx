import React, { PureComponent } from 'react';
import { ExtModal } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import FormPanel from '../FormPanel';

class CreateFormModal extends PureComponent {
  render() {
    const { visible, onCancel, formType, title } = this.props;

    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        maskClosable={false}
        title={title}
        onOk={() => {
          this.formRef.onFormSubmit();
        }}
        okText={formatMessage({id: 'basic_000190', defaultMessage: '新增'})}
        width={600}
      >
        <FormPanel onRef={inst => (this.formRef = inst)} formType={formType} />
      </ExtModal>
    );
  }
}

export default CreateFormModal;
