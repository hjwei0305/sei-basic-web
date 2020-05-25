/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2020-05-25 12:37:34
 */
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { utils } from 'suid';
import {
  del,
  save,
  listAllTree,
  copyToOrgNodes,
  assignUser,
  unAssignUser,
  assignFeatureRole,
  unAssignFeatureRole,
  assignDataRole,
  unAssignDataRole,
} from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'position',

  state: {
    showFormModal: false,
    showCopyModal: false,
    showConfigFeatrueRole: false,
    showConfigUser: false,
    showConfigDataRole: false,
    treeData: [],
    currentOrgNode: null,
    currentPosition: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/orgStructure/position', location.pathname)) {
          dispatch({
            type: 'queryTree',
          });
        }
      });
    },
  },
  effects: {
    *queryTree({ payload }, { call, put }) {
      const ds = yield call(listAllTree, payload);
      if (ds.success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: ds.data,
          },
        });
      } else {
        throw ds;
      }
    },
    *save({ payload, callback }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *del({ payload, callback }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *copyTo({ payload, callback }, { call }) {
      const re = yield call(copyToOrgNodes, payload);
      message.destroy();
      if (re.success) {
        message.success('复制成功');
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignUser({ payload, callback }, { call }) {
      const re = yield call(assignUser, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *unAssignUser({ payload, callback }, { call }) {
      const re = yield call(unAssignUser, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignFeatureRole({ payload, callback }, { call }) {
      const re = yield call(assignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *unAssignFeatureRole({ payload, callback }, { call }) {
      const re = yield call(unAssignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignDataRole({ payload, callback }, { call }) {
      const re = yield call(assignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *unAssignDataRole({ payload, callback }, { call }) {
      const re = yield call(unAssignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
