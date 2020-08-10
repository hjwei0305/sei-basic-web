/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2020-08-10 09:10:27
 */
import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { del, getList, save } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'corporation',

  state: {
    list: [],
    rowData: null,
    showModal: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/orgStructure/corporation', location.pathname)) {
          dispatch({
            type: 'queryList',
          });
        }
      });
    },
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const ds = yield call(getList, payload);
      if (ds.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: ds.data,
          },
        });
      } else {
        throw ds;
      }
    },
    *save({ payload }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    *del({ payload }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
      } else {
        message.error(re.message);
      }

      return re;
    },
  },
});
