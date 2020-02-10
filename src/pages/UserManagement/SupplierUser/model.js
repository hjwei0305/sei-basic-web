/*
* @Author: zp
* @Date:   2020-02-02 11:57:38
* @Last Modified by:   zp
* @Last Modified time: 2020-02-10 10:07:12
*/
import {
  del,
  getList,
  save,
  listAllTree,
  findByOrganizationId,
  copyToOrgNodes,
  assignEmployee,
  unAssignEmployee,
  assignFeatureRole,
  unAssignFeatureRole,
  assignDataRole,
  unAssignDataRole,
} from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { pathMatchRegexp, dvaModel } = utils;
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
    showEmployeeConfig: false,
  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen(location => {
  //       if (pathMatchRegexp("/userManagement/supplierUser", location.pathname)) {
  //         dispatch({
  //           type: "queryTree"
  //         });
  //       }
  //     });
  //   }
  // },
  effects: {
    * queryTree({ payload }, { call, put }) {
      const ds = yield call(listAllTree, payload);
      if (ds.success) {
        yield put({
          type: "updateState",
          payload: {
            treeData: ds.data
          }
        });
      } else {
        throw ds;
      }
    },
    * updateCurrNode ({ payload, }, { put, }) {
      yield put({
        type: "updateState",
        payload,
      });

      return payload;
    },
    * queryListByOrgId({ payload }, { call, put }) {
      const re = yield call(findByOrganizationId, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            list: re.data
          }
        });
      } else {
        throw re;
      }
    },
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
