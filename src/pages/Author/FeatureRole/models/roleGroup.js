import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { utils } from 'suid';
import { delRoleGroup, getRoleGroupList, saveRoleGroup } from '../service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'featureRoleGroup',

  state: {
    listData: [],
    currentRoleGroup: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathMatchRegexp('/author/featureRole', location.pathname)) {
          dispatch({
            type: 'getRoleGroupList',
          });
        }
      });
    },
  },
  effects: {
    * getRoleGroupList({ payload }, { call, put }) {
      const re = yield call(getRoleGroupList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            listData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    * saveRoleGroup({ payload, callback }, { call, put }) {
      const re = yield call(saveRoleGroup, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentFeatureGroup: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * delRoleGroup({ payload, callback }, { call, put }) {
      const re = yield call(delRoleGroup, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentFeatureGroup: null,
          },
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
