import React, { Component } from 'react';
import { Drawer, Button } from 'antd';
import TreeView from '@/components/TreeView';

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
          移动
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
    return (
      <Drawer
        title={title}
        visible={visible}
        onClose={onClose}
        closable={closable}
        width={500}
      >
        <TreeView toolBar={this.getToolBarProps()} onChange={this.handleNodeChange} treeData={treeData} />
      </Drawer>
    );
  }
}

export default MoveNodeDrawer;
