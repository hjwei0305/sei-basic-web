import React, { Component } from 'react';
import { Icon, Button, Popconfirm, Tag } from 'antd';
import { connect } from 'dva';
import { utils } from 'suid';
import { get } from 'lodash';
import cls from 'classnames';
import { userUtils } from '@/utils';
import BindFormItem from './BindFormItem';
import UpdatePwd from './UpdatePwd/index';

import styles from './index.less';

const { getCurrentUser } = userUtils;
const channelMap = {
  SEI: 5,
  Mobile: 0,
  EMAIL: 1,
  WeChat: 2,
};

@connect(({ userProfile, loading }) => ({ userProfile, loading }))
class AccountBinding extends Component {
  state = {
    unfolds: [false, false],
    updatePwdAccount: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userProfile/getAccount',
      payload: {
        userId: get(this.contextUser, 'userId'),
      },
    });
  }

  contextUser = getCurrentUser();

  mobileReqId = utils.getUUID();

  emailReqId = utils.getUUID();

  toggleUnfold = (index, isUnfold) => {
    const { unfolds } = this.state;
    this.setState({
      unfolds: unfolds.map((it, idx) => {
        if (index === idx) {
          return isUnfold;
        }
        if (isUnfold) {
          return false;
        }
        return it;
      }),
    });
  };

  handleConfirm = item => {
    const { dispatch } = this.props;
    const { openId, channel } = item;
    dispatch({
      type: 'userProfile/unBindAccount',
      payload: {
        channel,
        openId,
      },
    });
  };

  getExtraCmp = index => {
    const { unfolds } = this.state;
    const isBind = this.hasBind();
    const item = isBind[index];
    if (item) {
      return (
        <Popconfirm
          title="是否解除绑定?"
          onConfirm={() => this.handleConfirm(item)}
          okText="是"
          cancelText="否"
        >
          <Button type="link">解绑</Button>
        </Popconfirm>
      );
    }

    if (index === 2) {
      return (
        <Button type="link" disabled>
          绑定
        </Button>
      );
    }

    return (
      <React.Fragment>
        {unfolds[index] ? (
          <Button type="link" onClick={() => this.toggleUnfold(index, false)}>
            收起
          </Button>
        ) : (
          <Button type="link" onClick={() => this.toggleUnfold(index, true)}>
            绑定
          </Button>
        )}
      </React.Fragment>
    );
  };

  getSeiAccountCmp = () => {
    const { userProfile } = this.props;
    const { userAccounts } = userProfile;
    const { updatePwdAccount } = this.state;
    return userAccounts
      .filter(it => it.channel === 'SEI')
      .map(item => {
        const { openId, account } = item;
        return (
          <li
            className={cls({
              'binding-item': true,
              'unfold-pwd-form': updatePwdAccount === openId,
            })}
            key={account}
          >
            <span className="logo-warpper">
              <Icon type="appstore" />
            </span>
            <span className={cls('item-title')}>平台帐号</span>
            <span className={cls('bind-status')}>
              <span className={cls('title')}>已绑定</span>
              {openId}
              {openId === account ? (
                <Tag style={{ marginLeft: 8 }} color="green">
                  主帐号
                </Tag>
              ) : null}
            </span>
            <span className={cls('item-extra')}>
              {updatePwdAccount === openId ? (
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({
                      updatePwdAccount: null,
                    });
                  }}
                >
                  收起
                </Button>
              ) : (
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({
                      updatePwdAccount: openId,
                    });
                  }}
                >
                  更新密码
                </Button>
              )}
            </span>
            <div
              className={cls({
                'pwd-form-wrapper': true,
              })}
            >
              {updatePwdAccount === openId ? (
                <UpdatePwd
                  editData={item}
                  afterUpdate={() => {
                    this.setState({
                      updatePwdAccount: null,
                    });
                  }}
                />
              ) : null}
            </div>
          </li>
        );
      });
  };

  hasBind = () => {
    const { userProfile } = this.props;
    const { userAccounts } = userProfile;
    const isBindArr = [false, false, false, false];
    userAccounts.forEach(it => {
      const { channel } = it;
      isBindArr[channelMap[channel]] = it;
    });
    return isBindArr;
  };

  render() {
    const { unfolds } = this.state;
    const [unfoldPhone, unfoldMail] = unfolds;
    const [mobileBind, emailBind, weChatBind] = this.hasBind();
    return (
      <ul className={cls(styles['account-binding-items'])}>
        {this.getSeiAccountCmp()}
        <li
          className={cls({
            'binding-item': true,
            unfold: mobileBind ? false : unfoldPhone,
          })}
        >
          <span className="logo-warpper">
            <Icon type="phone" />
          </span>
          <span className={cls('item-title')}>绑定手机</span>
          <span className={cls('bind-status')}>
            <span className={cls('title')}>{mobileBind ? '已绑定' : '未绑定'}</span>
            {mobileBind ? mobileBind.openId : null}
          </span>
          <span className={cls('item-extra')}>{this.getExtraCmp(0)}</span>
          <div className={cls('binding-form-wrapper')}>
            {unfoldPhone ? <BindFormItem reqId={this.mobileReqId} channel="Mobile" /> : null}
          </div>
        </li>
        <li
          className={cls({
            'binding-item': true,
            unfold: emailBind ? false : unfoldMail,
          })}
        >
          <span className="logo-warpper">
            <Icon type="mail" />
          </span>
          <span className={cls('item-title')}>绑定邮箱</span>
          <span className={cls('bind-status')}>
            <span className={cls('title')}>{emailBind ? '已绑定' : '未绑定'}</span>
            {emailBind ? emailBind.openId : null}
          </span>
          <span className={cls('item-extra')}>{this.getExtraCmp(1)}</span>
          <div className={cls('binding-form-wrapper')}>
            {unfoldMail ? <BindFormItem reqId={this.emailReqId} channel="EMAIL" /> : null}
          </div>
        </li>
        <li className={cls('binding-item')}>
          <span className="logo-warpper">
            <Icon type="wechat" />
          </span>
          <span className={cls('item-title')}>绑定企业微信</span>
          <span className={cls('bind-status')}>
            <span className={cls('title')}>{weChatBind ? '已绑定' : '未绑定'}</span>
            {weChatBind ? weChatBind.openId : null}
          </span>
          <span className={cls('item-extra')}>
            {this.getExtraCmp(2)}
            {/* <Button type="link" disabled>
              解绑
            </Button> */}
          </span>
        </li>
        <li className={cls('binding-item')}>
          <span className="logo-warpper">
            <Icon type="dingding" />
          </span>
          <span className={cls('item-title')}>绑定钉钉</span>
          <span className={cls('item-extra')}>
            <Button type="link" disabled>
              绑定
            </Button>
          </span>
        </li>
      </ul>
    );
  }
}

export default AccountBinding;
