import {
  delDataRole,
  saveDataRole,
  getDataRoleList,
  getAssignedAuthDataList,
  getUnassignedAuthDataList,
  getAssignedAuthTreeDataList,
  getUnassignedAuthTreeDataList
} from "../service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "role",

  state: {
    listData: [],
    currentRole: null,
    assignData: [],
    unAssignData: [],
  },
  effects: {
    * getDataRoleList({ payload }, { call, put }) {
      const re = yield call(getDataRoleList, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            listData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
    * saveDataRole({ payload, callback }, { call }) {
      const re = yield call(saveDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * delDataRole({ payload, callback }, { call, put }) {
      const re = yield call(delDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
        yield put({
          type: "updateState",
          payload: {
            currentRole: null,
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * getAssignedAuthDataList({ payload }, { call, put }) {
      const re = yield call(getAssignedAuthDataList, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            assignData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
    * getUnassignedAuthDataList({ payload }, { call, put }) {
      const re = yield call(getUnassignedAuthDataList, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            unAssignData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
    * getAssignedAuthTreeDataList({ payload }, { call, put }) {
      const re = yield call(getAssignedAuthTreeDataList, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            assignData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
    * getUnassignedAuthTreeDataList({ payload }, { call, put }) {
      const re = yield call(getUnassignedAuthTreeDataList, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            unAssignData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
  }
});
