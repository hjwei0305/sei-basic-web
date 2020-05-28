import { message } from 'antd';
import { utils } from 'suid';
import { getAssignFeatureItem } from '../FeatureAuthView/service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'userFeatureAuthView',

  state: {
    currentRoleId: null,
    currentRoleName: null,
    assignListData: [],
  },
  effects: {
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
