import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { utils } from 'suid';
import { del, getOrgList, save, move, } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'organization',

  state: {
    treeData: [],
    currentNode: null,
    moveVisible: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/orgStructure/organization', location.pathname)) {
          dispatch({
            type: 'getOrgList',
          });
        }
      });
    },
  },
  effects: {
    *getOrgList({ payload }, { call, put, select }) {
      const { currentNode } = yield select(s => s.organization);
      const re = yield call(getOrgList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: [re.data],
            currentNode,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *save({ payload, callback }, { call, put }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentNode: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *del({ payload, callback }, { call, put }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentNode: null,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *move({ payload, callback }, { call, put }) {
      const re = yield call(move, payload);
      message.destroy();
      if (re.success) {
        message.success('移动成功');
        yield put({
          type: 'updateState',
          payload: {
            moveVisible: false,
          },
        });
        yield put({
          type: 'getOrgList',
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
