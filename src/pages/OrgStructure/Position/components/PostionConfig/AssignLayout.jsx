import React, { Component, } from 'react';
import { Card, Row, Col, } from 'antd';
import cls from 'classnames';
import styles from './index.less';

export default class PositionConfig extends Component {

  renderChildren = () => {
    const { children, } = this.props;
    const bordered = false;
    if (!children) {
      return null;
    }

    return [].concat(children).map((child) => {
      const { slot, } = child.props;
      if (['left', 'center', 'right'].includes(slot)) {
        if (slot === 'left') {
          return (
            <Col key={slot} className={cls('layout-col')} span={11}>
              <Card title="未分配" bordered={bordered} >
                {child}
              </Card>
            </Col>
          );
        }
        if (slot === 'center') {
          return (<Col key={slot} className={cls('layout-col', 'layout-col-center')} span={2}>
            <div className={cls('opt-wrapper')}>
              {child}
            </div>
          </Col>);
        }
        if (slot === 'right') {
          return (<Col key={slot} className={cls('layout-col')} span={11}>
            <Card title="已分配" bordered={bordered}>
              {child}
            </Card>
          </Col>);
        }
      }

      return null;
    }).filter(child => !!child);
  }

  render() {
    return (
      <Row className={cls(styles['assign-layout-wrapper'])}>
        {this.renderChildren()}
      </Row>
    );
  }
}
