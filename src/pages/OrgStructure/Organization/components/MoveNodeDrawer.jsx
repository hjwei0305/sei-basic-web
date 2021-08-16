import React, { Component } from 'react';
import { Drawer, Button } from 'antd';
import cls from 'classnames';
import TreeView from '@/components/TreeView';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './MoveNodeDrawer.less';

class MoveNodeDrawer extends Component {

  state = {
    currNode: null,
  }

  getToolBarProps = () => {
    const { onMove, saveing, } = this.props;
    const { currNode, } = this.state;

    return {
      left: (
        <Button
          style={{ marginRight: 8 }}
          type="primary"
          disabled={!currNode}
          onClick={() => {
            if (onMove) {
              onMove(currNode)
            }
          }}
          loading={saveing}
        >
          {formatMessage({id: 'basic_000194', defaultMessage: '确定'})}
        </Button>
      ),
    }
  }

  handleNodeChange = (node) => {
    this.setState({
      currNode: node
    });
  }

  render() {
    const { title, treeData, visible, onClose, closable=true } = this.props;
    const expandedKeys = (treeData || []).map(node => node.id);
    return (
      <Drawer
        title={title}
        visible={visible}
        onClose={onClose}
        closable={closable}
        className={cls(styles['custom-drawer-wrapper'])}
        width={500}
      >
        <TreeView expandedKeys={expandedKeys} toolBar={this.getToolBarProps()} onChange={this.handleNodeChange} treeData={treeData} />
      </Drawer>
    );
  }
}

export default MoveNodeDrawer;
