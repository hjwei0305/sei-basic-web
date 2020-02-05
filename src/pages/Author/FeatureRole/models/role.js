import { delFeatureRole, saveFeatureRole, getFeatureRoleList } from "../service";
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
    showFormModal: false,
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
    * delFeatureRole({ payload, callback }, { call }) {
      const re = yield call(delFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    }
  }
});
