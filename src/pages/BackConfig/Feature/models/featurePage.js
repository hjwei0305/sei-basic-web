import { delFeature, saveFeature } from "../service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "featurePage",

  state: {
    listData: [],
    currentPageRow: null,
    showFormModal: false,
  },
  effects: {
    * saveFeature({ payload, callback }, { call }) {
      const re = yield call(saveFeature, payload);
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
