/*
* @Author: zp
* @Date:   2020-02-02 11:57:38
* @Last Modified by:   zp
* @Last Modified time: 2020-02-10 16:14:58
*/
import {
  del,
  save,
  assignFeatureRole,
  unAssignFeatureRole,
  assignDataRole,
  unAssignDataRole,
} from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "supplierUser",

  state: {
    list: [],
    rowData: null,
    showModal: false,
    showCopyModal: false,
    treeData: [],
    currNode: null,
    showConfig: false,
  },
  effects: {
    * save({ payload }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    * del({ payload }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    * assignFeatureRole({ payload, }, { call, }) {
      const re = yield call(assignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
    * unAssignFeatureRole({ payload, }, { call, }) {
      const re = yield call(unAssignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
    * assignDataRole({ payload, }, { call, }) {
      const re = yield call(assignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
    * unAssignDataRole({ payload, }, { call, }) {
      const re = yield call(unAssignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
  }
});
