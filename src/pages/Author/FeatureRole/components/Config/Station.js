import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { ExtModal } from 'suid';
import { Station } from '@/components';

class StationModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stationKeys: [],
    };
  }

  handlerFormSubmit = () => {
    // const { save, rowData } = this.props;
    // if (save) {
    //     const data = Object.assign({}, rowData);
    //     save(data);
    // }
  };

  handlerSelectChange = keys => {
    this.setState({ stationKeys: keys });
  };

  renderTitle = role => {
    const title = get(role, 'name', '');
    return (
      <>
        {title}
        <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>配置岗位</span>
      </>
    );
  };

  render() {
    const { rowData, closeFormModal, saving, showModal } = this.props;
    const { stationKeys } = this.state;
    const stationProps = {
      roleId: get(rowData, 'id', ''),
      onSelectChange: this.handlerSelectChange,
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        width={900}
        bodyStyle={{ padding: 0, height: 560 }}
        okButtonProps={{ disabled: stationKeys.length === 0 }}
        confirmLoading={saving}
        title={this.renderTitle(rowData)}
        onOk={this.handlerFormSubmit}
      >
        <Station {...stationProps} />
      </ExtModal>
    );
  }
}

export default StationModal;
