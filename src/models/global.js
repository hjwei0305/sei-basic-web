import router from "umi/router";
import { stringify } from "qs";
import { message } from "antd";
import { utils } from 'seid';
import { login } from "@/services/api";

const { constants, storage } = utils;
const { CONST_GLOBAL } = constants;

export default {
  namespace: "global",
  state: {
    showTenant: false,
    userAuthLoaded: false,
    locationPathName: "/",
    locationQuery: {}
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: "updateState",
          payload: {
            locationPathName: location.pathname,
            locationQuery: location.query
          }
        });
      });
    }
  },
  effects: {
    * redirectLogin({ payload }, { call, put, select }) {
      const global = yield select(_ => _.global);
      const { locationPathName, locationQuery } = global;
      let location = locationPathName;
      if (location.indexOf("/user/login") !== -1) {
        location = locationQuery.from || "/";
      }
      router.replace({
        pathname: "/user/login",
        search: stringify({
          from: location
        })
      });
    },
    * login({ payload }, { call, select }) {
      debugger; 
      const global = yield select(_ => _.global);
      const res = yield call(login, payload);
      message.destroy();
      storage.sessionStorage.clear();
      if (res.success) {
        message.success("登录成功");
        storage.sessionStorage.set(CONST_GLOBAL.TOKEN_KEY, res.data.sessionId);
        const { from } = global.locationQuery;
        if (from && from.indexOf("/user/login") === -1) {
          if (from === "/") {
            router.push("/dashboard");
          }
          else {
            router.push(from);
          }
        } else {
          router.push("/");
        }
      } else {
        message.error("登录失败");
      }
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
