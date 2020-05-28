import { message } from 'antd';
import { utils } from 'suid';
import { getRoleList, getAssignFeatureItem } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'featureView',

  state: {
    roleList: [],
    currentRoleId: null,
    currentRoleName: null,
    assignListData: [],
  },
  effects: {
    *getRoleList({ payload }, { call, put }) {
      const re = yield call(getRoleList, payload);
      let roleList = [];
      if (re.success) {
        roleList = re.data;
      } else {
        message.destroy();
        message.error(re.message);
      }
      yield put({
        type: 'updateState',
        payload: {
          roleList,
        },
      });
    },
    *getAssignFeatureItem({ payload, callback }, { call, put }) {
      const re = yield call(getAssignFeatureItem, payload);
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assignListData: re.data,
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
