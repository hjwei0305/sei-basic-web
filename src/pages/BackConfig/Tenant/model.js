import {
  delTenant,
  getTenantList,
  saveTenant,
  saveTenantRootOrganization,
  saveTenantAdmin,
  assignAppModuleItem,
  removeAssignedAppModuleItem,
  getUnAssignedAppModuleItemList
} from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "tenant",

  state: {
    listData: [],
    currentTenant: null,
    showAssignAppModule: false,
    unAssignListData: [],
    tenantAdmin: null,
    tenantRootOrganization: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp("/backConfig/tenant", location.pathname)) {
          dispatch({
            type: "getTenantList"
          });
        }
      });
    }
  },
  effects: {
    * getTenantList({ payload }, { call, put }) {
      const re = yield call(getTenantList, payload);
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
    * saveTenant({ payload, callback }, { call }) {
      const { tenantData, tenantRootOrganization } = payload;
      const re = yield call(saveTenant, { ...tenantData });
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
        const { organizationDto } = tenantData;
        if (!organizationDto || organizationDto && organizationDto.name !== tenantRootOrganization.name) {
          const org = yield call(saveTenantRootOrganization, { ...tenantRootOrganization });
          if (org.success) {
            message.success('组织机构保存成功');
          } else {
            message.error(org.message);
          }
        }
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * saveTenantAdmin({ payload, callback }, { call }) {
      const re = yield call(saveTenantAdmin, payload);
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
    * delTenant({ payload, callback }, { call, put }) {
      const re = yield call(delTenant, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
        yield put({
          type: "updateState",
          payload: {
            currentFeatureGroup: null
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * assignAppModuleItem({ payload, callback }, { call, put }) {
      const re = yield call(assignAppModuleItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.assign-success", defaultMessage: "分配成功" }));
        yield put({
          type: "updateState",
          payload: {
            showAssignAppModule: false,
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * removeAssignedAppModuleItem({ payload, callback }, { call }) {
      const re = yield call(removeAssignedAppModuleItem, payload);
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
    * getUnAssignedAppModuleItemList({ payload }, { call, put }) {
      const re = yield call(getUnAssignedAppModuleItemList, payload);
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
  }
});
