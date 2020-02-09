import {
  delFeatureRole,
  saveFeatureRole,
  getFeatureRoleList,
  assignFeatureItem,
  removeAssignedFeatureItem,
  getUnAssignedFeatureItemList,
  getAssignedEmployeesByFeatureRole,
  getAssignedPositionsByFeatureRole
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
    showAssignFeature: false,
    unAssignListData: [],
    assignUserData: [],
    assinStationData: [],
  },
  effects: {
    * getFeatureRoleList({ payload }, { call, put }) {
      const re = yield call(getFeatureRoleList, payload);
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
    * saveFeatureRole({ payload, callback }, { call }) {
      const re = yield call(saveFeatureRole, payload);
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
    * delFeatureRole({ payload, callback }, { call, put }) {
      const re = yield call(delFeatureRole, payload);
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
    * assignFeatureItem({ payload, callback }, { call, put }) {
      const re = yield call(assignFeatureItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.assign-success", defaultMessage: "分配成功" }));
        yield put({
          type: "updateState",
          payload: {
            showAssignFeature: false,
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * removeAssignedFeatureItem({ payload, callback }, { call }) {
      const re = yield call(removeAssignedFeatureItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.remove-success", defaultMessage: "移除成功" }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * getUnAssignedFeatureItemList({ payload }, { call, put }) {
      const re = yield call(getUnAssignedFeatureItemList, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            unAssignListData: re.data,
          }
        });
      } else {
        message.error(re.message);
      }
    },
    * getAssignedEmployeesByFeatureRole({ payload }, { call, put }) {
      const re = yield call(getAssignedEmployeesByFeatureRole, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            assignUserData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
    * getAssignedPositionsByFeatureRole({ payload }, { call, put }) {
      const re = yield call(getAssignedPositionsByFeatureRole, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            assinStationData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
  }
});
