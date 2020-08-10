import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { delFeatureGroup, getFeatureGroupList, saveFeatureGroup } from '../service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'featureGroup',

  state: {
    listData: [],
    currentFeatureGroup: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/backConfig/feature', location.pathname)) {
          dispatch({
            type: 'queryFeatureGroupList',
          });
        }
      });
    },
  },
  effects: {
    *queryFeatureGroupList({ payload }, { call, put }) {
      const re = yield call(getFeatureGroupList, payload);
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
    *saveFeatureGroup({ payload, callback }, { call, put }) {
      const re = yield call(saveFeatureGroup, payload);
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
    *delFeatureGroup({ payload, callback }, { call, put }) {
      const re = yield call(delFeatureGroup, payload);
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
