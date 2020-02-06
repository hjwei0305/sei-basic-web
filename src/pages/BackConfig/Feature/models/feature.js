import { delFeature, saveFeature, getFeatureItemList } from "../service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "feature",

  state: {
    listData: [],
    currentPageRow: null,
    showFormModal: false,
    showFeatureItem: false,
  },
  effects: {
    * getFeatureItemList({ payload }, { call, put }) {
      const re = yield call(getFeatureItemList, payload);
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
    * saveFeature({ payload, callback }, { call, put }) {
      const re = yield call(saveFeature, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
        yield put({
          type: "updateState",
          payload: {
            showFormModal: false
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * delFeature({ payload, callback }, { call }) {
      const re = yield call(delFeature, payload);
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
