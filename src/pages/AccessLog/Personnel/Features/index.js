import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';
import { Drawer, Tag } from 'antd';
import { MoneyInput, ListCard, BannerTitle, Space } from 'suid';
import { DropdownOption } from '@/components';
import { constants } from '@/utils';
import styles from './index.less';

const { SERVER_PATH } = constants;
let localeTopNum;

class Features extends Component {
  static listCardRef;

  static propTypes = {
    user: PropTypes.object.isRequired,
    showFeature: PropTypes.bool,
    closeFeature: PropTypes.func,
    topNum: PropTypes.number,
    period: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { topNum } = props;
    this.state = {
      topNum,
    };
  }

  componentDidUpdate(preProps) {
    const { showFeature, topNum } = this.props;
    if (!isEqual(preProps.showFeature, showFeature) && !showFeature) {
      this.setState({ topNum });
    }
  }

  handlerClose = () => {
    const { closeFeature } = this.props;
    if (closeFeature) {
      closeFeature();
    }
  };

  handlerTopNumChange = topNum => {
    this.setState({ topNum });
  };

  handlerLocalTopNumChange = count => {
    localeTopNum = count;
  };

  handlerLocalTopNumSubmit = () => {
    this.handlerTopNumChange(localeTopNum);
  };

  renderCustomTool = () => {
    const { topNum } = this.state;
    return (
      <>
        <span style={{ marginLeft: 8 }}>
          <span className="label">排名数(Top)</span>
          <MoneyInput
            size="small"
            onBlur={this.handlerLocalTopNumSubmit}
            onChange={this.handlerLocalTopNumChange}
            value={topNum}
            precision={0}
            textAlign="left"
            style={{ width: 50, top: 9, left: 2, zIndex: 1 }}
          />
          <DropdownOption suffix="" interval={topNum} onChange={this.handlerTopNumChange} />
        </span>
      </>
    );
  };

  render() {
    const { topNum } = this.state;
    const { showFeature, period, user } = this.props;
    const listCardProps = {
      showSearch: false,
      showArrow: false,
      itemField: {
        avatar: ({ index }) => <Tag>{index + 1}</Tag>,
        title: item => `${item.feature}(${item.appModule})`,
        description: item => (
          <Space direction="vertical">
            {item.path}
            {`最近访问时间: ${item.accessTime}`}
          </Space>
        ),
        extra: item => <span className="count-tag">{item.countNum}</span>,
      },
      store: {
        url: `${SERVER_PATH}/sei-auth/accessRecord/getFeaturesByUser`,
      },
      cascadeParams: {
        account: get(user, 'userAccount'),
        period,
        topNum,
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.renderCustomTool,
    };
    return (
      <Drawer
        width={520}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showFeature}
        title={
          <BannerTitle
            title={`${get(user, 'userName')}(${get(user, 'userAccount')})`}
            subTitle="访问的功能排名"
          />
        }
        className={cls(styles['feature-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <ListCard {...listCardProps} />
      </Drawer>
    );
  }
}

export default Features;
