import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import {
  delDataRole,
  saveDataRole,
  getDataRoleList,
  getAssignedAuthDataList,
  getUnassignedAuthDataList,
  getAssignedAuthTreeDataList,
  getUnassignedAuthTreeDataList,
  saveAssignRelations,
  removeAssignRelations,
  getAssignedEmployeesByDataRole,
  getAssignedPositionsByDataRole,
  unAssignStation,
  assignStation,
  unAssignUser,
  assignUser,
} from '../service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'dataRole',

  state: {
    listData: [],
    currentRole: null,
    showConfigStation: false,
    showConfigUser: false,
    showDataAuthorAssign: false,
    currentDataAuthorType: null,
    assignData: [],
    unAssignData: [],
    assignUserData: [],
    assinStationData: [],
  },
  effects: {
    *getDataRoleList({ payload }, { call, put }) {
      const re = yield call(getDataRoleList, payload);
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
    *saveDataRole({ payload, callback }, { call }) {
      const re = yield call(saveDataRole, payload);
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
    *delDataRole({ payload, callback }, { call, put }) {
      const re = yield call(delDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentRole: null,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *saveAssignRelations({ payload, callback }, { call }) {
      const re = yield call(saveAssignRelations, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.assign-success', defaultMessage: '分配成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *removeAssignRelations({ payload, callback }, { call }) {
      const re = yield call(removeAssignRelations, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.remove-success', defaultMessage: '移除成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
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
        message.error(re.message);
      }
    },
    *getUnassignedAuthDataList({ payload }, { call, put }) {
      const re = yield call(getUnassignedAuthDataList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            unAssignData: re.data,
          },
        });
      } else {
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
        message.error(re.message);
      }
    },
    *getUnassignedAuthTreeDataList({ payload }, { call, put }) {
      const re = yield call(getUnassignedAuthTreeDataList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            unAssignData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *getAssignedEmployeesByDataRole({ payload }, { call, put }) {
      const re = yield call(getAssignedEmployeesByDataRole, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assignUserData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *getAssignedPositionsByDataRole({ payload }, { call, put }) {
      const re = yield call(getAssignedPositionsByDataRole, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assinStationData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *assignStation({ payload, callback }, { call }) {
      const re = yield call(assignStation, payload);
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
    *unAssignStation({ payload, callback }, { call }) {
      const re = yield call(unAssignStation, payload);
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
  },
});
