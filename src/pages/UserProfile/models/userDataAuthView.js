import { utils, message } from 'suid';
import {
  getDataAuthorTypeList,
  getAssignedAuthDataList,
  getAssignedAuthTreeDataList,
} from '../DataAuthView/service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'userDataAuthView',

  state: {
    dataAuthorTypeList: [],
    currentRoleId: null,
    currentRoleName: null,
    currentDataAuthorType: null,
    assignData: [],
  },
  effects: {
    *getDataAuthorTypeList({ payload }, { call, put }) {
      const re = yield call(getDataAuthorTypeList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            dataAuthorTypeList: re.data,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
    *getAssignedAuthDataList({ payload }, { call, put }) {
      const re = yield call(getAssignedAuthDataList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assignData: re.data,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
    *getAssignedAuthTreeDataList({ payload }, { call, put }) {
      const re = yield call(getAssignedAuthTreeDataList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assignData: re.data,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
  },
});
