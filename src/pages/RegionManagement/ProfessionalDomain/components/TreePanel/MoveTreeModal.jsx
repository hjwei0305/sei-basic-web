import React, { PureComponent } from "react";
import { Form, Input, Checkbox, } from "antd";
import { ExtModal, ComboGrid } from 'seid';
import TreeView from '@/components/TreeView';

class MoveTreeModal extends PureComponent {

  render() {
    const { visible, onCancel, onChange, treeData, onMove, title } = this.props;
    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        maskClosable={false}
        title={title}
        onOk={onMove}
        okText='移动'
        width={400}
      >
        <TreeView onChange={onChange} treeData={treeData}/>
      </ExtModal>
    );
  }
}

export default MoveTreeModal;
