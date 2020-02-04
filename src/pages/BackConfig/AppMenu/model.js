import { del, getMenuList, save, move } from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "appMenu",

  state: {
    treeData: [],
    currentNode: null,
    showMove: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp("/backConfig/appMenu", location.pathname)) {
          dispatch({
            type: "getMenuList"
          });
        }
      });
    }
  },
  effects: {
    * getMenuList({ payload }, { call, put }) {
      const re = yield call(getMenuList, payload);
      if (re.success) {
        yield put({
          type: "updateState",
          payload: {
            treeData: re.data
          }
        });
      } else {
        message.error(re.message);
      }
    },
    * save({ payload, callback }, { call, put }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
        yield put({
          type: "updateState",
          payload: {
            currentNode: re.data,
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * del({ payload, callback }, { call, put }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
        yield put({
          type: "updateState",
          payload: {
            currentNode: null,
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    * move({ payload, callback }, { call, put }) {
      const re = yield call(move, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "menu.move-success", defaultMessage: "菜单移动成功" }));
        yield put({
          type: "updateState",
          payload: {
            showMove: false,
          }
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  }
});