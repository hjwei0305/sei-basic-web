/*
 * @Author: zp
 * @Date:   2020-02-17 11:36:34
 * @Last Modified by: Eason
 * @Last Modified time: 2020-08-10 09:13:22
 */
import { utils, message } from 'suid';
import { userUtils } from '@/utils';
import {
  findByUserId,
  saveProfile,
  saveEmailAlert,
  findMyEmailAlert,
  createAccount,
  updateAccount,
  updatePwd,
  sendVerifyCode,
  bindAccount,
  unBindAccount,
  getAccount,
} from '../service';

const { dvaModel, pathMatchRegexp } = utils;
const { modelExtend, model } = dvaModel;
const { getCurrentUser } = userUtils;

export default modelExtend(model, {
  namespace: 'userProfile',
  state: {
    basicInfo: null,
    activeTabKey: 'baiscInfo',
    mailAlert: null,
    editAccountVisable: false,
    resetPwdVisable: false,
    currAccount: null,
    userAccounts: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const user = getCurrentUser();
        if (pathMatchRegexp('/userProfile', location.pathname)) {
          dispatch({
            type: 'getUserInfo',
            payload: {
              userId: user.userId,
            },
          });
        }
      });
    },
  },
  effects: {
    *save({ payload }, { call }) {
      const res = yield call(saveProfile, payload);
      message.destroy();
      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }

      return res;
    },
    *getUserInfo({ payload }, { call, put }) {
      const res = yield call(findByUserId, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            basicInfo: res.data,
          },
        });
      } else {
        message.destroy();
        message.error(res.message);
      }

      return res;
    },
    *saveEmailAlert({ payload }, { call, put }) {
      const res = yield call(saveEmailAlert, payload);
      message.destroy();
      if (res.success) {
        message.success(res.message);
        yield put({
          type: 'updateState',
          payload: {
            mailAlert: res.data,
          },
        });
      } else {
        message.error(res.message);
      }

      return res;
    },
    *getEmailAlert({ payload }, { call, put }) {
      const res = yield call(findMyEmailAlert, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            mailAlert: res.data[0],
          },
        });
      } else {
        message.destroy();
        message.error(res.message);
      }

      return res;
    },
    *saveAccount({ payload }, { call }) {
      const service = payload.id ? updateAccount : createAccount;
      const res = yield call(service, payload);
      message.destroy();
      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }

      return res;
    },
    *updatePwd({ payload }, { call }) {
      const res = yield call(updatePwd, payload);
      message.destroy();
      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }

      return res;
    },
    *sendVerifyCode({ payload }, { call }) {
      const res = yield call(sendVerifyCode, payload);
      message.destroy();
      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }

      return res;
    },
    *bindAccount({ payload }, { call, put }) {
      const res = yield call(bindAccount, payload);
      message.destroy();
      if (res.success) {
        message.success(res.message);
        yield put({
          type: 'getAccount',
        });
      } else {
        message.error(res.message);
      }

      return res;
    },
    *unBindAccount({ payload }, { call, put }) {
      const res = yield call(unBindAccount, payload);
      message.destroy();
      if (res.success) {
        message.success(res.message);
        yield put({
          type: 'getAccount',
        });
      } else {
        message.error(res.message);
      }

      return res;
    },
    *getAccount(_, { call, put }) {
      const user = getCurrentUser();
      const res = yield call(getAccount, { userId: user.userId });
      const { message: msg, data: userAccounts, success } = res || {};
      message.destroy();
      if (success) {
        // message.success(msg);
        yield put({
          type: 'updateState',
          payload: {
            userAccounts,
          },
        });
      } else {
        message.error(msg);
      }

      return res;
    },
  },
});
