import React, { Component, Suspense } from 'react';
import cls from 'classnames';
import { Popover } from 'antd';
import { ExtIcon, ListLoader } from 'suid';
import styles from './AssignView.less';

const ListAssign = React.lazy(() => import('./DataAuthorView/ListAssign'));
const TreeAssign = React.lazy(() => import('./DataAuthorView/TreeAssign'));

class Assign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handlerPopoverHide = () => {
    this.setState({
      visible: false,
    });
  };

  handlerShowChange = visible => {
    this.setState({ visible });
  };

  renderPopoverContent = () => {
    const { currentDataAuthorType, ...rest } = this.props;
    const assignProps = {
      handlerPopoverHide: this.handlerPopoverHide,
      currentDataAuthorType,
      ...rest,
    };
    if (currentDataAuthorType.beTree) {
      return (
        <Suspense fallback={<ListLoader />}>
          <TreeAssign {...assignProps} />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<ListLoader />}>
        <ListAssign {...assignProps} />
      </Suspense>
    );
  };

  render() {
    const { visible } = this.state;
    return (
      <Popover
        trigger="click"
        placement="leftTop"
        visible={visible}
        key="assign-popover-box"
        destroyTooltipOnHide
        onVisibleChange={v => this.handlerShowChange(v)}
        overlayClassName={cls(styles['assign-popover-box'])}
        content={this.renderPopoverContent()}
      >
        <span className={cls('assign-popover-box-trigger')}>
          <ExtIcon type="file-search" antd />
        </span>
      </Popover>
    );
  }
}

export default Assign;
